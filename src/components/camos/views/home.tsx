import { Link } from "@tanstack/react-router";
import { isLate, releaseFact, sampleCount, cashPosition } from "@/lib/camos/calc";
import { formatDay, kampalaToday, salutation, weekDates, weekdayShort } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { HOME_LABEL, RELEASE_STAGE_LABEL, type HomeBlock } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { Button, Page, Stamp, Tile, TileGrid } from "@/components/camos/ui";
import { useState, type ReactNode } from "react";

export function HomeView() {
  const settings = useDesk((state) => state.settings);
  const tasks = useDesk((state) => state.tasks);
  const decisions = useDesk((state) => state.decisions);
  const releases = useDesk((state) => state.releases);
  const orders = useDesk((state) => state.orders);
  const projects = useDesk((state) => state.projects);
  const txns = useDesk((state) => state.txns);
  const paths = useDesk((state) => state.paths);
  const ideas = useDesk((state) => state.ideas);
  const quotes = useDesk((state) => state.quotes);
  const customers = useDesk((state) => state.customers);
  const moveHome = useDesk((state) => state.moveHome);
  const toggleHomeBlock = useDesk((state) => state.toggleHomeBlock);
  const updateTask = useDesk((state) => state.updateTask);
  const today = kampalaToday();
  const [day, setDay] = useState(today);
  const [arrange, setArrange] = useState(false);
  const samples = sampleCount({ orders, quotes, customers });
  const visible = settings.homeOrder.filter((id) => !settings.hiddenHome.includes(id));
  const late = tasks.filter((task) => isLate(task.due, task.done, today));
  const dueToday = tasks.filter((task) => !task.done && task.due === today);
  const album = releases[0];
  const parts: string[] = [];
  if (late.length) parts.push(`${late.length} open ${late.length === 1 ? "task is" : "tasks are"} past date`);
  else if (dueToday.length) parts.push(`${dueToday.length} ${dueToday.length === 1 ? "task is" : "tasks are"} due today`);
  else parts.push("No task is due today");
  if (album) parts.push(`${album.catalog} is in ${RELEASE_STAGE_LABEL[album.stage].toLowerCase()}`);
  if (samples) parts.push("sample shop jobs are still on the board");

  const blocks: Record<HomeBlock, ReactNode> = {
    sequence: (
      <Sequence
        day={day}
        tasks={tasks.filter((task) => !task.done && (task.due === day || (!task.due && task.priority === "now" && day === today)))}
        onDone={(id) => updateTask(id, { done: true })}
      />
    ),
    attention: <Attention today={today} />,
    houses: (
      <TileGrid cols={3}>
        <Link to="/music" className="block h-full">
          <Tile
            kicker="Music"
            title="Cam Leinad"
            detail={album ? `${album.title} · ${RELEASE_STAGE_LABEL[album.stage]} · ${releaseFact(album)}` : "No release on the catalog yet."}
            className="h-full"
          />
        </Link>
        <Link to="/brand" className="block h-full">
          <Tile
            kicker="Shop"
            title="Classic Brand"
            detail={`${orders.filter((order) => !order.sample && order.stage !== "delivered").length} live jobs in progress · Matugga`}
            className="h-full"
          />
        </Link>
        <Link to="/lab" className="block h-full">
          <Tile
            kicker="Build"
            title="Lab"
            detail={`${projects.filter((project) => project.status === "active").length} active projects of ${projects.length} recorded`}
            className="h-full"
          />
        </Link>
      </TileGrid>
    ),
    week: (
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {weekDates(today).map((date) => {
          const count =
            tasks.filter((task) => !task.done && task.due === date).length +
            orders.filter((order) => !order.sample && order.stage !== "delivered" && order.due === date).length;
          const active = date === day;
          return (
            <li key={date}>
              <button
                type="button"
                onClick={() => setDay(date)}
                className={cn(
                  "flex min-h-20 w-full flex-col items-start border px-3 py-2.5 text-left transition-colors",
                  active ? "border-ink bg-ink text-paper" : "border-line bg-elevated hover:border-ink",
                )}
              >
                <span className={cn("text-xs uppercase tracking-widest", active ? "text-paper/70" : "text-faint")}>
                  {date === today ? "Today" : weekdayShort(date)}
                </span>
                <span className="mt-1 font-display text-xl tabular-nums">{date.slice(8)}</span>
                <span className={cn("mt-auto pt-2 text-xs tabular-nums", active ? "text-paper/80" : "text-muted")}>
                  {count === 0 ? "Clear" : `${count} due`}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    ),
    books: (
      <TileGrid cols={3}>
        <Link to="/finance" className="block h-full">
          <Tile kicker="Actual cash" className="h-full">
            <p className="mt-1 font-display text-2xl tabular-nums">{formatUg(cashPosition(txns, "UGX"))}</p>
            <p className="mt-1.5 text-sm text-muted">UGX shop book. Dollars stay on the ledger.</p>
          </Tile>
        </Link>
        <Link to="/learn" className="block h-full">
          <Tile kicker="Study" className="h-full">
            <p className="mt-1 font-display text-2xl tabular-nums">
              {paths.length ? Math.round(paths.reduce((sum, path) => sum + path.progress, 0) / paths.length) : 0}
              <span className="text-base text-muted">%</span>
            </p>
            <p className="mt-1.5 text-sm text-muted">Mean progress across recorded paths.</p>
          </Tile>
        </Link>
        <Link to="/ideas" className="block h-full">
          <Tile kicker="Ideas" className="h-full">
            <p className="mt-1 font-display text-2xl tabular-nums">{ideas.filter((idea) => idea.status !== "shelved").length}</p>
            <p className="mt-1.5 text-sm text-muted">
              {decisions.filter((item) => item.status === "open").length} open decisions on the task desk.
            </p>
          </Tile>
        </Link>
      </TileGrid>
    ),
  };

  return (
    <Page>
      <header className="mb-8 grid gap-4 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">{formatDay(today)}</p>
          <h1 className="mt-2 font-display text-3xl font-medium leading-tight md:text-4xl">
            {salutation()}, {settings.called}.
          </h1>
          <p className="mt-3 text-base leading-relaxed">
            {parts
              .map((part, index) => (index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
              .join(". ")}
            .
          </p>
          {settings.focus ? <p className="mt-2 text-sm text-muted">{settings.focus}</p> : null}
        </div>
        <Button variant={arrange ? "primary" : "line"} onClick={() => setArrange((open) => !open)}>
          {arrange ? "Done" : "Arrange"}
        </Button>
      </header>
      {visible.length === 0 ? (
        <p className="text-sm text-muted">
          Every desk block is hidden. Restore them in{" "}
          <Link to="/settings" className="text-accent underline">
            Settings
          </Link>
          .
        </p>
      ) : (
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-12">
          {visible.map((id) => (
            <section
              key={id}
              className={cn(id === "sequence" ? "lg:col-span-7" : id === "attention" ? "lg:col-span-5" : "lg:col-span-12")}
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <h2 className="font-display text-xl">{HOME_LABEL[id]}</h2>
                {arrange ? (
                  <div className="flex">
                    <Button variant="ghost" aria-label={`Move ${HOME_LABEL[id]} earlier`} onClick={() => moveHome(id, -1)}>
                      Up
                    </Button>
                    <Button variant="ghost" aria-label={`Move ${HOME_LABEL[id]} later`} onClick={() => moveHome(id, 1)}>
                      Down
                    </Button>
                    <Button variant="ghost" onClick={() => toggleHomeBlock(id)}>
                      Hide
                    </Button>
                  </div>
                ) : null}
              </div>
              {blocks[id]}
            </section>
          ))}
        </div>
      )}
    </Page>
  );
}

function formatUg(value: number): string {
  return new Intl.NumberFormat("en-UG", { style: "currency", currency: "UGX", maximumFractionDigits: 0 }).format(value);
}

function Sequence({
  day,
  tasks,
  onDone,
}: {
  day: string;
  tasks: { id: string; title: string; house: string; priority: string; due: string | null }[];
  onDone: (id: string) => void;
}) {
  if (!tasks.length) {
    return (
      <Tile className="min-h-0 border-dashed">
        <p className="text-sm text-muted">Nothing is scheduled for {formatDay(day)}. The week strip can move the day.</p>
      </Tile>
    );
  }
  return (
    <ul className="grid gap-2">
      {tasks.map((task, index) => (
        <li key={task.id}>
          <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 border border-line bg-elevated px-3 py-2.5">
            <span className="font-display text-lg tabular-nums text-faint">{String(index + 1).padStart(2, "0")}</span>
            <div className="min-w-0">
              <p className="font-semibold">{task.title}</p>
              <p className="text-sm text-muted">
                {task.house} · {task.priority}
                {task.due ? ` · ${formatDay(task.due)}` : ""}
              </p>
            </div>
            <Button variant="ghost" onClick={() => onDone(task.id)}>
              Done
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Attention({ today }: { today: string }) {
  const tasks = useDesk((state) => state.tasks);
  const decisions = useDesk((state) => state.decisions);
  const releases = useDesk((state) => state.releases);
  const orders = useDesk((state) => state.orders);
  const rows: { id: string; label: string; href: "/" | "/personal" | "/music" | "/brand"; tone: "rust" | "brass" | "neutral"; mark: string }[] = [];
  for (const task of tasks) {
    if (task.done) continue;
    if (isLate(task.due, task.done, today)) rows.push({ id: task.id, label: task.title, href: "/personal", tone: "rust", mark: "Late" });
    else if (task.due === today) rows.push({ id: task.id, label: task.title, href: "/personal", tone: "brass", mark: "Today" });
  }
  for (const decision of decisions) {
    if (decision.status === "open") rows.push({ id: decision.id, label: decision.question, href: "/personal", tone: "brass", mark: "Decide" });
  }
  for (const release of releases) {
    if (release.tracks.length === 0) rows.push({ id: release.id, label: `${release.catalog} has no tracklist`, href: "/music", tone: "neutral", mark: "Gap" });
  }
  for (const order of orders) {
    if (order.sample || order.stage === "delivered") continue;
    if (order.due && order.due < today) rows.push({ id: order.id, label: `${order.number} is past its date`, href: "/brand", tone: "rust", mark: "Late" });
  }
  if (!rows.length) {
    return (
      <Tile className="min-h-0 border-dashed">
        <p className="text-sm leading-relaxed text-muted">Nothing is late, and no decision is waiting. Use the day for the focus line above.</p>
      </Tile>
    );
  }
  return (
    <ul className="grid gap-2">
      {rows.slice(0, 6).map((row) => (
        <li key={row.id}>
          <Link
            to={row.href}
            className="flex min-h-12 items-center justify-between gap-3 border border-line bg-elevated px-3 py-2.5 hover:border-ink"
          >
            <span className="text-sm">{row.label}</span>
            <Stamp tone={row.tone}>{row.mark}</Stamp>
          </Link>
        </li>
      ))}
    </ul>
  );
}
