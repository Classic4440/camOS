import assert from "node:assert/strict";
import test from "node:test";
import { createVault, lockVault, openSeal, seal, unlockVault, vaultKey } from "./otp-vault.ts";
import { parseOtp, totp } from "./otp.ts";

test("RFC 6238 SHA1 vector at 59 seconds", async () => {
  const code = await totp("GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ", 59_000);
  assert.equal(code, "287082");
});

test("an otpauth URI keeps the issuer and secret", () => {
  const parsed = parseOtp("otpauth://totp/GitHub:daniel@example.com?secret=JBSWY3DPEHPK3PXP&issuer=GitHub");
  assert.equal(parsed.issuer, "GitHub");
  assert.equal(parsed.account, "daniel@example.com");
  assert.equal(parsed.secret, "JBSWY3DPEHPK3PXP");
});

test("a vault round-trips a secret and rejects the wrong passphrase", async () => {
  const vault = await createVault("correct horse");
  const key = vaultKey();
  assert.ok(key);
  const sealed = await seal(key!, "JBSWY3DPEHPK3PXP");
  assert.equal(await openSeal(key!, sealed.cipher, sealed.iv), "JBSWY3DPEHPK3PXP");
  lockVault();
  await assert.rejects(() => unlockVault(vault, "wrong horse"), /does not open/);
  await unlockVault(vault, "correct horse");
  assert.ok(vaultKey());
  lockVault();
});
