import { parseDeskFile, deskSnapshot } from "./backup";
import type { DeskData } from "./types";

/** Publishable key. It identifies the project. It is never sent as the user credential. */
export const SUPABASE_URL = "https://qeebfpsqdwrjsgoclock.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_Nu8PnFSfMgtu61hhMToe0A_y72qNqrn";

export function dataHeaders(accessToken: string, extra?: Record<string, string>): HeadersInit {
  if (!accessToken || accessToken === SUPABASE_PUBLISHABLE_KEY || accessToken.startsWith("sb_publishable_")) {
    throw new Error("Anonymous desk access is refused.");
  }
  return {
    apikey: SUPABASE_PUBLISHABLE_KEY,
    Authorization: `Bearer ${accessToken}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export type RemoteDesk =
  | { ok: true; desk: DeskData | null; updatedAt: string | null }
  | { ok: false; missing: boolean; error: string };

/** Live check used by the lock screen. Selects ids only, never the payload. */
export async function anonymousDeskIsOpen(): Promise<boolean> {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/desk?select=id&limit=1`, {
      headers: { apikey: SUPABASE_PUBLISHABLE_KEY, Authorization: `Bearer ${SUPABASE_PUBLISHABLE_KEY}` },
    });
    if (!response.ok) return false;
    const rows = (await response.json()) as unknown;
    return Array.isArray(rows) && rows.length > 0;
  } catch {
    return false;
  }
}

/** Ensure a private desk row exists for the current user (id = auth.uid()). */
export async function claimOwner(accessToken: string): Promise<{ ok: true } | { ok: false; missing: boolean; error: string }> {
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/claim_owner`, {
      method: "POST",
      headers: dataHeaders(accessToken),
      body: "{}",
    });
  } catch {
    return { ok: false, missing: false, error: "Supabase did not answer." };
  }
  if (response.ok) return { ok: true };
  const text = await response.text();
  const missing = text.includes("PGRST202") || text.includes("PGRST205") || response.status === 404;
  return { ok: false, missing, error: missing ? "The owner migration has not been run." : "The desk could not be claimed." };
}

/** Fetch the signed-in user's own desk (RLS: id = auth.uid()::text). */
export async function fetchRemoteDesk(accessToken: string, userId: string): Promise<RemoteDesk> {
  let response: Response;
  try {
    response = await fetch(
      `${SUPABASE_URL}/rest/v1/desk?id=eq.${encodeURIComponent(userId)}&select=payload,updated_at`,
      { headers: dataHeaders(accessToken) },
    );
  } catch (error) {
    return { ok: false, missing: false, error: error instanceof Error ? error.message : "Supabase did not answer." };
  }
  const text = await response.text();
  if (!response.ok) {
    const missing = text.includes("PGRST205");
    return { ok: false, missing, error: missing ? "The desk table is missing." : "Supabase refused the read." };
  }
  let rows: { payload?: unknown; updated_at?: string }[];
  try {
    rows = JSON.parse(text) as { payload?: unknown; updated_at?: string }[];
  } catch {
    return { ok: false, missing: false, error: "Supabase sent an unreadable reply." };
  }
  const row = rows[0];
  if (!row) return { ok: true, desk: null, updatedAt: null };
  // Empty payload means a fresh user desk — treat as no desk yet.
  if (!row.payload || (typeof row.payload === "object" && Object.keys(row.payload as object).length === 0)) {
    return { ok: true, desk: null, updatedAt: row.updated_at ?? null };
  }
  const parsed = parseDeskFile(JSON.stringify({ camos: 1, desk: row.payload }));
  if (!parsed.ok) return { ok: false, missing: false, error: parsed.error };
  return { ok: true, desk: parsed.desk, updatedAt: row.updated_at ?? null };
}

export async function saveRemoteDesk(
  accessToken: string,
  ownerId: string,
  data: DeskData,
): Promise<{ ok: true; updatedAt: string } | { ok: false; missing: boolean; error: string }> {
  const updatedAt = new Date().toISOString();
  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/rest/v1/desk?on_conflict=id`, {
      method: "POST",
      headers: dataHeaders(accessToken, { Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify({
        id: ownerId,
        owner_id: ownerId,
        payload: deskSnapshot(data),
        updated_at: updatedAt,
      }),
    });
  } catch (error) {
    return { ok: false, missing: false, error: error instanceof Error ? error.message : "Supabase did not answer." };
  }
  const text = await response.text();
  if (!response.ok) {
    const missing = text.includes("PGRST205") || text.includes("owner_id");
    return { ok: false, missing, error: missing ? "The owner migration has not been run." : "Supabase refused the save." };
  }
  return { ok: true, updatedAt };
}

export async function recordSecurityEvent(accessToken: string, ownerId: string, kind: string, detail: string): Promise<void> {
  try {
    await fetch(`${SUPABASE_URL}/rest/v1/security_events`, {
      method: "POST",
      headers: dataHeaders(accessToken, { Prefer: "return=minimal" }),
      body: JSON.stringify({ owner_id: ownerId, kind, detail }),
    });
  } catch {
    // The event table exists only after the owner migration.
  }
}
