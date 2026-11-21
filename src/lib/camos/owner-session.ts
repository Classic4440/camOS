import { useSyncExternalStore } from "react";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL, recordSecurityEvent } from "./remote";

const STORAGE = "camos-owner-session";

export type OwnerUser = { id: string; email: string };

type Tokens = {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: OwnerUser;
};

export type OwnerState = { status: "loading" } | { status: "out" } | { status: "in"; user: OwnerUser; expiresAt: number };

let state: OwnerState = { status: "loading" };
let tokens: Tokens | null = null;
const listeners = new Set<() => void>();
let bootStarted = false;

function emit(next: OwnerState) {
  state = next;
  for (const listener of listeners) listener();
}

function authHeaders(accessToken?: string): HeadersInit {
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    "Content-Type": "application/json",
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

function readStored(): Tokens | null {
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Tokens;
    if (!parsed.access_token || !parsed.refresh_token || !parsed.user?.id) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(next: Tokens | null) {
  tokens = next;
  if (!next) localStorage.removeItem(STORAGE);
  else localStorage.setItem(STORAGE, JSON.stringify(next));
  emit(next ? { status: "in", user: next.user, expiresAt: next.expires_at } : { status: "out" });
}

function userFrom(value: unknown): OwnerUser | null {
  if (!value || typeof value !== "object") return null;
  const record = value as { id?: string; email?: string; user?: { id?: string; email?: string } };
  const id = record.id ?? record.user?.id;
  const email = record.email ?? record.user?.email;
  if (!id || !email) return null;
  return { id, email };
}

function tokensFrom(body: unknown): Tokens | null {
  if (!body || typeof body !== "object") return null;
  const record = body as { access_token?: string; refresh_token?: string; expires_in?: number; expires_at?: number; user?: unknown };
  const user = userFrom(record.user ?? record);
  if (!record.access_token || !record.refresh_token || !user) return null;
  const expiresAt = record.expires_at
    ? record.expires_at
    : Math.floor(Date.now() / 1000) + (record.expires_in ?? 3600);
  return { access_token: record.access_token, refresh_token: record.refresh_token, expires_at: expiresAt, user };
}

async function errorText(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { msg?: string; error_description?: string; message?: string };
    return body.msg || body.error_description || body.message || "The request was refused.";
  } catch {
    return "The request was refused.";
  }
}

export function deviceLabel(): string {
  const existing = localStorage.getItem("camos-device");
  if (existing) return existing;
  const label = `browser-${crypto.randomUUID().slice(0, 8)}`;
  localStorage.setItem("camos-device", label);
  return label;
}

export async function ensureOwner(): Promise<void> {
  if (bootStarted) return;
  bootStarted = true;
  const stored = readStored();
  if (!stored) {
    emit({ status: "out" });
    return;
  }
  tokens = stored;
  if (stored.expires_at * 1000 > Date.now() + 30_000) {
    emit({ status: "in", user: stored.user, expiresAt: stored.expires_at });
    return;
  }
  const refreshed = await refreshSession(stored.refresh_token);
  if (!refreshed.ok) emit({ status: "out" });
}

async function refreshSession(refreshToken: string): Promise<{ ok: true } | { ok: false }> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!response.ok) {
    writeStored(null);
    return { ok: false };
  }
  const next = tokensFrom(await response.json());
  if (!next) {
    writeStored(null);
    return { ok: false };
  }
  writeStored(next);
  return { ok: true };
}

export async function accessToken(): Promise<string | null> {
  await ensureOwner();
  if (!tokens) return null;
  if (tokens.expires_at * 1000 < Date.now() + 30_000) {
    const refreshed = await refreshSession(tokens.refresh_token);
    if (!refreshed.ok) return null;
  }
  return tokens?.access_token ?? null;
}

export function currentOwner(): OwnerUser | null {
  return state.status === "in" ? state.user : null;
}

/**
 * Consume Supabase invite / magic-link tokens from the URL hash
 * (`#access_token=…&refresh_token=…&type=invite`) and establish a session.
 */
export async function acceptInviteSession(): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  if (typeof window === "undefined") return { ok: false, error: "Not in a browser." };

  const hash = window.location.hash.replace(/^#/, "");
  const params = new URLSearchParams(hash);
  const access = params.get("access_token");
  const refresh = params.get("refresh_token");
  const errorDescription = params.get("error_description") || params.get("error");

  if (errorDescription) {
    return { ok: false, error: decodeURIComponent(errorDescription.replace(/\+/g, " ")) };
  }

  if (!access || !refresh) {
    // Already signed in from a previous accept on this tab.
    await ensureOwner();
    if (state.status === "in") return { ok: true, email: state.user.email };
    return { ok: false, error: "This invite link is invalid or has expired." };
  }

  const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: authHeaders(access),
  });
  if (!userResponse.ok) {
    return { ok: false, error: await errorText(userResponse) };
  }
  const userBody = (await userResponse.json()) as unknown;
  const user = userFrom(userBody);
  if (!user) return { ok: false, error: "Could not read the invited account." };

  const expiresIn = Number(params.get("expires_in") || "3600");
  writeStored({
    access_token: access,
    refresh_token: refresh,
    expires_at: Math.floor(Date.now() / 1000) + (Number.isFinite(expiresIn) ? expiresIn : 3600),
    user,
  });
  bootStarted = true;

  // Clear tokens from the address bar.
  const clean = `${window.location.pathname}${window.location.search}`;
  window.history.replaceState(null, "", clean);

  await recordSecurityEvent(access, user.id, "invite-accepted", deviceLabel());
  return { ok: true, email: user.email };
}

export async function signInOwner(email: string, password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  const next = tokensFrom(await response.json());
  if (!next) return { ok: false, error: "Email confirmation is still required." };
  writeStored(next);
  await recordSecurityEvent(next.access_token, next.user.id, "sign-in", deviceLabel());
  return { ok: true };
}

export async function createOwner(email: string, password: string): Promise<{ ok: true; pending: boolean } | { ok: false; error: string }> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email, password }),
  });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  const body = (await response.json()) as unknown;
  const next = tokensFrom(body);
  if (next) {
    writeStored(next);
    return { ok: true, pending: false };
  }
  return { ok: true, pending: true };
}

export async function recoverOwner(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const response = await fetch(`${SUPABASE_URL}/auth/v1/recover`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ email }),
  });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  return { ok: true };
}

export async function changeOwnerPassword(password: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await accessToken();
  if (!token || !tokens) return { ok: false, error: "Sign in first." };
  const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify({ password }),
  });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  await recordSecurityEvent(token, tokens.user.id, "password-change", deviceLabel());
  return { ok: true };
}

export async function signOutOwner(everywhere = false): Promise<void> {
  const token = tokens?.access_token;
  if (token) {
    await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({ scope: everywhere ? "global" : "local" }),
    }).catch(() => undefined);
  }
  writeStored(null);
}

export type Factor = { id: string; status: string; friendly_name: string };

export async function listFactors(): Promise<{ ok: true; factors: Factor[] } | { ok: false; error: string }> {
  const token = await accessToken();
  if (!token) return { ok: false, error: "Sign in first." };
  const response = await fetch(`${SUPABASE_URL}/auth/v1/factors`, { headers: authHeaders(token) });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  const body = (await response.json()) as { all?: { id: string; status: string; friendly_name?: string }[] } | { id: string; status: string; friendly_name?: string }[];
  const rows = Array.isArray(body) ? body : (body.all ?? []);
  return { ok: true, factors: rows.map((row) => ({ id: row.id, status: row.status, friendly_name: row.friendly_name || "Authenticator" })) };
}

export async function enrollFactor(): Promise<{ ok: true; id: string; secret: string } | { ok: false; error: string }> {
  const token = await accessToken();
  if (!token) return { ok: false, error: "Sign in first." };
  const response = await fetch(`${SUPABASE_URL}/auth/v1/factors`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ factor_type: "totp", friendly_name: deviceLabel(), issuer: "CamOS" }),
  });
  if (!response.ok) return { ok: false, error: await errorText(response) };
  const body = (await response.json()) as { id?: string; totp?: { secret?: string } };
  if (!body.id || !body.totp?.secret) return { ok: false, error: "No authenticator secret was returned." };
  return { ok: true, id: body.id, secret: body.totp.secret };
}

export async function verifyFactor(factorId: string, code: string): Promise<{ ok: true } | { ok: false; error: string }> {
  const token = await accessToken();
  if (!token) return { ok: false, error: "Sign in first." };
  const challenge = await fetch(`${SUPABASE_URL}/auth/v1/factors/${factorId}/challenge`, {
    method: "POST",
    headers: authHeaders(token),
    body: "{}",
  });
  if (!challenge.ok) return { ok: false, error: await errorText(challenge) };
  const challengeBody = (await challenge.json()) as { id?: string };
  if (!challengeBody.id) return { ok: false, error: "No challenge was issued." };
  const verify = await fetch(`${SUPABASE_URL}/auth/v1/factors/${factorId}/verify`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ challenge_id: challengeBody.id, code }),
  });
  if (!verify.ok) return { ok: false, error: await errorText(verify) };
  return { ok: true };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useOwnerSession(): OwnerState {
  return useSyncExternalStore(subscribe, () => state, () => ({ status: "loading" }) as OwnerState);
}

if (typeof window !== "undefined") void ensureOwner();
