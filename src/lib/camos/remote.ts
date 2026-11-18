import { parseDeskFile, deskSnapshot } from "./backup";
import type { DeskData } from "./types";

/** Publishable key. Safe in the client; Row Level Security is what actually limits the table. */
const URL = "https://qeebfpsqdwrjsgoclock.supabase.co";
const KEY = "sb_publishable_Nu8PnFSfMgtu61hhMToe0A_y72qNqrn";
const ROW = "primary";

export const DESK_SQL = `create table if not exists public.desk (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.desk enable row level security;

drop policy if exists "desk read" on public.desk;
drop policy if exists "desk insert" on public.desk;
drop policy if exists "desk update" on public.desk;

create policy "desk read" on public.desk for select to anon, authenticated using (true);
create policy "desk insert" on public.desk for insert to anon, authenticated with check (true);
create policy "desk update" on public.desk for update to anon, authenticated using (true) with check (true);`;

export type RemoteDesk =
  | { ok: true; desk: DeskData | null; updatedAt: string | null }
  | { ok: false; missing: boolean; error: string };

function headers(extra?: Record<string, string>): HeadersInit {
  return {
    apikey: KEY,
    Authorization: `Bearer ${KEY}`,
    "Content-Type": "application/json",
    ...extra,
  };
}

export async function fetchRemoteDesk(): Promise<RemoteDesk> {
  let response: Response;
  try {
    response = await fetch(`${URL}/rest/v1/desk?id=eq.${ROW}&select=payload,updated_at`, { headers: headers() });
  } catch {
    return { ok: false, missing: false, error: "Supabase did not answer." };
  }
  const text = await response.text();
  if (!response.ok) {
    const missing = text.includes("PGRST205");
    return { ok: false, missing, error: missing ? "The desk table is not in this project yet." : "Supabase refused the read." };
  }
  let rows: { payload?: unknown; updated_at?: string }[];
  try {
    rows = JSON.parse(text) as { payload?: unknown; updated_at?: string }[];
  } catch {
    return { ok: false, missing: false, error: "Supabase sent an unreadable reply." };
  }
  const row = rows[0];
  if (!row) return { ok: true, desk: null, updatedAt: null };
  const parsed = parseDeskFile(JSON.stringify({ camos: 1, desk: row.payload }));
  if (!parsed.ok) return { ok: false, missing: false, error: parsed.error };
  return { ok: true, desk: parsed.desk, updatedAt: row.updated_at ?? null };
}

export async function saveRemoteDesk(data: DeskData): Promise<{ ok: true; updatedAt: string } | { ok: false; missing: boolean; error: string }> {
  const updatedAt = new Date().toISOString();
  let response: Response;
  try {
    response = await fetch(`${URL}/rest/v1/desk?on_conflict=id`, {
      method: "POST",
      headers: headers({ Prefer: "resolution=merge-duplicates,return=representation" }),
      body: JSON.stringify({ id: ROW, payload: deskSnapshot(data), updated_at: updatedAt }),
    });
  } catch {
    return { ok: false, missing: false, error: "Supabase did not answer." };
  }
  const text = await response.text();
  if (!response.ok) {
    const missing = text.includes("PGRST205");
    return { ok: false, missing, error: missing ? "The desk table is not in this project yet." : "Supabase refused the save." };
  }
  return { ok: true, updatedAt };
}
