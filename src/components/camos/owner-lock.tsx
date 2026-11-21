import { useEffect, useState } from "react";
import ownerSql from "../../../supabase/migrations/0002_owner_lock.sql?raw";
import { recoverOwner, signInOwner } from "@/lib/camos/owner-session";
import { anonymousDeskIsOpen } from "@/lib/camos/remote";
import { Button, Field, Input } from "@/components/camos/ui";

type Mode = "sign-in" | "recover";

export function OwnerLock() {
  const [mode, setMode] = useState<Mode>("sign-in");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    void anonymousDeskIsOpen().then(setOpen);
  }, []);

  async function submit() {
    setBusy(true);
    setError("");
    setNotice("");
    if (mode === "recover") {
      const result = await recoverOwner(email.trim());
      setBusy(false);
      if (!result.ok) setError(result.error);
      else setNotice("If that email can receive mail, a recovery message is on its way.");
      return;
    }
    if (password.length < 8) {
      setBusy(false);
      setError("Use at least 8 characters.");
      return;
    }
    const result = await signInOwner(email.trim(), password);
    setBusy(false);
    if (!result.ok) setError(result.error);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col justify-center px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-faint">CamOS · Private</p>
      <h1 className="mt-2 font-display text-4xl font-medium leading-tight">The desk is locked.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Sign in with the owner email and password. Public registration is closed. Invited members get their own private desk.
      </p>

      {open ? (
        <div className="mt-6 border border-rust bg-elevated p-4">
          <p className="text-sm font-semibold text-rust">Anonymous access is still open.</p>
          <p className="mt-2 text-sm text-muted">
            A signed-out client can still read the desk in Supabase. Run the owner migration in the SQL editor before treating this as private.
          </p>
          <pre className="mt-3 max-h-40 overflow-auto border border-line bg-surface p-3 text-xs leading-relaxed">{ownerSql}</pre>
          <Button
            className="mt-3"
            onClick={() => {
              void navigator.clipboard.writeText(ownerSql);
              setNotice("Migration copied.");
            }}
          >
            Copy migration
          </Button>
        </div>
      ) : null}

      {open === false ? (
        <p className="mt-6 border border-line bg-elevated px-4 py-3 text-sm text-muted">Anonymous desk reads are refused.</p>
      ) : null}

      <div className="mt-6 border border-line bg-elevated p-5 sm:p-6">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <Field label="Email">
            <Input type="email" autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} required />
          </Field>
          {mode === "recover" ? null : (
            <Field label="Password">
              <Input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </Field>
          )}
          {error ? <p className="text-sm text-rust">{error}</p> : null}
          {notice ? <p className="text-sm">{notice}</p> : null}
          <Button type="submit" variant="primary" className="w-full sm:w-auto" disabled={busy}>
            {mode === "sign-in" ? "Sign in" : "Send recovery email"}
          </Button>
        </form>
        <div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
          {mode !== "sign-in" ? (
            <Button variant="ghost" onClick={() => setMode("sign-in")}>
              Sign in
            </Button>
          ) : null}
          {mode !== "recover" ? (
            <Button variant="ghost" onClick={() => setMode("recover")}>
              Forgot password
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
