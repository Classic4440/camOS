import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { acceptInviteSession, changeOwnerPassword } from "@/lib/camos/owner-session";
import { Button, Field, Input } from "@/components/camos/ui";

export const Route = createFileRoute("/welcome")({
  head: () => ({ meta: [{ title: "Welcome · CamOS" }] }),
  component: WelcomePage,
});

type Phase = "loading" | "ready" | "invalid" | "done";

function WelcomePage() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState<Phase>("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [again, setAgain] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      const result = await acceptInviteSession();
      if (!result.ok) {
        setPhase("invalid");
        setError(result.error);
        return;
      }
      setEmail(result.email);
      setPhase("ready");
    })();
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Use at least 8 characters.");
      return;
    }
    if (password !== again) {
      setError("The two passwords do not match.");
      return;
    }
    setBusy(true);
    const result = await changeOwnerPassword(password);
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPhase("done");
    window.setTimeout(() => {
      void navigate({ to: "/" });
    }, 600);
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-xl flex-col justify-center px-4 py-10">
      <p className="text-xs font-semibold uppercase tracking-widest text-faint">CamOS · Welcome</p>
      <h1 className="mt-2 font-display text-4xl font-medium leading-tight">Set your password.</h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        You were invited to your own private desk. Choose a password, then the desk opens.
      </p>

      {phase === "loading" ? <p className="mt-8 text-sm text-muted">Checking the invite…</p> : null}

      {phase === "invalid" ? (
        <div className="mt-8 space-y-4">
          <p className="text-sm text-rust">{error || "This invite link is invalid or has expired."}</p>
          <Button variant="primary" onClick={() => void navigate({ to: "/" })}>
            Return to sign in
          </Button>
        </div>
      ) : null}

      {phase === "ready" || phase === "done" ? (
        <form className="mt-8 space-y-4" onSubmit={(event) => void submit(event)}>
          {email ? <p className="text-sm text-muted">Invited as <span className="text-ink">{email}</span></p> : null}
          <Field label="Password">
            <Input
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={8}
            />
          </Field>
          <Field label="Confirm password">
            <Input
              type="password"
              autoComplete="new-password"
              value={again}
              onChange={(event) => setAgain(event.target.value)}
              required
              minLength={8}
            />
          </Field>
          {error ? <p className="text-sm text-rust">{error}</p> : null}
          {phase === "done" ? <p className="text-sm text-moss">Password saved. Opening your desk…</p> : null}
          <Button type="submit" variant="primary" disabled={busy || phase === "done"}>
            {busy ? "Saving…" : "Save and open desk"}
          </Button>
        </form>
      ) : null}
    </div>
  );
}
