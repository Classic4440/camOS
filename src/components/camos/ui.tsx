import { useEffect, useMemo, useState, type ReactNode } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDesk } from "@/lib/camos/store";
import { formatMoney } from "@/lib/camos/format";
import type { Currency } from "@/lib/camos/types";

export function Page({
  children,
  width = "desk",
  mark,
}: {
  children: ReactNode;
  width?: "desk" | "read";
  mark?: "brass" | "double" | "dashed";
}) {
  const density = useDesk((state) => state.settings.density);
  return (
    <div
      className={cn(
        "mx-auto w-full",
        width === "read" ? "max-w-3xl" : "max-w-6xl",
        density === "compact" ? "px-3 py-4" : "px-4 py-6 md:px-8 md:py-8",
      )}
    >
      {mark === "brass" ? <div className="mb-6 h-0.5 bg-brass" /> : null}
      {mark === "double" ? (
        <div className="mb-6 space-y-1" aria-hidden>
          <div className="h-px bg-ink" />
          <div className="h-px bg-ink" />
        </div>
      ) : null}
      {mark === "dashed" ? <div className="mb-6 border-t border-dashed border-ink" /> : null}
      {children}
    </div>
  );
}

export function PageHead({
  kicker,
  title,
  lede,
  actions,
}: {
  kicker: string;
  title: string;
  lede?: string;
  actions?: ReactNode;
}) {
  return (
    <header className="mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">{kicker}</p>
        <h1 className="mt-1 font-display text-3xl font-medium leading-tight">{title}</h1>
        {lede ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{lede}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}

export function Button({
  variant = "line",
  className,
  type = "button",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "line" | "ghost" | "danger" }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm font-semibold transition-opacity disabled:opacity-40",
        variant === "primary" && "bg-ink text-paper hover:opacity-90",
        variant === "line" && "border border-line bg-elevated text-ink hover:border-ink",
        variant === "ghost" && "bg-transparent text-ink hover:bg-surface",
        variant === "danger" && "border border-rust text-rust hover:bg-surface",
        className,
      )}
      {...props}
    />
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-semibold">{label}</span>
      {children}
      {error ? (
        <span className="mt-1 block text-sm text-rust" role="alert">
          {error}
        </span>
      ) : hint ? (
        <span className="mt-1 block text-sm text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

const control =
  "min-h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-ink placeholder:text-faint";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(control, props.className)} />;
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn(control, "min-h-28 py-2 leading-relaxed", props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn(control, props.className)} />;
}

export function Stamp({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "moss" | "rust" | "brass" | "accent";
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide",
        tone === "neutral" && "border-line text-muted",
        tone === "moss" && "border-moss text-moss",
        tone === "rust" && "border-rust text-rust",
        tone === "brass" && "border-brass text-brass",
        tone === "accent" && "border-accent text-accent",
      )}
    >
      {children}
    </span>
  );
}

export function Empty({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="border border-dashed border-line px-4 py-8">
      <p className="font-display text-xl">{title}</p>
      <p className="mt-2 max-w-prose text-sm leading-relaxed text-muted">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

export function Money({ value, currency }: { value: number; currency: Currency }) {
  return <span className="tabular-nums">{formatMoney(value, currency)}</span>;
}

export function Panel({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={(next) => !next && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40" style={{ background: "var(--scrim)" }} />
        <Dialog.Content className="panel-in fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-elevated">
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <Dialog.Title className="font-display text-xl">{title}</Dialog.Title>
            <Dialog.Close asChild>
              <button type="button" className="inline-flex size-11 items-center justify-center" aria-label="Close">
                <X className="size-4" strokeWidth={1.75} />
              </button>
            </Dialog.Close>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">{children}</div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function StageRail({
  stages,
  current,
  counts,
  onPick,
}: {
  stages: { id: string; label: string }[];
  current?: string;
  counts?: Record<string, number>;
  onPick?: (id: string) => void;
}) {
  return (
    <ol className="mb-6 flex overflow-x-auto border border-line">
      {stages.map((stage, index) => {
        const active = current === stage.id;
        return (
          <li key={stage.id} className="min-w-28 flex-1 border-r border-line last:border-r-0">
            <button
              type="button"
              onClick={() => onPick?.(stage.id)}
              className={cn(
                "flex min-h-16 w-full flex-col items-start justify-center px-3 text-left",
                active ? "bg-ink text-paper" : "bg-elevated text-ink hover:bg-surface",
              )}
            >
              <span className={cn("text-xs font-semibold uppercase tracking-widest", active ? "text-paper" : "text-faint")}>
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold">{stage.label}</span>
              {counts ? <span className="text-xs tabular-nums">{counts[stage.id] ?? 0}</span> : null}
            </button>
          </li>
        );
      })}
    </ol>
  );
}

export type Column<T> = {
  id: string;
  header: string;
  align?: "left" | "right";
  optional?: boolean;
  sortValue?: (row: T) => string | number;
  cell: (row: T) => ReactNode;
};

export function DataTable<T extends { id: string }>({
  rows,
  columns,
  searchText,
  pageSize = 8,
  selectable = false,
  selected = [],
  onSelected,
  onRow,
  activeId,
  empty,
}: {
  rows: T[];
  columns: Column<T>[];
  searchText: (row: T) => string;
  pageSize?: number;
  selectable?: boolean;
  selected?: string[];
  onSelected?: (ids: string[]) => void;
  onRow?: (row: T) => void;
  activeId?: string | null;
  empty: { title: string; body: string };
}) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ id: string; dir: "asc" | "desc" } | null>(null);
  const [page, setPage] = useState(0);
  const [hidden, setHidden] = useState<string[]>([]);

  const visible = columns.filter((column) => !hidden.includes(column.id));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const next = q ? rows.filter((row) => searchText(row).toLowerCase().includes(q)) : rows;
    if (!sort) return next;
    const column = columns.find((item) => item.id === sort.id);
    if (!column?.sortValue) return next;
    const copy = [...next];
    copy.sort((a, b) => {
      const av = column.sortValue?.(a) ?? "";
      const bv = column.sortValue?.(b) ?? "";
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [rows, query, sort, columns, searchText]);

  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);
  const allOnPage = slice.length > 0 && slice.every((row) => selected.includes(row.id));

  useEffect(() => {
    setPage(0);
  }, [query, rows.length]);

  function toggleSort(id: string) {
    const column = columns.find((item) => item.id === id);
    if (!column?.sortValue) return;
    setSort((current) => {
      if (current?.id !== id) return { id, dir: "asc" };
      if (current.dir === "asc") return { id, dir: "desc" };
      return null;
    });
  }

  function toggle(id: string) {
    if (!onSelected) return;
    onSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
  }

  return (
    <div>
      <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Filter this list"
          aria-label="Filter this list"
          className="sm:max-w-xs"
        />
        {columns.some((column) => column.optional) ? (
          <details className="text-sm">
            <summary className="inline-flex min-h-11 cursor-pointer list-none items-center border border-line bg-elevated px-3 font-semibold">
              Columns
            </summary>
            <div className="mt-1 border border-line bg-elevated p-2">
              {columns
                .filter((column) => column.optional)
                .map((column) => (
                  <label key={column.id} className="flex min-h-11 items-center gap-2 px-1">
                    <input
                      className="tick"
                      type="checkbox"
                      checked={!hidden.includes(column.id)}
                      onChange={() =>
                        setHidden((current) =>
                          current.includes(column.id) ? current.filter((id) => id !== column.id) : [...current, column.id],
                        )
                      }
                    />
                    {column.header}
                  </label>
                ))}
            </div>
          </details>
        ) : null}
      </div>

      {slice.length === 0 ? (
        <Empty title={empty.title} body={query ? "Nothing matches that filter." : empty.body} />
      ) : (
        <>
          <ul className="divide-y divide-line border border-line md:hidden">
            {slice.map((row) => (
              <li key={row.id} className={cn("bg-elevated", activeId === row.id && "border-l-2 border-l-brass")}>
                <div className="flex items-start">
                  {selectable ? (
                    <label className="inline-flex min-h-11 min-w-11 items-center justify-center">
                      <input
                        className="tick"
                        type="checkbox"
                        checked={selected.includes(row.id)}
                        onChange={() => toggle(row.id)}
                        aria-label={`Select ${visible[0] ? "row" : "row"}`}
                      />
                    </label>
                  ) : null}
                  <button type="button" className="min-w-0 flex-1 px-3 py-3 text-left" onClick={() => onRow?.(row)}>
                    <div className="font-semibold">{visible[0]?.cell(row)}</div>
                    <dl className="mt-2 space-y-1">
                      {visible.slice(1).map((column) => (
                        <div key={column.id} className="flex justify-between gap-3 text-sm">
                          <dt className="text-muted">{column.header}</dt>
                          <dd className={cn("text-right", column.align === "right" && "tabular-nums")}>{column.cell(row)}</dd>
                        </div>
                      ))}
                    </dl>
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="hidden overflow-x-auto border border-line md:block">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-line bg-surface text-left">
                  {selectable ? (
                    <th className="w-12 px-1">
                      <label className="inline-flex min-h-11 min-w-11 items-center justify-center">
                        <input
                          className="tick"
                          type="checkbox"
                          checked={allOnPage}
                          onChange={() => {
                            if (!onSelected) return;
                            if (allOnPage) onSelected(selected.filter((id) => !slice.some((row) => row.id === id)));
                            else onSelected([...new Set([...selected, ...slice.map((row) => row.id)])]);
                          }}
                          aria-label="Select rows on this page"
                        />
                      </label>
                    </th>
                  ) : null}
                  {visible.map((column) => {
                    const active = sort?.id === column.id;
                    return (
                      <th
                        key={column.id}
                        aria-sort={active ? (sort?.dir === "asc" ? "ascending" : "descending") : "none"}
                        className={cn("px-3 py-2 font-semibold", column.align === "right" && "text-right")}
                      >
                        {column.sortValue ? (
                          <button
                            type="button"
                            className="inline-flex min-h-11 items-center gap-1"
                            onClick={() => toggleSort(column.id)}
                          >
                            {column.header}
                            {active ? (
                              sort?.dir === "asc" ? (
                                <ArrowUp className="size-3.5" aria-hidden />
                              ) : (
                                <ArrowDown className="size-3.5" aria-hidden />
                              )
                            ) : null}
                          </button>
                        ) : (
                          column.header
                        )}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {slice.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => onRow?.(row)}
                    className={cn(
                      "border-b border-line last:border-b-0",
                      onRow && "cursor-pointer",
                      activeId === row.id ? "bg-surface" : "bg-elevated hover:bg-surface",
                    )}
                  >
                    {selectable ? (
                      <td className="px-1">
                        <label className="inline-flex min-h-11 min-w-11 items-center justify-center" onClick={(event) => event.stopPropagation()}>
                          <input
                            className="tick"
                            type="checkbox"
                            checked={selected.includes(row.id)}
                            onChange={() => toggle(row.id)}
                            aria-label="Select row"
                          />
                        </label>
                      </td>
                    ) : null}
                    {visible.map((column, index) => (
                      <td
                        key={column.id}
                        className={cn(
                          "px-3 py-2 align-middle",
                          column.align === "right" && "text-right tabular-nums",
                          index === 0 && "font-semibold",
                        )}
                      >
                        {column.cell(row)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="mt-3 flex items-center justify-between text-sm text-muted">
        <p className="tabular-nums">
          {filtered.length} {filtered.length === 1 ? "record" : "records"}
        </p>
        <div className="flex items-center gap-1">
          <Button variant="ghost" aria-label="Previous page" disabled={safePage === 0} onClick={() => setPage(safePage - 1)}>
            <ChevronLeft className="size-4" />
          </Button>
          <span className="tabular-nums">
            {safePage + 1} / {pages}
          </span>
          <Button
            variant="ghost"
            aria-label="Next page"
            disabled={safePage >= pages - 1}
            onClick={() => setPage(safePage + 1)}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function useWarnUnsaved(dirty: boolean) {
  useEffect(() => {
    if (!dirty) return;
    const onBefore = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", onBefore);
    return () => window.removeEventListener("beforeunload", onBefore);
  }, [dirty]);
}

export function parseAmount(value: string): number | null {
  const number = Number(value.trim().replace(/,/g, ""));
  if (!Number.isFinite(number) || number < 0) return null;
  return Math.round(number * 100) / 100;
}
