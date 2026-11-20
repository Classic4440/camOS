const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

export function decodeBase32(input: string): Uint8Array {
  const clean = input.toUpperCase().replace(/=+$/g, "").replace(/\s+/g, "");
  if (!clean || /[^A-Z2-7]/.test(clean)) throw new Error("That secret is not base32.");
  let bits = 0;
  let value = 0;
  const out: number[] = [];
  for (const char of clean) {
    value = (value << 5) | ALPHABET.indexOf(char);
    bits += 5;
    if (bits >= 8) {
      bits -= 8;
      out.push((value >>> bits) & 255);
    }
  }
  if (!out.length) throw new Error("That secret is not base32.");
  return Uint8Array.from(out);
}

export function parseOtp(input: string): { issuer: string; account: string; secret: string } {
  const trimmed = input.trim();
  if (!trimmed.toLowerCase().startsWith("otpauth://")) {
    return { issuer: "", account: "", secret: trimmed.replace(/\s+/g, "") };
  }
  const url = new URL(trimmed);
  if (url.hostname !== "totp") throw new Error("Only time-based codes are accepted.");
  const secret = url.searchParams.get("secret") ?? "";
  const label = decodeURIComponent(url.pathname.replace(/^\//, ""));
  const [left, right] = label.split(":");
  const issuer = url.searchParams.get("issuer") || (right ? left : "");
  const account = (right ?? left).trim();
  return { issuer: issuer.trim(), account, secret: secret.replace(/\s+/g, "") };
}

function raw(bytes: Uint8Array): ArrayBuffer {
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) as ArrayBuffer;
}

/** RFC 6238, HMAC-SHA1, 30-second step, 6 digits. */
export async function totp(secret: string, at = Date.now(), step = 30, digits = 6): Promise<string> {
  const key = await crypto.subtle.importKey("raw", raw(decodeBase32(secret)), { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
  const counter = Math.floor(at / 1000 / step);
  const buf = new ArrayBuffer(8);
  new DataView(buf).setUint32(4, counter);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, buf));
  const offset = sig[sig.length - 1]! & 15;
  const bin =
    ((sig[offset]! & 127) << 24) | ((sig[offset + 1]! & 255) << 16) | ((sig[offset + 2]! & 255) << 8) | (sig[offset + 3]! & 255);
  return String(bin % 10 ** digits).padStart(digits, "0");
}

export function secondsLeft(at = Date.now(), step = 30): number {
  return step - (Math.floor(at / 1000) % step);
}

export function groupCode(code: string): string {
  return code.length === 6 ? `${code.slice(0, 3)} ${code.slice(3)}` : code;
}
