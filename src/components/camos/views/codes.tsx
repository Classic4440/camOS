import { useEffect, useState, type FormEvent } from "react";
import { createVault, lockVault, openSeal, readCodeBackup, seal, unlockVault, vaultKey, writeCodeBackup } from "@/lib/camos/otp-vault";
import { groupCode, parseOtp, secondsLeft, totp } from "@/lib/camos/otp";
import { useDesk } from "@/lib/camos/store";
import type { OtpEntry } from "@/lib/camos/types";
import { Button, Field, Input, Page, PageHead } from "@/components/camos/ui";

type OpenRow = { id: string; issuer: string; account: string; secret: string };

export function CodesView() {
  const vault = useDesk((state) => state.otpVault);
  const setOtpVault = useDesk((state) => state.setOtpVault);
  const addOtpEntry = useDesk((state) => state.addOtpEntry);
  const removeOtpEntry = useDesk((state) => state.removeOtpEntry);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [passphrase, setPassphrase] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<OpenRow[]>([]);
  const [codes, setCodes] = useState<Record<string, string>>({});
  const [left, setLeft] = useState(30);
  const [issuer, setIssuer] = useState("");
  const [account, setAccount] = useState("");
  const [secret, setSecret] = useState("");
  const [removing, setRemoving] = useState<string | null>(null);
  const [replaceBackup, setReplaceBackup] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let stop = false;
    const paint = () => {
      setLeft(secondsLeft());
      void Promise.all(rows.map(async (row) => [row.id, await totp(row.secret)] as const)).then((pairs) => {
        if (stop) return;
        setCodes(Object.fromEntries(pairs));
      });
    };
    paint();
    const timer = window.setInterval(paint, 1000);
    return () => {
      stop = true;
      window.clearInterval(timer);
    };
  }, [open, rows]);

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!vault) {
        if (passphrase !== again) throw new Error("The two passphrases do not match.");
        setOtpVault(await createVault(passphrase));
        setRows([]);
      } else {
        await unlockVault(vault, passphrase);
        const key = vaultKey();
        if (!key) throw new Error("The vault did not open.");
        const next: OpenRow[] = [];
        for (const entry of vault.entries) {
          next.push({
            id: entry.id,
            issuer: entry.issuer,
            account: entry.account,
            secret: await openSeal(key, entry.cipher, entry.iv),
          });
        }
        setRows(next);
      }
      setPassphrase("");
      setAgain("");
      setOpen(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The vault did not open.");
    } finally {
      setBusy(false);
    }
  }

  function lock() {
    lockVault();
    setRows([]);
    setCodes({});
    setOpen(false);
    setSecret("");
  }

  async function add(event: FormEvent) {
    event.preventDefault();
    const key = vaultKey();
    if (!key) return;
    setError("");
    try {
      const parsed = parseOtp(secret);
      const nextIssuer = (issuer || parsed.issuer).trim();
      const nextAccount = (account || parsed.account).trim();
      if (!parsed.secret) throw new Error("Paste the secret or the otpauth link.");
      await totp(parsed.secret);
      const sealed = await seal(key, parsed.secret);
      const entry: OtpEntry = {
        id: crypto.randomUUID(),
        issuer: nextIssuer || "Account",
        account: nextAccount,
        cipher: sealed.cipher,
        iv: sealed.iv,
        created: new Date().toISOString(),
      };
      addOtpEntry(entry);
      setRows((current) => [{ id: entry.id, issuer: entry.issuer, account: entry.account, secret: parsed.secret }, ...current]);
      setIssuer("");
      setAccount("");
      setSecret("");
      flashMsg("Code added. Only the ciphertext is saved.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "That secret could not be added.");
    }
  }

  function download() {
    if (!vault) return;
    const blob = new Blob([writeCodeBackup(vault)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "camos-codes.vault.json";
    link.click();
    URL.revokeObjectURL(link.href);
    flashMsg("Encrypted backup downloaded. It is useless without the passphrase.");
  }

  return (
    <Page width="read">
      <PageHead
        kicker="Office · Authenticator"
        title="Codes stay here."
        lede="Time-based codes for the accounts you already have. The passphrase is not stored. Supabase and the desk file receive ciphertext only."
      />
      {!open ? (
        <form className="space-y-4 border-t border-line pt-4" onSubmit={(event) => void unlock(event)}>
          <p className="text-sm text-muted">
            {vault
              ? "Open the vault with the passphrase you chose. Refreshing the page locks it again."
              : "Choose a passphrase before the first code is added. It is separate from the CamOS sign-in, and there is no recovery if it is forgotten."}
          </p>
          <Field label="Vault passphrase">
            <Input
              type="password"
              autoComplete={vault ? "current-password" : "new-password"}
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              required
            />
          </Field>
          {vault ? null : (
            <Field label="Repeat the passphrase">
              <Input type="password" autoComplete="new-password" value={again} onChange={(event) => setAgain(event.target.value)} required />
            </Field>
          )}
          {error ? <p className="text-sm text-rust">{error}</p> : null}
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? "Opening…" : vault ? "Open" : "Create the vault"}
          </Button>
          {vault ? (
            <Field label="Restore an encrypted backup" hint="This replaces the codes on this desk. The backup’s passphrase is the one that will open them.">
              <Input
                type="file"
                accept="application/json,.json"
                aria-label="Restore an encrypted code backup"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (!file) return;
                  const reader = new FileReader();
                  reader.onload = () => setReplaceBackup(typeof reader.result === "string" ? reader.result : null);
                  reader.readAsText(file);
                }}
              />
            </Field>
          ) : null}
          {replaceBackup ? (
            <div className="flex flex-wrap gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  try {
                    setOtpVault(readCodeBackup(replaceBackup));
                    lock();
                    setReplaceBackup(null);
                    flashMsg("Encrypted backup restored. Open it with that vault’s passphrase.");
                  } catch (caught) {
                    setError(caught instanceof Error ? caught.message : "That backup could not be read.");
                  }
                }}
              >
                Replace the vault
              </Button>
              <Button variant="ghost" onClick={() => setReplaceBackup(null)}>
                Cancel
              </Button>
            </div>
          ) : null}
        </form>
      ) : (
        <div className="border-t border-line pt-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">{rows.length === 1 ? "1 account" : `${rows.length} accounts`} · {left}s</p>
            <div className="flex flex-wrap gap-2">
              <Button variant="ghost" onClick={download}>
                Download encrypted backup
              </Button>
              <Button variant="ghost" onClick={lock}>
                Lock
              </Button>
            </div>
          </div>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {rows.map((row) => (
              <li key={row.id} className="flex items-center gap-3 py-3">
                <button
                  type="button"
                  className="min-w-0 flex-1 text-left"
                  onClick={() => {
                    const code = codes[row.id];
                    if (!code) return;
                    void navigator.clipboard.writeText(code);
                    flashMsg("Code copied.");
                  }}
                >
                  <span className="block text-sm font-semibold">{row.issuer}</span>
                  <span className="block truncate text-sm text-muted">{row.account || "No account name"}</span>
                  <span className="mt-1 block font-display text-3xl tabular-nums tracking-wide">{codes[row.id] ? groupCode(codes[row.id]) : "······"}</span>
                </button>
                {removing === row.id ? (
                  <Button
                    variant="danger"
                    onClick={() => {
                      removeOtpEntry(row.id);
                      setRows((current) => current.filter((item) => item.id !== row.id));
                      setRemoving(null);
                    }}
                  >
                    Remove
                  </Button>
                ) : (
                  <Button variant="ghost" onClick={() => setRemoving(row.id)}>
                    Remove
                  </Button>
                )}
              </li>
            ))}
          </ul>
          {rows.length === 0 ? <p className="mt-4 text-sm text-muted">No codes yet. Add one from the secret or the otpauth link the site shows.</p> : null}
          <form className="mt-6 space-y-4" onSubmit={(event) => void add(event)}>
            <h2 className="font-display text-2xl">Add a code</h2>
            <Field label="Service">
              <Input value={issuer} onChange={(event) => setIssuer(event.target.value)} placeholder="GitHub" />
            </Field>
            <Field label="Account">
              <Input value={account} onChange={(event) => setAccount(event.target.value)} placeholder="you@example.com" autoComplete="off" />
            </Field>
            <Field label="Secret or otpauth link">
              <Input type="password" value={secret} onChange={(event) => setSecret(event.target.value)} autoComplete="off" required />
            </Field>
            {error ? <p className="text-sm text-rust">{error}</p> : null}
            <Button type="submit" variant="primary">
              Add
            </Button>
          </form>
        </div>
      )}
    </Page>
  );
}
