import assert from "node:assert/strict";
import test from "node:test";
import { parseDeskFile } from "./backup.ts";

const arrays = [
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
];

test("a minimal desk file is accepted", () => {
  const desk: Record<string, unknown> = { settings: { called: "Daniel", artist: "Cam Leinad" } };
  for (const key of arrays) desk[key] = key === "releases" ? [{ catalog: "CAM-001" }] : [];
  const parsed = parseDeskFile(JSON.stringify({ camos: 1, desk }));
  assert.equal(parsed.ok, true);
  if (!parsed.ok) return;
  assert.equal(parsed.desk.settings.artist, "Cam Leinad");
  assert.equal(parsed.desk.releases[0]?.catalog, "CAM-001");
});

test("a foreign file is refused", () => {
  const parsed = parseDeskFile(JSON.stringify({ hello: "world" }));
  assert.equal(parsed.ok, false);
});
