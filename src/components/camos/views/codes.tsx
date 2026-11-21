import { useEffect, useState, type FormEvent } from "react";
import {
  changeVaultPassphrase,
  createVault,
  lockVault,
  migrateVaultToV2,
  needsRecoveryMigration,
  openSeal,
  readCodeBackup,
  seal,
  unlockVault,
  unlockVaultWithRecovery,
  vaultKey,
  writeCodeBackup,
} from "@/lib/camos/otp-vault";
import { groupCode, parseOtp, secondsLeft, totp } from "@/lib/camos/otp";
import { useDesk } from "@/lib/camos/store";
import type { OtpEntry, OtpVaultV1, OtpVaultV2 } from "@/lib/camos/types";
import { Button, Field, Input, Page, PageHead, Textarea } from "@/components/camos/ui";

type OpenRow = { id: string; issuer: string; account: string; secret: string };

export function CodesView() {
  const vault = useDesk((state) => state.otpVault);
  const setOtpVault = useDesk((state) => state.setOtpVault);
  const addOtpEntry = useDesk((state) => state.addOtpEntry);
  const removeOtpEntry = useDesk((state) => state.removeOtpEntry);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [passphrase, setPassphrase] = useState("");
  const [again, setAgain] = useState("");
  const [recoveryInput, setRecoveryInput] = useState("");
  const [useRecovery, setUseRecovery] = useState(false);
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
  const [newRecoveryPhrase, setNewRecoveryPhrase] = useState<string | null>(null);
  const [migrationNeeded, setMigrationNeeded] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newPassAgain, setNewPassAgain] = useState("");

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

  async function loadRows(entries: OtpEntry[]) {
    const key = vaultKey();
    if (!key) throw new Error("The vault did not open.");
    const next: OpenRow[] = [];
    for (const entry of entries) {
      next.push({
        id: entry.id,
        issuer: entry.issuer,
        account: entry.account,
        secret: await openSeal(key, entry.cipher, entry.iv),
      });
    }
    setRows(next);
  }

  async function unlock(event: FormEvent) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (!vault) {
        if (passphrase !== again) throw new Error("The two passphrases do not match.");
        const created = await createVault(passphrase);
        setOtpVault(created.vault);
        setNewRecoveryPhrase(created.recoveryPhrase);
        setRows([]);
      } else if (useRecovery) {
        await unlockVaultWithRecovery(vault, recoveryInput);
        await loadRows(vault.entries);
        setMigrationNeeded(false);
      } else {
        await unlockVault(vault, passphrase);
        await loadRows(vault.entries);
        setMigrationNeeded(needsRecoveryMigration(vault));
      }
      setPassphrase("");
      setAgain("");
      setRecoveryInput("");
      setOpen(true);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "The vault did not open.");
    } finally {
      setBusy(false);
    }
  }

  async function runMigration() {
    if (!vault || vault.version !== 1) return;
    setBusy(true);
    setError("");
    try {
      // Re-prompt passphrase is already known from unlock; user must re-enter for safety.
      if (!passphrase && !oldPass) {
        setError("Enter your current passphrase to add a recovery key.");
        setBusy(false);
        return;
      }
      const pass = passphrase || oldPass;
      const result = await migrateVaultToV2(vault as OtpVaultV1, pass);
      setOtpVault(result.vault);
      setNewRecoveryPhrase(result.recoveryPhrase);
      setMigrationNeeded(false);
      setOldPass("");
      flashMsg("Recovery key added. Write it down offline.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Migration failed.");
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
    setMigrationNeeded(false);
    setChangingPass(false);
    setNewRecoveryPhrase(null);
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

  async function submitChangePass(event: FormEvent) {
    event.preventDefault();
    if (!vault || vault.version !== 2) {
      setError("Unlock a recovery-enabled vault first.");
      return;
    }
    if (newPass !== newPassAgain) {
      setError("The two new passphrases do not match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const next = await changeVaultPassphrase(vault as OtpVaultV2, oldPass, newPass);
      setOtpVault(next);
      setChangingPass(false);
      setOldPass("");
      setNewPass("");
      setNewPassAgain("");
      flashMsg("Passphrase changed. Recovery phrase is unchanged.");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Could not change the passphrase.");
    } finally {
      setBusy(false);
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
    flashMsg("Encrypted backup downloaded. Useless without passphrase or recovery phrase.");
  }

  return (
    <Page width="read">
      <PageHead
        kicker="Office · Authenticator"
        title="Codes stay here."
        lede="Time-based codes for the accounts you already have. Passphrase and recovery phrase never leave this device. Supabase only receives ciphertext."
      />

      {newRecoveryPhrase ? (
        <div className="mb-6 border border-brass bg-surface p-4">
          <p className="text-sm font-semibold">Write this recovery phrase down offline.</p>
          <p className="mt-2 text-sm text-muted">
            24 words. It is the only way to open the vault if you forget the passphrase. It is never stored in CamOS or Supabase. You will not see it again.
          </p>
          <p className="mt-3 break-words font-mono text-sm leading-relaxed">{newRecoveryPhrase}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                void navigator.clipboard.writeText(newRecoveryPhrase);
                flashMsg("Recovery phrase copied. Store it offline, then clear the clipboard.");
              }}
            >
              Copy phrase
            </Button>
            <Button variant="primary" onClick={() => setNewRecoveryPhrase(null)}>
              I saved it offline
            </Button>
          </div>
        </div>
      ) : null}

      {!open ? (
        <form className="space-y-4 border-t border-line pt-4" onSubmit={(event) => void unlock(event)}>
          <p className="text-sm text-muted">
            {vault
              ? "Open the vault with your passphrase or recovery phrase. Refreshing the page locks it again."
              : "Choose a passphrase before the first code is added. You will also receive a 24-word recovery phrase to save offline."}
          </p>
          {vault && useRecovery ? (
            <Field label="Recovery phrase" hint="24 words, separated by spaces.">
              <Textarea value={recoveryInput} onChange={(event) => setRecoveryInput(event.target.value)} required rows={3} />
            </Field>
          ) : (
            <>
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
            </>
          )}
          {error ? <p className="text-sm text-rust">{error}</p> : null}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" variant="primary" disabled={busy}>
              {busy ? "Opening…" : vault ? "Open" : "Create the vault"}
            </Button>
            {vault ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setUseRecovery((v) => !v);
                  setError("");
                }}
              >
                {useRecovery ? "Use passphrase" : "Forgot passphrase? Use recovery key"}
              </Button>
            ) : null}
          </div>
          {vault ? (
            <Field label="Restore an encrypted backup" hint="Replaces the codes on this desk.">
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
                    flashMsg("Encrypted backup restored.");
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
          {migrationNeeded ? (
            <div className="mb-6 border border-brass bg-surface p-4">
              <p className="text-sm font-semibold">Add a recovery key</p>
              <p className="mt-2 text-sm text-muted">
                This vault was created before recovery keys. Enter your current passphrase once to upgrade. Existing codes are kept.
              </p>
              <Field label="Current passphrase">
                <Input type="password" value={oldPass} onChange={(event) => setOldPass(event.target.value)} />
              </Field>
              {error ? <p className="mt-2 text-sm text-rust">{error}</p> : null}
              <Button className="mt-3" variant="primary" disabled={busy} onClick={() => void runMigration()}>
                {busy ? "Upgrading…" : "Generate recovery key"}
              </Button>
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-muted">
              {rows.length === 1 ? "1 account" : `${rows.length} accounts`} · {left}s
            </p>
            <div className="flex flex-wrap gap-2">
              {vault?.version === 2 ? (
                <Button variant="ghost" onClick={() => setChangingPass((v) => !v)}>
                  Change passphrase
                </Button>
              ) : null}
              <Button variant="ghost" onClick={download}>
                Download encrypted backup
              </Button>
              <Button variant="ghost" onClick={lock}>
                Lock
              </Button>
            </div>
          </div>

          {changingPass && vault?.version === 2 ? (
            <form className="mt-4 space-y-3 border border-line p-4" onSubmit={(event) => void submitChangePass(event)}>
              <h2 className="font-display text-xl">Change passphrase</h2>
              <p className="text-sm text-muted">Recovery phrase stays the same. Only the passphrase wrapper is updated.</p>
              <Field label="Current passphrase">
                <Input type="password" value={oldPass} onChange={(event) => setOldPass(event.target.value)} required />
              </Field>
              <Field label="New passphrase">
                <Input type="password" value={newPass} onChange={(event) => setNewPass(event.target.value)} required minLength={8} />
              </Field>
              <Field label="Repeat new passphrase">
                <Input type="password" value={newPassAgain} onChange={(event) => setNewPassAgain(event.target.value)} required minLength={8} />
              </Field>
              {error ? <p className="text-sm text-rust">{error}</p> : null}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="primary" disabled={busy}>
                  {busy ? "Saving…" : "Save new passphrase"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setChangingPass(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          ) : null}

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
                  <span className="mt-1 block font-display text-3xl tabular-nums tracking-wide">
                    {codes[row.id] ? groupCode(codes[row.id]) : "······"}
                  </span>
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
            {error && !changingPass && !migrationNeeded ? <p className="text-sm text-rust">{error}</p> : null}
            <Button type="submit" variant="primary">
              Add
            </Button>
          </form>
        </div>
      )}
    </Page>
  );
}
