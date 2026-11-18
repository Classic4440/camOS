import assert from "node:assert/strict";
import test from "node:test";
import { dataHeaders, SUPABASE_PUBLISHABLE_KEY } from "./remote.ts";

test("desk calls refuse the publishable key as a user credential", () => {
  assert.throws(() => dataHeaders(SUPABASE_PUBLISHABLE_KEY), /Anonymous desk access is refused/);
  assert.throws(() => dataHeaders(""), /Anonymous desk access is refused/);
});

test("a real session token is the bearer, and the publishable key stays the apikey", () => {
  const headers = dataHeaders("session-token") as Record<string, string>;
  assert.equal(headers.Authorization, "Bearer session-token");
  assert.equal(headers.apikey, SUPABASE_PUBLISHABLE_KEY);
  assert.notEqual(headers.Authorization, `Bearer ${SUPABASE_PUBLISHABLE_KEY}`);
});
