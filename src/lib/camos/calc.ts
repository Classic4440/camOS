import { kampalaToday } from "./format.ts";
import type {
  Currency,
  Customer,
  DeskData,
  Order,
  Release,
  Task,
  Trade,
  Txn,
} from "./types.ts";

export function isLate(due: string | null, done: boolean, today = kampalaToday()): boolean {
  return Boolean(due && !done && due < today);
}

export function owed(order: Pick<Order, "price" | "paid">): number {
  return round2(order.price - order.paid);
}

export function customerBalance(customer: Customer, orders: Order[]): number {
  const jobs = orders.filter((order) => order.customerId === customer.id);
  return round2(customer.opening + jobs.reduce((sum, order) => sum + owed(order), 0));
}

export function cashPosition(txns: Txn[], currency: Currency): number {
  return round2(
    txns
      .filter((txn) => txn.currency === currency && txn.certainty === "actual")
      .reduce((sum, txn) => sum + signed(txn), 0),
  );
}

export function projectedPosition(txns: Txn[], currency: Currency): number {
  return round2(
    txns
      .filter((txn) => txn.currency === currency && txn.certainty === "projected")
      .reduce((sum, txn) => sum + signed(txn), 0),
  );
}

export function netsByMonth(txns: Txn[], currency: Currency): { month: string; actual: number; projected: number }[] {
  const map = new Map<string, { month: string; actual: number; projected: number }>();
  for (const txn of txns) {
    if (txn.currency !== currency) continue;
    const month = txn.date.slice(0, 7);
    const row = map.get(month) ?? { month, actual: 0, projected: 0 };
    const value = signed(txn);
    if (txn.certainty === "actual") row.actual = round2(row.actual + value);
    else row.projected = round2(row.projected + value);
    map.set(month, row);
  }
  return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}

export function positionSize(account: number, riskPct: number, stop: number): number | null {
  if (!(account > 0) || !(riskPct > 0) || !(stop > 0)) return null;
  if (riskPct > 100) return null;
  return round2((account * (riskPct / 100)) / stop);
}

export function tradePnl(trade: Pick<Trade, "side" | "entry" | "exit" | "size">): number | null {
  if (trade.exit === null || !(trade.size > 0)) return null;
  const diff = trade.side === "long" ? trade.exit - trade.entry : trade.entry - trade.exit;
  return round2(diff * trade.size);
}

export function royaltyTotals(rows: { amount: number; currency: Currency; certainty: "actual" | "projected" }[]) {
  const totals: Record<Currency, { received: number; estimated: number }> = {
    UGX: { received: 0, estimated: 0 },
    USD: { received: 0, estimated: 0 },
  };
  for (const row of rows) {
    if (row.certainty === "actual") totals[row.currency].received = round2(totals[row.currency].received + row.amount);
    else totals[row.currency].estimated = round2(totals[row.currency].estimated + row.amount);
  }
  return totals;
}

export function openTasks(tasks: Task[]): Task[] {
  return tasks.filter((task) => !task.done);
}

export function sampleCount(data: Pick<DeskData, "orders" | "quotes" | "customers">): number {
  return (
    data.orders.filter((item) => item.sample).length +
    data.quotes.filter((item) => item.sample).length +
    data.customers.filter((item) => item.sample).length
  );
}

export function nextCode(existing: string[], prefix: string, floor: number): string {
  const nums = existing.map((value) => Number(value.replace(/^\D+/, ""))).filter((n) => Number.isFinite(n));
  const next = Math.max(floor, ...nums, floor) + (nums.length ? 1 : 0);
  const width = prefix === "CAM" ? 3 : 4;
  return `${prefix}-${String(nums.length ? next : floor).padStart(width, "0")}`;
}

export function releaseFact(release: Release): string {
  const tracks = release.tracks.length;
  return `${release.catalog} · ${tracks} ${tracks === 1 ? "track" : "tracks"}`;
}

export function wikiTitles(body: string): string[] {
  return [...body.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => match[1]?.trim() ?? "").filter(Boolean);
}

export function buildSnapshot(data: DeskData): string {
  const today = kampalaToday();
  const payload = {
    today,
    confirmed: {
      called: data.settings.called,
      legalName: data.settings.legalName,
      professional: data.settings.professional,
      artist: data.settings.artist,
      label: data.settings.label,
      website: data.settings.website,
      genres: data.settings.genres,
      daw: data.settings.daw,
      shop: data.settings.shop,
      shopLocation: data.settings.shopLocation,
      services: data.settings.services,
    },
    focus: data.settings.focus,
    openTasks: openTasks(data.tasks)
      .slice(0, 10)
      .map((task) => ({
        title: task.title,
        house: task.house,
        due: task.due,
        priority: task.priority,
        late: isLate(task.due, task.done, today),
      })),
    openDecisions: data.decisions.filter((item) => item.status === "open").map((item) => item.question),
    releases: data.releases.map((release) => ({
      catalog: release.catalog,
      title: release.title,
      stage: release.stage,
      tracks: release.tracks.length,
      distribution: release.distribution,
    })),
    orders: data.orders.map((order) => ({
      number: order.number,
      stage: order.stage,
      due: order.due,
      owed: owed(order),
      sample: Boolean(order.sample),
    })),
    cashActual: {
      UGX: cashPosition(data.txns, "UGX"),
      USD: cashPosition(data.txns, "USD"),
    },
    cashProjected: {
      UGX: projectedPosition(data.txns, "UGX"),
      USD: projectedPosition(data.txns, "USD"),
    },
    projects: data.projects.map((project) => ({ name: project.name, status: project.status })),
    ideas: data.ideas.map((idea) => ({ title: idea.title, status: idea.status, score: idea.score })),
    note: "Sample orders are illustrations, not confirmed jobs. Do not treat them as live revenue.",
  };
  return JSON.stringify(payload).slice(0, 4000);
}

export type SearchHit = { href: string; kicker: string; title: string; focusId: string };

export function searchDesk(data: DeskData, query: string): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const hits: SearchHit[] = [];
  const push = (hit: SearchHit, hay: string) => {
    if (hay.toLowerCase().includes(q)) hits.push(hit);
  };
  for (const task of data.tasks) push({ href: "/personal", kicker: "Task", title: task.title, focusId: task.id }, `${task.title} ${task.notes}`);
  for (const release of data.releases) {
    push(
      { href: "/music", kicker: "Release", title: release.title, focusId: release.id },
      `${release.title} ${release.catalog} ${release.lyrics} ${release.tracks.map((track) => track.title).join(" ")}`,
    );
  }
  for (const order of data.orders) push({ href: "/brand", kicker: "Job", title: `${order.number} ${order.garment}`, focusId: order.id }, `${order.number} ${order.garment} ${order.spec}`);
  for (const customer of data.customers) push({ href: "/brand", kicker: "Customer", title: customer.name, focusId: customer.id }, `${customer.name} ${customer.phone}`);
  for (const project of data.projects) push({ href: "/lab", kicker: "Project", title: project.name, focusId: project.id }, `${project.name} ${project.summary} ${project.notes}`);
  for (const note of data.notes) push({ href: "/vault", kicker: "Note", title: note.title, focusId: note.id }, `${note.title} ${note.body} ${note.tags.join(" ")}`);
  for (const idea of data.ideas) push({ href: "/ideas", kicker: "Idea", title: idea.title, focusId: idea.id }, `${idea.title} ${idea.thesis}`);
  for (const txn of data.txns) push({ href: "/finance", kicker: "Ledger", title: txn.category, focusId: txn.id }, `${txn.category} ${txn.note}`);
  for (const campaign of data.campaigns) push({ href: "/marketing", kicker: "Campaign", title: campaign.name, focusId: campaign.id }, `${campaign.name} ${campaign.channel}`);
  return hits.slice(0, 12);
}

function signed(txn: Txn): number {
  return txn.kind === "in" ? txn.amount : -txn.amount;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}
