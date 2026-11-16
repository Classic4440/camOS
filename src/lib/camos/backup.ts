import type { DeskData } from "./types";

const ARRAYS = [
  "tasks",
  "decisions",
  "releases",
  "sessions",
  "royalties",
  "customers",
  "orders",
  "inventory",
  "quotes",
  "projects",
  "bugs",
  "techDecisions",
  "deploys",
  "txns",
  "trades",
  "paths",
  "exercises",
  "notes",
  "ideas",
  "campaigns",
  "memos",
] as const satisfies readonly (keyof DeskData)[];

export function deskSnapshot(data: DeskData): DeskData {
  const desk = { settings: data.settings } as DeskData;
  for (const key of ARRAYS) {
    assign(desk, data, key);
  }
  return desk;
}

function assign<K extends (typeof ARRAYS)[number]>(desk: DeskData, data: DeskData, key: K) {
  desk[key] = data[key];
}

export function serializeDesk(data: DeskData): string {
  return JSON.stringify({ camos: 1, desk: deskSnapshot(data) }, null, 2);
}

export function parseDeskFile(text: string): { ok: true; desk: DeskData } | { ok: false; error: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return { ok: false, error: "That file is not JSON." };
  }
  if (!parsed || typeof parsed !== "object") return { ok: false, error: "That file is not a CamOS desk." };
  const body = parsed as { camos?: unknown; desk?: unknown };
  if (body.camos !== 1 || !body.desk || typeof body.desk !== "object") {
    return { ok: false, error: "This is not a CamOS desk file." };
  }
  const desk = body.desk as Partial<DeskData>;
  if (!desk.settings || typeof desk.settings !== "object" || typeof desk.settings.called !== "string") {
    return { ok: false, error: "The desk file has no name for you." };
  }
  for (const key of ARRAYS) {
    if (!Array.isArray(desk[key])) return { ok: false, error: `The desk file is missing ${key}.` };
  }
  return { ok: true, desk: desk as DeskData };
}
