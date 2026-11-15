import type { ErrorComponentProps } from "@tanstack/react-router";

const FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";

function errorMessage(error: unknown): string {
  if (error instanceof Error && error.message) return error.message;
  if (typeof error === "string" && error) return error;
  return FALLBACK_MESSAGE;
}

export function AppErrorComponent({ error }: ErrorComponentProps) {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center bg-paper px-6 text-ink">
      <p className="text-xs font-semibold uppercase tracking-widest text-rust">Interrupted</p>
      <h1 className="mt-2 font-display text-3xl">The desk hit an error.</h1>
      <p className="mt-3 max-w-lg text-sm break-words text-muted">{errorMessage(error)}</p>
    </main>
  );
}
