import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { previewPathRewrite } from "@/lib/preview-path-prefix";
import { routeTree } from "./routeTree.gen";

function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-start justify-center bg-paper px-6 text-ink">
      <p className="text-xs font-semibold uppercase tracking-widest text-brass">Missing</p>
      <h1 className="mt-2 font-display text-3xl">This page is not on the desk.</h1>
      <a className="mt-4 text-sm text-accent underline" href="/">
        Return home
      </a>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    rewrite: previewPathRewrite(),
    defaultErrorComponent: AppErrorComponent,
    defaultNotFoundComponent: NotFound,
  });
}
