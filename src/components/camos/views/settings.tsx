import { useEffect, useState } from "react";
import { HOME_LABEL, type HomeBlock } from "@/lib/camos/types";
import { useDesk } from "@/lib/camos/store";
import { parseDeskFile, serializeDesk } from "@/lib/camos/backup";
import ownerSql from "../../../../supabase/migrations/0002_owner_lock.sql?raw";
import { downloadCloud, uploadThisBrowser, useDeskSync, type SyncState } from "@/lib/camos/sync";
import {
  changeOwnerPassword,
  deviceLabel,
  enrollFactor,
  listFactors,
  signOutOwner,
  useOwnerSession,
  verifyFactor,
} from "@/lib/camos/owner-session";
import { fetchIsAdmin, inviteUser } from "@/lib/camos/invite";
import { kampalaToday } from "@/lib/camos/format";
import { Button, Field, Input, Page, PageHead, Textarea } from "@/components/camos/ui";
import { cn } from "@/lib/utils";

export function SettingsView() {
  const settings = useDesk((state) => state.settings);
  const patchSettings = useDesk((state) => state.patchSettings);
  const setTheme = useDesk((state) => state.setTheme);
  const setDensity = useDesk((state) => state.setDensity);
  const toggleHomeBlock = useDesk((state) => state.toggleHomeBlock);
  const clearSamples = useDesk((state) => state.clearSamples);
  const resetDesk = useDesk((state) => state.resetDesk);
  const replaceDesk = useDesk((state) => state.replaceDesk);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [phrase, setPhrase] = useState("");
  const [confirmSamples, setConfirmSamples] = useState(false);
  const [fileError, setFileError] = useState("");
  const [pendingFile, setPendingFile] = useState<string | null>(null);
  const sync = useDeskSync();
  const used = settings.aiDay === kampalaToday() ? settings.aiUsed : 0;

  return (
    <Page width="read">
      <PageHead
        kicker="Office · Settings"
        title="The desk, named properly."
        lede="CamOS is the operating desk. DanielMac is the professional name. Cam Leinad is the artist. Records stay in this browser and are copied to Supabase."
      />
      <section className="mb-10 border-t border-line pt-4">
        <h2 className="font-display text-2xl">Supabase</h2>
        <p className="mt-2 text-sm text-muted">Project qeebfpsqdwrjsgoclock. {syncLine(sync)}</p>
        {sync.state === "needs-setup" ? (
          <>
            <p className="mt-3 text-sm">
              The owner migration has not been applied. Until it is, a signed-out client can still read and change the desk. Run the migration in the Supabase SQL editor. It backs up the current rows and removes anonymous access.
            </p>
            <pre className="mt-3 max-h-64 overflow-auto border border-line bg-surface p-3 text-xs leading-relaxed">{ownerSql}</pre>
            <Button
              className="mt-3"
              onClick={() => {
                void navigator.clipboard.writeText(ownerSql);
                flashMsg("Migration copied.");
              }}
            >
              Copy migration
            </Button>
          </>
        ) : null}
        {sync.state === "choose" ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button onClick={() => void uploadThisBrowser()}>Upload this browser</Button>
            <Button variant="ghost" onClick={() => void downloadCloud()}>
              Download the cloud desk
            </Button>
          </div>
        ) : null}
        {sync.state === "offline" ? <p className="mt-3 text-sm text-rust">{sync.error} This browser still has the records.</p> : null}
      </section>
      <InvitePanel />
      <section className="space-y-4 border-t border-line pt-4">
        <Field label="What the desk calls you">
          <Input value={settings.called} onChange={(event) => patchSettings({ called: event.target.value })} />
        </Field>
        <Field label="Legal name">
          <Input value={settings.legalName} onChange={(event) => patchSettings({ legalName: event.target.value })} />
        </Field>
        <Field label="Professional name">
          <Input value={settings.professional} onChange={(event) => patchSettings({ professional: event.target.value })} />
        </Field>
        <Field label="Artist name">
          <Input value={settings.artist} onChange={(event) => patchSettings({ artist: event.target.value })} />
        </Field>
        <Field label="Label">
          <Input value={settings.label} onChange={(event) => patchSettings({ label: event.target.value })} />
        </Field>
        <Field label="Focus line">
          <Textarea value={settings.focus} onChange={(event) => patchSettings({ focus: event.target.value })} />
        </Field>
        <p className="text-sm text-muted">Changes save as you type, on this device.</p>
      </section>
      <SecurityCenter />
      <section className="mt-10">
        <h2 className="font-display text-2xl">Theme</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button type="button" onClick={() => setTheme("light")} className={cn("border px-4 py-4 text-left", settings.theme === "light" ? "border-ink" : "border-line")}>
            <span className="block font-semibold">Paper</span>
            <span className="text-sm text-muted">Warm daylight. Ink text, brass marks.</span>
          </button>
          <button type="button" onClick={() => setTheme("dark")} className={cn("border px-4 py-4 text-left", settings.theme === "dark" ? "border-ink" : "border-line")}>
            <span className="block font-semibold">Ink</span>
            <span className="text-sm text-muted">Charcoal ground, not pure black. Its own contrast.</span>
          </button>
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant={settings.density === "regular" ? "primary" : "line"} onClick={() => setDensity("regular")}>
            Regular density
          </Button>
          <Button variant={settings.density === "compact" ? "primary" : "line"} onClick={() => setDensity("compact")}>
            Compact
          </Button>
        </div>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-2xl">Home blocks</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {settings.homeOrder.map((id) => {
            const hidden = settings.hiddenHome.includes(id);
            return (
              <li key={id} className="flex min-h-12 items-center justify-between">
                <span>{HOME_LABEL[id as HomeBlock]}</span>
                <Button variant="ghost" onClick={() => toggleHomeBlock(id as HomeBlock)}>
                  {hidden ? "Show" : "Hide"}
                </Button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-2xl">Analyst</h2>
        <p className="mt-2 text-sm text-muted">
          {used} of {settings.aiLimit} briefs used today. The cap is there so a stuck button cannot spend the account.
        </p>
      </section>
      <section className="mt-10 border-t border-line pt-4">
        <h2 className="font-display text-2xl">Desk file</h2>
        <p className="mt-2 text-sm text-muted">
          The records live in this browser. Download a file before you clear the device. Importing replaces what is here.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button
            onClick={() => {
              const file = serializeDesk(useDesk.getState());
              const url = URL.createObjectURL(new Blob([file], { type: "application/json" }));
              const link = document.createElement("a");
              link.href = url;
              link.download = `camos-desk-${kampalaToday()}.json`;
              link.click();
              URL.revokeObjectURL(url);
              flashMsg("Desk file downloaded.");
            }}
          >
            Download desk
          </Button>
        </div>
        <Field label="Import a desk file" error={fileError} hint="Choose the file, then confirm. This replaces the current records.">
          <Input
            className="mt-1"
            type="file"
            accept="application/json,.json"
            aria-label="Import a desk file"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) return;
              const reader = new FileReader();
              reader.onload = () => {
                const text = typeof reader.result === "string" ? reader.result : "";
                const parsed = parseDeskFile(text);
                if (!parsed.ok) {
                  setPendingFile(null);
                  setFileError(parsed.error);
                  return;
                }
                setFileError("");
                setPendingFile(text);
              };
              reader.readAsText(file);
            }}
          />
        </Field>
        {pendingFile ? (
          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              variant="danger"
              onClick={() => {
                const parsed = parseDeskFile(pendingFile);
                if (!parsed.ok) {
                  setFileError(parsed.error);
                  return;
                }
                replaceDesk(parsed.desk);
                setPendingFile(null);
                flashMsg("Desk file loaded.");
              }}
            >
              Replace this desk
            </Button>
            <Button variant="ghost" onClick={() => setPendingFile(null)}>
              Cancel
            </Button>
          </div>
        ) : null}
      </section>
      <section className="mt-10 border-t border-line pt-4">
        <h2 className="font-display text-2xl">Sample records</h2>
        <p className="mt-2 text-sm text-muted">Sample jobs, the sample customer, and the sample quote are illustrations. Confirmed machines, the album, and the projects stay.</p>
        {confirmSamples ? (
          <div className="mt-3 flex gap-2">
            <Button
              variant="danger"
              onClick={() => {
                clearSamples();
                setConfirmSamples(false);
              }}
            >
              Remove samples
            </Button>
            <Button variant="ghost" onClick={() => setConfirmSamples(false)}>
              Cancel
            </Button>
          </div>
        ) : (
          <Button className="mt-3" onClick={() => setConfirmSamples(true)}>
            Clear sample shop records
          </Button>
        )}
      </section>
      <section className="mt-10 border border-rust p-4">
        <h2 className="font-display text-2xl text-rust">Restore the opening desk</h2>
        <p className="mt-2 text-sm">This deletes everything you have added on this device and reloads the opening records. Type RESET to enable it.</p>
        <Input className="mt-3 max-w-xs" value={phrase} onChange={(event) => setPhrase(event.target.value)} aria-label="Type RESET to confirm" />
        <Button
          className="mt-3"
          variant="danger"
          disabled={phrase !== "RESET"}
          onClick={() => {
            resetDesk();
            setPhrase("");
            flashMsg("Opening records restored.");
          }}
        >
          Restore
        </Button>
      </section>
    </Page>
  );
}

function syncLine(sync: SyncState): string {
  switch (sync.state) {
    case "checking":
      return "Checking the project.";
    case "saving":
      return "Saving.";
    case "saved":
      return `Last copy ${sync.at.slice(0, 16).replace("T", " ")} UTC.`;
    case "needs-setup":
      return "Waiting for the table.";
    case "choose":
      return "A desk is already stored. Choose which copy to keep.";
    case "locked":
      return "Sign in before the cloud copy will move.";
    case "offline":
      return "Not saved just now.";
  }
}

function InvitePanel() {
  const [admin, setAdmin] = useState<boolean | null>(null);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const flashMsg = useDesk((state) => state.flashMsg);

  useEffect(() => {
    void fetchIsAdmin().then(setAdmin);
  }, []);

  if (admin === null) {
    return (
      <section className="mb-10 border-t border-line pt-4">
        <h2 className="font-display text-2xl">Invite users</h2>
        <p className="mt-2 text-sm text-muted">Checking admin access…</p>
      </section>
    );
  }

  if (!admin) return null;

  async function run(mode: "email" | "link") {
    setBusy(true);
    setError("");
    setNotice("");
    setLink(null);
    const result = await inviteUser(email, mode);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    if (result.mode === "link") {
      setLink(result.link);
      setNotice(`Invite link ready for ${result.email}.`);
      flashMsg("Invite link ready.");
      return;
    }
    setNotice(`Invite email sent to ${result.email}. They get their own isolated desk.`);
    flashMsg("Invite email sent.");
    setEmail("");
  }

  return (
    <section className="mb-10 border-t border-line pt-4">
      <h2 className="font-display text-2xl">Invite users</h2>
      <p className="mt-2 text-sm text-muted">
        Only you (admin) can invite. Invited people get their own private desk — they never see yours. Public sign-up stays closed.
      </p>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          void run("email");
        }}
      >
        <Field label="Email to invite">
          <Input
            type="email"
            autoComplete="off"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="collaborator@example.com"
            required
          />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary" disabled={busy || !email.trim()}>
            {busy ? "Working…" : "Email invite"}
          </Button>
          <Button
            type="button"
            variant="line"
            disabled={busy || !email.trim()}
            onClick={() => void run("link")}
          >
            Copy link
          </Button>
        </div>
      </form>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
      {notice ? <p className="mt-3 text-sm">{notice}</p> : null}
      {link ? (
        <div className="mt-3 space-y-2">
          <p className="break-all rounded border border-line bg-surface p-3 font-mono text-xs leading-relaxed">{link}</p>
          <Button
            onClick={() => {
              void navigator.clipboard.writeText(link);
              flashMsg("Invite link copied.");
            }}
          >
            Copy to clipboard
          </Button>
        </div>
      ) : null}
    </section>
  );
}

function SecurityCenter() {
  const owner = useOwnerSession();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [secret, setSecret] = useState("");
  const [factorId, setFactorId] = useState("");
  const [code, setCode] = useState("");
  const email = owner.status === "in" ? owner.user.email : "";

  return (
    <section className="mt-10 border-t border-line pt-4">
      <h2 className="font-display text-2xl">Security</h2>
      <p className="mt-2 text-sm text-muted">
        {email ? `Signed in as ${email}.` : "Not signed in."} This device is {deviceLabel()}.
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={() => {
            void signOutOwner(false);
          }}
        >
          Sign out
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            void signOutOwner(true);
          }}
        >
          Sign out everywhere
        </Button>
      </div>
      <form
        className="mt-4 space-y-3"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          setMessage("");
          if (password.length < 8) {
            setError("Use at least 8 characters.");
            return;
          }
          void changeOwnerPassword(password).then((result) => {
            if (!result.ok) setError(result.error);
            else {
              setPassword("");
              setMessage("Password changed.");
            }
          });
        }}
      >
        <Field label="New password">
          <Input type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </Field>
        <Button type="submit">Change password</Button>
      </form>
      <div className="mt-4 space-y-3">
        <Button
          variant="ghost"
          onClick={() => {
            setError("");
            void enrollFactor().then((result) => {
              if (!result.ok) setError(result.error);
              else {
                setFactorId(result.id);
                setSecret(result.secret);
                setMessage("Enter the code from the authenticator to finish.");
              }
            });
          }}
        >
          Set up an authenticator
        </Button>
        {secret ? <p className="font-mono text-sm">{secret}</p> : null}
        {factorId ? (
          <form
            className="space-y-3"
            onSubmit={(event) => {
              event.preventDefault();
              void verifyFactor(factorId, code.trim()).then((result) => {
                if (!result.ok) setError(result.error);
                else {
                  setSecret("");
                  setFactorId("");
                  setCode("");
                  setMessage("Authenticator is on for this account.");
                }
              });
            }}
          >
            <Field label="Authenticator code">
              <Input inputMode="numeric" autoComplete="one-time-code" value={code} onChange={(event) => setCode(event.target.value)} />
            </Field>
            <Button type="submit">Confirm code</Button>
          </form>
        ) : null}
        <Button
          variant="ghost"
          onClick={() => {
            void listFactors().then((result) => {
              if (!result.ok) setError(result.error);
              else setMessage(result.factors.length ? `${result.factors.length} authenticator factor on this account.` : "No authenticator is on.");
            });
          }}
        >
          Check authenticator
        </Button>
      </div>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
      {message ? <p className="mt-3 text-sm">{message}</p> : null}
    </section>
  );
}
