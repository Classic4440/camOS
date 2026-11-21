import type { OtpEntry, OtpVault, OtpVaultV1, OtpVaultV2 } from "./types";
import { generateRecoveryPhrase, normalizePhrase } from "./recovery-phrase";

const CHECK = "camos-otp-ok";
const ITERATIONS = 120_000;

/** Unwrapped data-encryption key while the vault is open. Never persisted. */
let openDek: CryptoKey | null = null;

export function vaultKey(): CryptoKey | null {
  return openDek;
}

export function lockVault(): void {
  openDek = null;
}

function raw(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

function encode(bytes: Uint8Array): string {
  let text = "";
  for (const byte of bytes) text += String.fromCharCode(byte);
  return btoa(text);
}

function decode(text: string): Uint8Array {
  const bin = atob(text);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i += 1) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKek(secret: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: raw(salt), iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** DEK must be extractable so change-passphrase can re-wrap it. */
async function importDek(rawKey: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle.importKey("raw", raw(rawKey), { name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
}

async function exportDek(key: CryptoKey): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.exportKey("raw", key));
}

export async function seal(key: CryptoKey, text: string): Promise<{ cipher: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(text)));
  return { cipher: encode(sealed), iv: encode(iv) };
}

export async function openSeal(key: CryptoKey, cipher: string, iv: string): Promise<string> {
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw(decode(iv)) }, key, raw(decode(cipher)));
  return new TextDecoder().decode(plain);
}

async function wrapDek(kek: CryptoKey, dekBytes: Uint8Array): Promise<{ cipher: string; iv: string }> {
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const sealed = new Uint8Array(await crypto.subtle.encrypt({ name: "AES-GCM", iv }, kek, raw(dekBytes)));
  return { cipher: encode(sealed), iv: encode(iv) };
}

async function unwrapDek(kek: CryptoKey, cipher: string, iv: string): Promise<CryptoKey> {
  const plain = new Uint8Array(await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw(decode(iv)) }, kek, raw(decode(cipher))));
  return importDek(plain);
}

export type CreateVaultResult = { vault: OtpVaultV2; recoveryPhrase: string };

/** Create a v2 vault. Returns the vault (ciphertext only) and a one-time recovery phrase. */
export async function createVault(passphrase: string): Promise<CreateVaultResult> {
  if (passphrase.trim().length < 8) throw new Error("Use at least 8 characters.");

  const recoveryPhrase = await generateRecoveryPhrase();
  const passSalt = crypto.getRandomValues(new Uint8Array(16));
  const recoverySalt = crypto.getRandomValues(new Uint8Array(16));
  const dekBytes = crypto.getRandomValues(new Uint8Array(32));
  const dek = await importDek(dekBytes);

  const passKek = await deriveKek(passphrase, passSalt);
  const recKek = await deriveKek(normalizePhrase(recoveryPhrase), recoverySalt);
  const passWrap = await wrapDek(passKek, dekBytes);
  const recWrap = await wrapDek(recKek, dekBytes);

  await seal(dek, CHECK);

  openDek = dek;
  return {
    recoveryPhrase,
    vault: {
      version: 2,
      passSalt: encode(passSalt),
      recoverySalt: encode(recoverySalt),
      dekCipherPass: passWrap.cipher,
      dekIvPass: passWrap.iv,
      dekCipherRec: recWrap.cipher,
      dekIvRec: recWrap.iv,
      entries: [],
    },
  };
}

export async function unlockVault(vault: OtpVault, passphrase: string): Promise<void> {
  if (vault.version === 1) {
    await unlockV1(vault, passphrase);
    return;
  }
  const kek = await deriveKek(passphrase, decode(vault.passSalt));
  try {
    openDek = await unwrapDek(kek, vault.dekCipherPass, vault.dekIvPass);
  } catch {
    openDek = null;
    throw new Error("That passphrase does not open these codes.");
  }
}

export async function unlockVaultWithRecovery(vault: OtpVault, recoveryPhrase: string): Promise<void> {
  if (vault.version !== 2) {
    throw new Error("This vault has no recovery key yet. Unlock with the passphrase and add one.");
  }
  const kek = await deriveKek(normalizePhrase(recoveryPhrase), decode(vault.recoverySalt));
  try {
    openDek = await unwrapDek(kek, vault.dekCipherRec, vault.dekIvRec);
  } catch {
    openDek = null;
    throw new Error("That recovery phrase does not open these codes.");
  }
}

async function unlockV1(vault: OtpVaultV1, passphrase: string): Promise<void> {
  const key = await deriveKek(passphrase, decode(vault.salt));
  try {
    const text = await openSeal(key, vault.check, vault.checkIv);
    if (text !== CHECK) throw new Error("closed");
  } catch {
    openDek = null;
    throw new Error("That passphrase does not open these codes.");
  }
  openDek = key;
}

export function needsRecoveryMigration(vault: OtpVault | null): boolean {
  return !!vault && vault.version === 1 && openDek !== null;
}

export async function migrateVaultToV2(
  vault: OtpVaultV1,
  passphrase: string,
): Promise<CreateVaultResult & { entries: OtpEntry[] }> {
  if (!openDek) throw new Error("Unlock the vault first.");
  if (passphrase.trim().length < 8) throw new Error("Use at least 8 characters.");

  const plainSecrets: { entry: OtpEntry; secret: string }[] = [];
  for (const entry of vault.entries) {
    plainSecrets.push({ entry, secret: await openSeal(openDek, entry.cipher, entry.iv) });
  }

  const created = await createVault(passphrase);
  const nextEntries: OtpEntry[] = [];
  for (const row of plainSecrets) {
    const sealed = await seal(openDek!, row.secret);
    nextEntries.push({
      ...row.entry,
      cipher: sealed.cipher,
      iv: sealed.iv,
    });
  }
  return {
    ...created,
    vault: { ...created.vault, entries: nextEntries },
    entries: nextEntries,
  };
}

export async function changeVaultPassphrase(
  vault: OtpVaultV2,
  oldPassphrase: string,
  newPassphrase: string,
): Promise<OtpVaultV2> {
  if (!openDek) throw new Error("Unlock the vault first.");
  if (newPassphrase.trim().length < 8) throw new Error("Use at least 8 characters.");

  const oldKek = await deriveKek(oldPassphrase, decode(vault.passSalt));
  try {
    await unwrapDek(oldKek, vault.dekCipherPass, vault.dekIvPass);
  } catch {
    throw new Error("The current passphrase is wrong.");
  }

  const dekBytes = await exportDek(openDek);
  const passSalt = crypto.getRandomValues(new Uint8Array(16));
  const passKek = await deriveKek(newPassphrase, passSalt);
  const passWrap = await wrapDek(passKek, dekBytes);

  return {
    ...vault,
    passSalt: encode(passSalt),
    dekCipherPass: passWrap.cipher,
    dekIvPass: passWrap.iv,
  };
}

export function readCodeBackup(text: string): OtpVault {
  const parsed = JSON.parse(text) as { camosCodes?: unknown; vault?: OtpVault };
  const vault = parsed.camosCodes === 1 ? parsed.vault : null;
  if (!vault || !Array.isArray(vault.entries)) {
    throw new Error("That is not a CamOS code backup.");
  }
  if (vault.version === 2) {
    if (
      typeof vault.passSalt !== "string" ||
      typeof vault.recoverySalt !== "string" ||
      typeof vault.dekCipherPass !== "string"
    ) {
      throw new Error("That is not a CamOS code backup.");
    }
    return vault;
  }
  if (vault.version === 1 && typeof vault.salt === "string" && typeof vault.check === "string") {
    return vault;
  }
  throw new Error("That is not a CamOS code backup.");
}

export function writeCodeBackup(vault: OtpVault): string {
  return JSON.stringify({ camosCodes: 1, vault }, null, 2);
}
