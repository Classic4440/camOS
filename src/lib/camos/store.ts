import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nextCode } from "./calc";
import { kampalaToday } from "./format";
import { seed } from "./seed";
import type {
  Bug,
  Campaign,
  Composer,
  Customer,
  Decision,
  Density,
  Deploy,
  DeskData,
  HomeBlock,
  Idea,
  InventoryItem,
  Memo,
  Order,
  Project,
  Quote,
  Release,
  Royalty,
  SessionLog,
  Task,
  TechDecision,
  ThemeName,
  Trade,
  Txn,
} from "./types";

type Store = DeskData & {
  flash: string | null;
  composer: Composer | null;
  focusId: string | null;
  setTheme: (theme: ThemeName) => void;
  setDensity: (density: Density) => void;
  patchSettings: (patch: Partial<DeskData["settings"]>) => void;
  moveHome: (id: HomeBlock, dir: -1 | 1) => void;
  toggleHomeBlock: (id: HomeBlock) => void;
  flashMsg: (message: string) => void;
  openComposer: (kind: Composer) => void;
  closeComposer: () => void;
  setFocus: (id: string | null) => void;
  addTask: (task: Omit<Task, "id" | "done"> & { done?: boolean }) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  removeTasks: (ids: string[]) => void;
  completeTasks: (ids: string[]) => void;
  addDecision: (decision: Omit<Decision, "id">) => void;
  updateDecision: (id: string, patch: Partial<Decision>) => void;
  removeDecision: (id: string) => void;
  addRelease: (release: Omit<Release, "id" | "catalog" | "tracks"> & { tracks?: Release["tracks"] }) => void;
  updateRelease: (id: string, patch: Partial<Release>) => void;
  removeRelease: (id: string) => void;
  addTrack: (releaseId: string, title: string) => void;
  updateTrack: (releaseId: string, trackId: string, patch: Partial<Release["tracks"][number]>) => void;
  removeTrack: (releaseId: string, trackId: string) => void;
  addSession: (session: Omit<SessionLog, "id">) => void;
  removeSession: (id: string) => void;
  addRoyalty: (row: Omit<Royalty, "id">) => void;
  removeRoyalty: (id: string) => void;
  postRoyalty: (id: string) => boolean;
  replaceDesk: (data: DeskData) => void;
  addCustomer: (customer: Omit<Customer, "id">) => string;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  removeCustomer: (id: string) => void;
  addOrder: (order: Omit<Order, "id" | "number">) => void;
  updateOrder: (id: string, patch: Partial<Order>) => void;
  removeOrders: (ids: string[]) => void;
  addInventory: (item: Omit<InventoryItem, "id">) => void;
  adjustInventory: (id: string, onHand: number) => void;
  removeInventory: (id: string) => void;
  addQuote: (quote: Omit<Quote, "id">) => void;
  updateQuote: (id: string, patch: Partial<Quote>) => void;
  removeQuote: (id: string) => void;
  convertQuote: (id: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  addBug: (bug: Omit<Bug, "id" | "open">) => void;
  updateBug: (id: string, patch: Partial<Bug>) => void;
  removeBug: (id: string) => void;
  addTechDecision: (row: Omit<TechDecision, "id">) => void;
  removeTechDecision: (id: string) => void;
  addDeploy: (row: Omit<Deploy, "id">) => void;
  removeDeploy: (id: string) => void;
  addTxn: (txn: Omit<Txn, "id">) => void;
  removeTxns: (ids: string[]) => void;
  addTrade: (trade: Omit<Trade, "id">) => void;
  removeTrade: (id: string) => void;
  setPath: (id: string, patch: Partial<DeskData["paths"][number]>) => void;
  answerExercise: (id: string, picked: number) => void;
  addNote: (note: Omit<DeskData["notes"][number], "id" | "updated">) => void;
  updateNote: (id: string, patch: Partial<DeskData["notes"][number]>) => void;
  removeNote: (id: string) => void;
  addIdea: (idea: Omit<Idea, "id">) => void;
  updateIdea: (id: string, patch: Partial<Idea>) => void;
  removeIdea: (id: string) => void;
  addCampaign: (campaign: Omit<Campaign, "id">) => void;
  updateCampaign: (id: string, patch: Partial<Campaign>) => void;
  removeCampaign: (id: string) => void;
  addMemo: (memo: Omit<Memo, "id" | "at"> & { at?: string }) => void;
  clearMemos: () => void;
  canAsk: () => boolean;
  noteAiUse: () => void;
  aiRemaining: () => number;
  clearSamples: () => void;
  resetDesk: () => void;
};

const DATA_KEYS: (keyof DeskData)[] = [
  "settings",
  "tasks",
  "decisions",
  "releases",
  "sessions",
  "royalties",
  "customers",
  "orders",
  "inventory",
  "quotes",
  "projects",
  "bugs",
  "techDecisions",
  "deploys",
  "txns",
  "trades",
  "paths",
  "exercises",
  "notes",
  "ideas",
  "campaigns",
  "memos",
];

let flashTimer: ReturnType<typeof setTimeout> | undefined;

function uid(): string {
  return crypto.randomUUID();
}

function replaceById<T extends { id: string }>(items: T[], id: string, patch: Partial<T>): T[] {
  return items.map((item) => (item.id === id ? { ...item, ...patch } : item));
}

export const useDesk = create<Store>()(
  persist(
    (set, get) => ({
      ...seed(),
      flash: null,
      composer: null,
      focusId: null,
      setTheme: (theme) => {
        document.documentElement.setAttribute("data-theme", theme);
        set((state) => ({ settings: { ...state.settings, theme } }));
      },
      setDensity: (density) => {
        document.documentElement.setAttribute("data-density", density);
        set((state) => ({ settings: { ...state.settings, density } }));
      },
      patchSettings: (patch) => set((state) => ({ settings: { ...state.settings, ...patch } })),
      moveHome: (id, dir) =>
        set((state) => {
          const order = [...state.settings.homeOrder];
          const index = order.indexOf(id);
          const next = index + dir;
          if (index < 0 || next < 0 || next >= order.length) return state;
          const [item] = order.splice(index, 1);
          if (!item) return state;
          order.splice(next, 0, item);
          return { settings: { ...state.settings, homeOrder: order } };
        }),
      toggleHomeBlock: (id) =>
        set((state) => {
          const hidden = state.settings.hiddenHome.includes(id)
            ? state.settings.hiddenHome.filter((item) => item !== id)
            : [...state.settings.hiddenHome, id];
          return { settings: { ...state.settings, hiddenHome: hidden } };
        }),
      flashMsg: (message) => {
        set({ flash: message });
        clearTimeout(flashTimer);
        flashTimer = setTimeout(() => set({ flash: null }), 2600);
      },
      openComposer: (kind) => set({ composer: kind }),
      closeComposer: () => set({ composer: null }),
      setFocus: (id) => set({ focusId: id }),
      addTask: (task) =>
        set((state) => ({
          tasks: [{ ...task, id: uid(), done: task.done ?? false }, ...state.tasks],
          composer: null,
        })),
      updateTask: (id, patch) => set((state) => ({ tasks: replaceById(state.tasks, id, patch) })),
      removeTasks: (ids) => set((state) => ({ tasks: state.tasks.filter((task) => !ids.includes(task.id)) })),
      completeTasks: (ids) =>
        set((state) => ({
          tasks: state.tasks.map((task) => (ids.includes(task.id) ? { ...task, done: true } : task)),
        })),
      addDecision: (decision) =>
        set((state) => ({ decisions: [{ ...decision, id: uid() }, ...state.decisions], composer: null })),
      updateDecision: (id, patch) => set((state) => ({ decisions: replaceById(state.decisions, id, patch) })),
      removeDecision: (id) => set((state) => ({ decisions: state.decisions.filter((item) => item.id !== id) })),
      addRelease: (release) =>
        set((state) => ({
          releases: [
            {
              ...release,
              id: uid(),
              catalog: nextCode(
                state.releases.map((item) => item.catalog),
                "CAM",
                1,
              ),
              tracks: release.tracks ?? [],
            },
            ...state.releases,
          ],
          composer: null,
        })),
      updateRelease: (id, patch) => set((state) => ({ releases: replaceById(state.releases, id, patch) })),
      removeRelease: (id) => set((state) => ({ releases: state.releases.filter((item) => item.id !== id) })),
      addTrack: (releaseId, title) =>
        set((state) => ({
          releases: state.releases.map((release) =>
            release.id === releaseId
              ? {
                  ...release,
                  tracks: [
                    ...release.tracks,
                    { id: uid(), title, duration: "", writers: state.settings.artist, status: "draft" },
                  ],
                }
              : release,
          ),
        })),
      updateTrack: (releaseId, trackId, patch) =>
        set((state) => ({
          releases: state.releases.map((release) =>
            release.id === releaseId
              ? { ...release, tracks: replaceById(release.tracks, trackId, patch) }
              : release,
          ),
        })),
      removeTrack: (releaseId, trackId) =>
        set((state) => ({
          releases: state.releases.map((release) =>
            release.id === releaseId
              ? { ...release, tracks: release.tracks.filter((track) => track.id !== trackId) }
              : release,
          ),
        })),
      addSession: (session) => set((state) => ({ sessions: [{ ...session, id: uid() }, ...state.sessions] })),
      removeSession: (id) => set((state) => ({ sessions: state.sessions.filter((item) => item.id !== id) })),
      addRoyalty: (row) => set((state) => ({ royalties: [{ ...row, id: uid(), ledgerId: null }, ...state.royalties] })),
      removeRoyalty: (id) => set((state) => ({ royalties: state.royalties.filter((item) => item.id !== id) })),
      postRoyalty: (id) => {
        const row = get().royalties.find((item) => item.id === id);
        if (!row || row.ledgerId) return false;
        const txnId = uid();
        set((state) => ({
          txns: [
            {
              id: txnId,
              date: kampalaToday(),
              house: "music",
              kind: "in",
              category: "Royalty",
              amount: row.amount,
              currency: row.currency,
              note: `${row.source} ${row.period}`.trim(),
              certainty: row.certainty,
            },
            ...state.txns,
          ],
          royalties: state.royalties.map((item) => (item.id === id ? { ...item, ledgerId: txnId } : item)),
        }));
        return true;
      },
      replaceDesk: (data) => set({ ...data, composer: null, focusId: null }),
      addCustomer: (customer) => {
        const id = uid();
        set((state) => ({ customers: [{ ...customer, id }, ...state.customers] }));
        return id;
      },
      updateCustomer: (id, patch) => set((state) => ({ customers: replaceById(state.customers, id, patch) })),
      removeCustomer: (id) => {
        if (get().orders.some((order) => order.customerId === id) || get().quotes.some((quote) => quote.customerId === id)) {
          get().flashMsg("This customer still has jobs or quotes.");
          return;
        }
        set((state) => ({ customers: state.customers.filter((item) => item.id !== id) }));
      },
      addOrder: (order) =>
        set((state) => ({
          orders: [
            {
              ...order,
              id: uid(),
              number: nextCode(
                state.orders.map((item) => item.number),
                "CB",
                1001,
              ),
            },
            ...state.orders,
          ],
          composer: null,
        })),
      updateOrder: (id, patch) => set((state) => ({ orders: replaceById(state.orders, id, patch) })),
      removeOrders: (ids) => set((state) => ({ orders: state.orders.filter((order) => !ids.includes(order.id)) })),
      addInventory: (item) => set((state) => ({ inventory: [...state.inventory, { ...item, id: uid() }] })),
      adjustInventory: (id, onHand) =>
        set((state) => ({
          inventory: state.inventory.map((item) =>
            item.id === id ? { ...item, onHand: Math.max(0, Math.round(onHand)) } : item,
          ),
        })),
      removeInventory: (id) => set((state) => ({ inventory: state.inventory.filter((item) => item.id !== id) })),
      addQuote: (quote) => set((state) => ({ quotes: [{ ...quote, id: uid() }, ...state.quotes], composer: null })),
      updateQuote: (id, patch) => set((state) => ({ quotes: replaceById(state.quotes, id, patch) })),
      removeQuote: (id) => set((state) => ({ quotes: state.quotes.filter((item) => item.id !== id) })),
      convertQuote: (id) => {
        const quote = get().quotes.find((item) => item.id === id);
        if (!quote) return;
        get().addOrder({
          customerId: quote.customerId,
          garment: quote.summary,
          spec: quote.spec,
          qty: 1,
          due: null,
          stage: "approved",
          price: quote.amount,
          paid: 0,
          qc: "",
          notes: "Opened from a quote.",
          sample: quote.sample,
        });
        get().updateQuote(id, { status: "accepted" });
        get().flashMsg("Quote accepted and opened as a job.");
      },
      updateProject: (id, patch) => set((state) => ({ projects: replaceById(state.projects, id, patch) })),
      addBug: (bug) =>
        set((state) => ({ bugs: [{ ...bug, id: uid(), open: true }, ...state.bugs], composer: null })),
      updateBug: (id, patch) => set((state) => ({ bugs: replaceById(state.bugs, id, patch) })),
      removeBug: (id) => set((state) => ({ bugs: state.bugs.filter((item) => item.id !== id) })),
      addTechDecision: (row) => set((state) => ({ techDecisions: [{ ...row, id: uid() }, ...state.techDecisions] })),
      removeTechDecision: (id) =>
        set((state) => ({ techDecisions: state.techDecisions.filter((item) => item.id !== id) })),
      addDeploy: (row) => set((state) => ({ deploys: [{ ...row, id: uid() }, ...state.deploys] })),
      removeDeploy: (id) => set((state) => ({ deploys: state.deploys.filter((item) => item.id !== id) })),
      addTxn: (txn) => set((state) => ({ txns: [{ ...txn, id: uid() }, ...state.txns], composer: null })),
      removeTxns: (ids) => set((state) => ({ txns: state.txns.filter((txn) => !ids.includes(txn.id)) })),
      addTrade: (trade) => set((state) => ({ trades: [{ ...trade, id: uid() }, ...state.trades], composer: null })),
      removeTrade: (id) => set((state) => ({ trades: state.trades.filter((item) => item.id !== id) })),
      setPath: (id, patch) =>
        set((state) => ({
          paths: state.paths.map((path) =>
            path.id === id
              ? {
                  ...path,
                  ...patch,
                  progress:
                    patch.progress === undefined ? path.progress : Math.min(100, Math.max(0, Math.round(patch.progress))),
                }
              : path,
          ),
        })),
      answerExercise: (id, picked) => set((state) => ({ exercises: replaceById(state.exercises, id, { picked }) })),
      addNote: (note) =>
        set((state) => ({
          notes: [{ ...note, id: uid(), updated: kampalaToday() }, ...state.notes],
          composer: null,
        })),
      updateNote: (id, patch) =>
        set((state) => ({
          notes: replaceById(state.notes, id, { ...patch, updated: kampalaToday() }),
        })),
      removeNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
      addIdea: (idea) => set((state) => ({ ideas: [{ ...idea, id: uid() }, ...state.ideas], composer: null })),
      updateIdea: (id, patch) => set((state) => ({ ideas: replaceById(state.ideas, id, patch) })),
      removeIdea: (id) => set((state) => ({ ideas: state.ideas.filter((idea) => idea.id !== id) })),
      addCampaign: (campaign) =>
        set((state) => ({ campaigns: [{ ...campaign, id: uid() }, ...state.campaigns], composer: null })),
      updateCampaign: (id, patch) => set((state) => ({ campaigns: replaceById(state.campaigns, id, patch) })),
      removeCampaign: (id) => set((state) => ({ campaigns: state.campaigns.filter((item) => item.id !== id) })),
      addMemo: (memo) =>
        set((state) => ({
          memos: [...state.memos, { ...memo, id: uid(), at: memo.at ?? new Date().toISOString() }],
        })),
      clearMemos: () => set({ memos: [] }),
      canAsk: () => get().aiRemaining() > 0,
      noteAiUse: () =>
        set((state) => {
          const today = kampalaToday();
          const used = state.settings.aiDay === today ? state.settings.aiUsed : 0;
          return { settings: { ...state.settings, aiDay: today, aiUsed: used + 1 } };
        }),
      aiRemaining: () => {
        const settings = get().settings;
        const used = settings.aiDay === kampalaToday() ? settings.aiUsed : 0;
        return Math.max(0, settings.aiLimit - used);
      },
      clearSamples: () =>
        set((state) => {
          const orders = state.orders.filter((item) => !item.sample);
          const quotes = state.quotes.filter((item) => !item.sample);
          const kept = new Set([...orders.map((item) => item.customerId), ...quotes.map((item) => item.customerId)]);
          return {
            orders,
            quotes,
            customers: state.customers
              .filter((item) => !item.sample || kept.has(item.id))
              .map((item) => (item.sample && kept.has(item.id) ? { ...item, sample: false } : item)),
            flash: "Sample shop records removed.",
          };
        }),
      resetDesk: () => set({ ...seed(), flash: "Desk restored to the opening records.", composer: null, focusId: null }),
    }),
    {
      name: "camos-desk-v1",
      version: 1,
      skipHydration: true,
      partialize: (state) => {
        const data = {} as DeskData;
        for (const key of DATA_KEYS) {
          data[key] = state[key] as never;
        }
        return data as Store;
      },
      merge: (persisted, current) => {
        const incoming = (persisted ?? {}) as Partial<DeskData>;
        return {
          ...current,
          ...incoming,
          settings: { ...current.settings, ...(incoming.settings ?? {}) },
        };
      },
    },
  ),
);

export function hydrateDesk(): void {
  void useDesk.persist.rehydrate();
}
