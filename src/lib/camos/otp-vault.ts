import type { OtpVault } from "./types";

const CHECK = "camos-otp-ok";
const ITERATIONS = 120_000;

let openKey: CryptoKey | null = null;

export function vaultKey(): CryptoKey | null {
  return openKey;
}

export function lockVault(): void {
  openKey = null;
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

async function derive(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const material = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: raw(salt), iterations: ITERATIONS, hash: "SHA-256" },
    material,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
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

export async function createVault(passphrase: string): Promise<OtpVault> {
  if (passphrase.trim().length < 8) throw new Error("Use at least 8 characters.");
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await derive(passphrase, salt);
  const check = await seal(key, CHECK);
  openKey = key;
  return { version: 1, salt: encode(salt), check: check.cipher, checkIv: check.iv, entries: [] };
}

export async function unlockVault(vault: OtpVault, passphrase: string): Promise<void> {
  const key = await derive(passphrase, decode(vault.salt));
  try {
    const text = await openSeal(key, vault.check, vault.checkIv);
    if (text !== CHECK) throw new Error("closed");
  } catch {
    openKey = null;
    throw new Error("That passphrase does not open these codes.");
  }
  openKey = key;
}

export function readCodeBackup(text: string): OtpVault {
  const parsed = JSON.parse(text) as { camosCodes?: unknown; vault?: OtpVault };
  const vault = parsed.camosCodes === 1 ? parsed.vault : null;
  if (!vault || vault.version !== 1 || typeof vault.salt !== "string" || typeof vault.check !== "string" || !Array.isArray(vault.entries)) {
    throw new Error("That is not a CamOS code backup.");
  }
  return vault;
}

export function writeCodeBackup(vault: OtpVault): string {
  return JSON.stringify({ camosCodes: 1, vault }, null, 2);
}
