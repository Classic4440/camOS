import { cashPosition, isLate, netsByMonth, owed, sampleCount } from "@/lib/camos/calc";
import { formatMoney, kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { ORDER_STAGE_LABEL, RELEASE_STAGE_LABEL } from "@/lib/camos/types";
import { Link } from "@tanstack/react-router";
import { LedgerChart } from "@/components/camos/chart";
import { Page, PageHead, Stamp } from "@/components/camos/ui";

export function AnalyticsView() {
  const tasks = useDesk((state) => state.tasks);
  const orders = useDesk((state) => state.orders);
  const releases = useDesk((state) => state.releases);
  const projects = useDesk((state) => state.projects);
  const bugs = useDesk((state) => state.bugs);
  const txns = useDesk((state) => state.txns);
  const ideas = useDesk((state) => state.ideas);
  const paths = useDesk((state) => state.paths);
  const quotes = useDesk((state) => state.quotes);
  const customers = useDesk((state) => state.customers);
  const today = kampalaToday();
  const month = today.slice(0, 7);
  const late = tasks.filter((task) => isLate(task.due, task.done, today));
  const liveOrders = orders.filter((order) => !order.sample && order.stage !== "delivered");
  const stuckReleases = releases.filter((release) => release.stage !== "released");
  const openBugs = bugs.filter((bug) => bug.open);
  const ugx = netsByMonth(txns, "UGX").filter((row) => row.month === month);
  const samples = sampleCount({ orders, quotes, customers });
  const review: { id: string; text: string; href: "/" | "/personal" | "/music" | "/brand" | "/finance" }[] = [];
  for (const task of late) review.push({ id: task.id, text: task.title, href: "/personal" });
  for (const order of orders) {
    if (order.sample || order.stage === "delivered" || owed(order) <= 0) continue;
    review.push({ id: order.id, text: `${order.number} still owes ${formatMoney(owed(order), "UGX")}`, href: "/brand" });
  }
  for (const release of releases) {
    const gaps = [
      release.tracks.length === 0 ? "tracklist" : null,
      release.artwork ? null : "artwork",
      release.metadataReady ? null : "metadata",
      release.masters ? null : "masters",
    ].filter(Boolean);
    if (release.stage !== "released" && gaps.length) {
      review.push({ id: release.id, text: `${release.catalog} still needs ${gaps.join(", ")}`, href: "/music" });
    }
  }

  return (
    <Page>
      <PageHead
        kicker="Office · Analytics"
        title="What the records actually say."
        lede="Counted from the records on this desk. Sample shop jobs are left out of the live totals."
      />
      <section className="mb-10">
        <h2 className="font-display text-2xl">Across the houses</h2>
        {review.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Nothing late, nothing unpaid on a live job, and no open release is missing a gate.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {review.slice(0, 8).map((row) => (
              <li key={row.id}>
                <Link to={row.href} className="flex min-h-12 items-center py-2 text-sm">
                  {row.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
      <div className="grid gap-8 md:grid-cols-2">
        <figure className="border-t border-ink pt-3">
          <figcaption className="text-xs font-semibold uppercase tracking-widest text-faint">Past-date tasks</figcaption>
          <p className="font-display text-4xl tabular-nums">{late.length}</p>
        </figure>
        <figure className="border-t border-line pt-3">
          <figcaption className="text-xs font-semibold uppercase tracking-widest text-faint">Live shop jobs</figcaption>
          <p className="font-display text-4xl tabular-nums">{liveOrders.length}</p>
          <p className="text-sm text-muted">{samples} sample records still sitting in Classic Brand.</p>
        </figure>
      </div>
      <section className="mt-10">
        <h2 className="font-display text-2xl">Releases not out</h2>
        {stuckReleases.length === 0 ? (
          <p className="mt-2 text-sm text-muted">Every catalog entry is marked released.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {stuckReleases.map((release) => (
              <li key={release.id} className="flex items-center justify-between gap-3 py-3">
                <span>
                  <span className="font-semibold">{release.title}</span>
                  <span className="ml-2 text-sm text-muted">{release.catalog}</span>
                </span>
                <Stamp tone="brass">{RELEASE_STAGE_LABEL[release.stage]}</Stamp>
              </li>
            ))}
          </ul>
        )}
      </section>
      <section className="mt-10">
        <h2 className="font-display text-2xl">Shop queue, live only</h2>
        <ul className="mt-3 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
          {(Object.keys(ORDER_STAGE_LABEL) as (keyof typeof ORDER_STAGE_LABEL)[]).map((stage) => (
            <li key={stage} className="bg-paper px-3 py-3">
              <p className="text-xs uppercase tracking-widest text-faint">{ORDER_STAGE_LABEL[stage]}</p>
              <p className="font-display text-2xl tabular-nums">{orders.filter((order) => !order.sample && order.stage === stage).length}</p>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-10">
        <h2 className="font-display text-2xl">This month, UGX</h2>
        <p className="mt-1 text-sm text-muted">
          Actual position overall {formatMoney(cashPosition(txns, "UGX"), "UGX")}. This month's net is below, split by certainty.
        </p>
        {ugx.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No UGX movement dated this month.</p>
        ) : (
          <div className="mt-4">
            <LedgerChart rows={ugx} currency="UGX" />
          </div>
        )}
      </section>
      <section className="mt-10 grid gap-6 border-t border-line pt-4 md:grid-cols-3">
        <p className="text-sm">
          <span className="block text-xs font-semibold uppercase tracking-widest text-faint">Open defects</span>
          <span className="font-display text-3xl tabular-nums">{openBugs.length}</span>
          <span className="mt-1 block text-muted">{projects.filter((project) => project.status === "active").length} projects marked active.</span>
        </p>
        <p className="text-sm">
          <span className="block text-xs font-semibold uppercase tracking-widest text-faint">Ideas in play</span>
          <span className="font-display text-3xl tabular-nums">{ideas.filter((idea) => idea.status === "testing" || idea.status === "committed").length}</span>
          <span className="mt-1 block text-muted">{ideas.filter((idea) => idea.status === "raw").length} still raw.</span>
        </p>
        <p className="text-sm">
          <span className="block text-xs font-semibold uppercase tracking-widest text-faint">Study mean</span>
          <span className="font-display text-3xl tabular-nums">
            {paths.length ? Math.round(paths.reduce((sum, path) => sum + path.progress, 0) / paths.length) : 0}%
          </span>
          <span className="mt-1 block text-muted">Across the learning paths, not a certificate.</span>
        </p>
      </section>
    </Page>
  );
}
