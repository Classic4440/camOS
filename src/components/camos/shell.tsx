import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import * as Dialog from "@radix-ui/react-dialog";
import { Menu, Moon, Search, Sun, X } from "lucide-react";
import { formatLongToday } from "@/lib/camos/format";
import { searchDesk, type SearchHit } from "@/lib/camos/calc";
import { useDesk } from "@/lib/camos/store";
import { cn } from "@/lib/utils";
import { Button, Input } from "@/components/camos/ui";

const PRIMARY = [
  { href: "/", label: "Home" },
  { href: "/command", label: "Brief" },
  { href: "/personal", label: "Tasks" },
  { href: "/music", label: "Cam Leinad" },
  { href: "/brand", label: "Classic Brand" },
  { href: "/lab", label: "Lab" },
  { href: "/finance", label: "Ledger" },
] as const;

const LIBRARY = [
  { href: "/trading", label: "Trading" },
  { href: "/learn", label: "Learning" },
  { href: "/vault", label: "Vault" },
  { href: "/ideas", label: "Ideas" },
  { href: "/marketing", label: "Marketing" },
  { href: "/analytics", label: "Analytics" },
  { href: "/settings", label: "Settings" },
] as const;

const PLACES = [...PRIMARY, ...LIBRARY];

const DOCK = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/brand", label: "Shop" },
  { href: "/lab", label: "Lab" },
] as const;

const GO: Record<string, string> = {
  h: "/",
  c: "/command",
  p: "/personal",
  m: "/music",
  b: "/brand",
  l: "/lab",
  f: "/finance",
  t: "/trading",
  v: "/vault",
  s: "/settings",
};

export function Shell({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const theme = useDesk((state) => state.settings.theme);
  const setTheme = useDesk((state) => state.setTheme);
  const flash = useDesk((state) => state.flash);
  const [menu, setMenu] = useState(false);
  const [palette, setPalette] = useState(false);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    setMenu(false);
  }, [pathname]);

  useEffect(() => {
    const apply = () => {
      const settings = useDesk.getState().settings;
      document.documentElement.setAttribute("data-theme", settings.theme);
      document.documentElement.setAttribute("data-density", settings.density);
      document.querySelector('meta[name="theme-color"]')?.setAttribute("content", settings.theme === "dark" ? "#141210" : "#f3efe6");
    };
    if (useDesk.persist.hasHydrated()) apply();
    const unsub = useDesk.persist.onFinishHydration(apply);
    void useDesk.persist.rehydrate();
    return unsub;
  }, []);

  useEffect(() => {
    let armed = false;
    let timer = 0;
    function onKey(event: KeyboardEvent) {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setPalette(true);
        return;
      }
      const target = event.target as HTMLElement | null;
      const typing =
        !!target &&
        (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable);
      if (typing) return;
      if (event.key === "/") {
        event.preventDefault();
        setPalette(true);
        return;
      }
      if (event.key === "?") {
        event.preventDefault();
        setHelp((open) => !open);
        return;
      }
      if (event.key === "g") {
        armed = true;
        window.clearTimeout(timer);
        timer = window.setTimeout(() => {
          armed = false;
        }, 800);
        return;
      }
      if (!armed) return;
      armed = false;
      const path = GO[event.key.toLowerCase()];
      if (!path) return;
      event.preventDefault();
      void navigate({ to: path });
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [navigate]);

  return (
    <div className="flex h-dvh flex-col bg-paper text-ink">
      <a
        href="#desk"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper"
      >
        Skip to the desk
      </a>
      <header className="flex h-14 shrink-0 items-center gap-2 border-b border-line px-2 md:px-4">
        <button
          type="button"
          className="inline-flex size-11 items-center justify-center md:hidden"
          aria-label="Open index"
          onClick={() => setMenu(true)}
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
        <Link to="/" className="font-display text-xl leading-none tracking-tight">
          Cam<span className="text-brass">OS</span>
        </Link>
        <p className="hidden min-w-0 items-baseline gap-2 truncate text-sm text-muted sm:flex">
          <span aria-hidden className="text-faint">
            /
          </span>
          <span className="truncate text-ink">{placeFor(pathname)}</span>
        </p>
        <p className="ml-auto hidden text-sm text-muted lg:block">{formatLongToday()}</p>
        <div className="ml-auto flex items-center gap-1 lg:ml-4">
          {flash ? <p className="hidden max-w-40 truncate text-sm text-moss xl:block">{flash}</p> : null}
          <button
            type="button"
            onClick={() => setPalette(true)}
            className="inline-flex h-11 items-center gap-2 border border-line bg-elevated px-3 text-sm text-muted"
          >
            <Search className="size-4" strokeWidth={1.75} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden border border-line px-1.5 py-0.5 text-xs text-faint md:inline">⌘K</kbd>
          </button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center"
            aria-label={theme === "dark" ? "Use the paper theme" : "Use the ink theme"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" strokeWidth={1.75} /> : <Moon className="size-4" strokeWidth={1.75} />}
          </button>
        </div>
      </header>
      <div className="flex min-h-0 flex-1">
        <nav className="hidden w-56 shrink-0 flex-col overflow-y-auto border-r border-line md:flex" aria-label="Desk index">
          <Index pathname={pathname} />
        </nav>
        <main id="desk" className="min-w-0 flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <MobileDock pathname={pathname} onIndex={() => setMenu(true)} />
      {menu ? <MobileIndex pathname={pathname} onClose={() => setMenu(false)} /> : null}
      <Palette open={palette} onClose={() => setPalette(false)} />
      <Help open={help} onClose={() => setHelp(false)} />
    </div>
  );
}

function placeFor(pathname: string): string {
  const hit = PLACES.find((item) => (item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`)));
  return hit?.label ?? "CamOS";
}

function isCurrent(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

function Index({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <div className="flex min-h-full flex-col py-3">
      <ul>
        {PRIMARY.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} />
        ))}
      </ul>
      <p className="px-4 pb-1 pt-6 text-xs font-semibold uppercase tracking-widest text-faint">Library</p>
      <ul>
        {LIBRARY.map((item) => (
          <NavItem key={item.href} item={item} pathname={pathname} onNavigate={onNavigate} quiet />
        ))}
      </ul>
      <div className="mt-auto border-t border-line px-4 py-4">
        <p className="font-display text-sm">Cam Leinad</p>
        <p className="text-xs text-muted">Classic Brand · Matugga</p>
      </div>
    </div>
  );
}

type PlaceHref = (typeof PLACES)[number]["href"];

function NavItem({
  item,
  pathname,
  onNavigate,
  quiet = false,
}: {
  item: { href: PlaceHref; label: string };
  pathname: string;
  onNavigate?: () => void;
  quiet?: boolean;
}) {
  const active = isCurrent(pathname, item.href);
  return (
    <li>
      <Link
        to={item.href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex min-h-11 items-center border-l-2 px-4 text-sm",
          active
            ? "border-brass bg-surface font-semibold text-ink"
            : quiet
              ? "border-transparent text-muted hover:bg-surface hover:text-ink"
              : "border-transparent text-ink hover:bg-surface",
        )}
      >
        {item.label}
      </Link>
    </li>
  );
}

function MobileDock({ pathname, onIndex }: { pathname: string; onIndex: () => void }) {
  const inDock = DOCK.some((item) => isCurrent(pathname, item.href));
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-5 border-t border-line bg-paper md:hidden" aria-label="Workspaces">
      {DOCK.map((item) => {
        const active = isCurrent(pathname, item.href);
        return (
          <Link
            key={item.href}
            to={item.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center justify-center border-t-2 text-xs font-semibold",
              active ? "border-brass text-ink" : "border-transparent text-muted",
            )}
          >
            {item.label}
          </Link>
        );
      })}
      <button
        type="button"
        onClick={onIndex}
        className={cn(
          "flex items-center justify-center border-t-2 text-xs font-semibold",
          inDock ? "border-transparent text-muted" : "border-brass text-ink",
        )}
      >
        Index
      </button>
    </nav>
  );
}

function MobileIndex({ pathname, onClose }: { pathname: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-40 md:hidden" style={{ background: "var(--scrim)" }}>
      <div className="panel-in flex h-full w-full max-w-sm flex-col bg-paper">
        <div className="flex h-14 items-center justify-between border-b border-line px-2">
          <p className="px-2 font-display text-xl">
            Cam<span className="text-brass">OS</span>
          </p>
          <button type="button" className="inline-flex size-11 items-center justify-center" aria-label="Close index" onClick={onClose}>
            <X className="size-5" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Index pathname={pathname} onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}

function Palette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const openComposer = useDesk((state) => state.openComposer);
  const setFocus = useDesk((state) => state.setFocus);
  const desk = useDesk();
  const hits = useMemo(() => (query.trim() ? searchDesk(desk, query) : []), [desk, query]);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  function go(hit: SearchHit) {
    setFocus(hit.focusId);
    void navigate({ to: hit.href });
    onClose();
  }

  function create(kind: Parameters<typeof openComposer>[0], href: string) {
    openComposer(kind);
    void navigate({ to: href });
    onClose();
  }

  const actions = [
    ["New task", "task", "/personal"],
    ["New decision", "decision", "/personal"],
    ["New release", "release", "/music"],
    ["New job", "order", "/brand"],
    ["New quote", "quote", "/brand"],
    ["New ledger entry", "txn", "/finance"],
    ["New trade", "trade", "/trading"],
    ["New note", "note", "/vault"],
    ["New idea", "idea", "/ideas"],
    ["New campaign", "campaign", "/marketing"],
  ] as const;

  const shownActions = actions.filter((item) => item[0].toLowerCase().includes(query.trim().toLowerCase()));
  const places = PLACES.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: "var(--scrim)" }} />
        <Dialog.Content className="panel-in fixed inset-x-3 bottom-16 top-16 z-50 mx-auto flex max-w-xl flex-col overflow-hidden border border-line bg-elevated md:inset-x-auto md:w-full">
          <Dialog.Title className="sr-only">Search the desk</Dialog.Title>
          <div className="border-b border-line p-3">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search records, or jump"
              aria-label="Search records"
            />
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-2">
            {query.trim() && hits.length === 0 && shownActions.length === 0 && places.length === 0 ? (
              <p className="px-2 py-6 text-sm text-muted">Nothing on the desk matches that.</p>
            ) : null}
            {places.length ? (
              <Group label="Go">
                {places.map((item) => (
                  <button
                    key={item.href}
                    type="button"
                    className="flex min-h-11 w-full items-center px-2 text-left text-sm hover:bg-surface"
                    onClick={() => {
                      void navigate({ to: item.href });
                      onClose();
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </Group>
            ) : null}
            {shownActions.length ? (
              <Group label="Create">
                {shownActions.map(([label, kind, href]) => (
                  <button
                    key={label}
                    type="button"
                    className="flex min-h-11 w-full items-center px-2 text-left text-sm hover:bg-surface"
                    onClick={() => create(kind, href)}
                  >
                    {label}
                  </button>
                ))}
              </Group>
            ) : null}
            {hits.length ? (
              <Group label="Records">
                {hits.map((hit) => (
                  <button
                    key={`${hit.href}-${hit.focusId}`}
                    type="button"
                    className="flex min-h-11 w-full items-baseline gap-3 px-2 text-left hover:bg-surface"
                    onClick={() => go(hit)}
                  >
                    <span className="text-xs font-semibold uppercase tracking-widest text-faint">{hit.kicker}</span>
                    <span className="text-sm">{hit.title}</span>
                  </button>
                ))}
              </Group>
            ) : null}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function Group({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="mb-2">
      <p className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-faint">{label}</p>
      {children}
    </div>
  );
}

function Help({ open, onClose }: { open: boolean; onClose: () => void }) {
  const rows = [
    ["Ctrl or ⌘ K, or /", "Search and jump"],
    ["?", "Show or hide these shortcuts"],
    ["G then H", "Home"],
    ["G then C", "Command"],
    ["G then M", "Cam Leinad"],
    ["G then B", "Classic Brand"],
    ["G then L", "Lab"],
    ["G then F", "Finance"],
    ["G then T", "Trading"],
    ["G then V", "Vault"],
    ["G then S", "Settings"],
  ];
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50" style={{ background: "var(--scrim)" }} />
        <Dialog.Content className="panel-in fixed inset-x-3 top-20 z-50 mx-auto max-w-md border border-line bg-elevated p-4">
          <div className="mb-3 flex items-center justify-between">
            <Dialog.Title className="font-display text-xl">Shortcuts</Dialog.Title>
            <Button variant="ghost" onClick={onClose} aria-label="Close shortcuts">
              Close
            </Button>
          </div>
          <ul className="divide-y divide-line border-t border-line text-sm">
            {rows.map(([key, label]) => (
              <li key={key} className="flex items-center justify-between gap-4 py-2">
                <span>{label}</span>
                <span className="text-muted">{key}</span>
              </li>
            ))}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
