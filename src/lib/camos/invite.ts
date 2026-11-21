import { accessToken } from "./owner-session";
import { SUPABASE_PUBLISHABLE_KEY, SUPABASE_URL } from "./remote";

export type InviteMode = "email" | "link";

export type InviteResult =
  | { ok: true; mode: "email"; email: string; userId: string | null }
  | { ok: true; mode: "link"; email: string; link: string }
  | { ok: false; error: string };

/** Call the owner-only invite Edge Function. */
export async function inviteUser(email: string, mode: InviteMode): Promise<InviteResult> {
  const token = await accessToken();
  if (!token) return { ok: false, error: "Sign in first." };

  const trimmed = email.trim().toLowerCase();
  if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { ok: false, error: "A valid email is required." };
  }

  let response: Response;
  try {
    response = await fetch(`${SUPABASE_URL}/functions/v1/invite-user`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: trimmed, mode }),
    });
  } catch {
    return { ok: false, error: "The invite service did not answer." };
  }

  let body: {
    ok?: boolean;
    mode?: string;
    email?: string;
    link?: string;
    userId?: string | null;
    error?: string;
  };
  try {
    body = (await response.json()) as typeof body;
  } catch {
    return { ok: false, error: "The invite service returned an unreadable reply." };
  }

  if (!response.ok || body.error) {
    return { ok: false, error: body.error || "Invite failed." };
  }

  if (mode === "link") {
    if (!body.link) return { ok: false, error: "No invite link was returned." };
    return { ok: true, mode: "link", email: trimmed, link: body.link };
  }

  return { ok: true, mode: "email", email: trimmed, userId: body.userId ?? null };
}

/** True when the signed-in user is the CamOS admin (can invite). */
export async function fetchIsAdmin(): Promise<boolean> {
  const token = await accessToken();
  if (!token) return false;
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_admin`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_PUBLISHABLE_KEY,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: "{}",
    });
    if (!response.ok) return false;
    const value = (await response.json()) as unknown;
    return value === true;
  } catch {
    return false;
  }
}
