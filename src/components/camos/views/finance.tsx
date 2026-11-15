import { useMemo, useState } from "react";
import { cashPosition, netsByMonth, projectedPosition } from "@/lib/camos/calc";
import { formatDay, formatMoney } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { HOUSE_LABEL, type Certainty, type Currency, type House } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { LedgerChart } from "@/components/camos/chart";
import { Button, DataTable, Field, Input, Page, Panel, Select, Stamp } from "@/components/camos/ui";

const HOUSES = Object.keys(HOUSE_LABEL) as House[];

export function FinanceView() {
  const txns = useDesk((state) => state.txns);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const removeTxns = useDesk((state) => state.removeTxns);
  const [currency, setCurrency] = useState<Currency>("UGX");
  const [selected, setSelected] = useState<string[]>([]);
  const rows = txns.filter((txn) => txn.currency === currency);
  const months = useMemo(() => netsByMonth(txns, currency), [txns, currency]);
  const actual = cashPosition(txns, currency);
  const projected = projectedPosition(txns, currency);

  return (
    <Page mark="double">
      <header className="mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Ledger</p>
          <h1 className="mt-1 font-display text-3xl font-medium leading-tight">{currency} book</h1>
        </div>
        <Button variant="primary" onClick={() => openComposer("txn")}>
          New entry
        </Button>
      </header>
      <div className="mb-6 flex gap-2">
        {(["UGX", "USD"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCurrency(item)}
            className={cn("min-h-11 border px-4 text-sm font-semibold", currency === item ? "border-ink bg-ink text-paper" : "border-line")}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-6 border-y border-ink py-4 md:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Actual</p>
          <p className="font-display text-4xl tabular-nums">{formatMoney(actual, currency)}</p>
          <p className="mt-1 text-sm text-muted">Money that has moved. Shillings and dollars are never added.</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brass">Projected</p>
          <p className="font-display text-4xl tabular-nums">{formatMoney(projected, currency)}</p>
          <p className="mt-1 text-sm text-muted">A labeled guess. Not included in actual.</p>
        </div>
      </div>
      <div className="mt-8">
        {months.length === 0 ? (
          <p className="text-sm text-muted">No {currency} entries, so there is no chart. A chart of nothing would be decoration.</p>
        ) : (
          <LedgerChart rows={months} currency={currency} />
        )}
      </div>
      <div className="mt-8">
        {selected.length ? (
          <div className="mb-3">
            <Button
              variant="danger"
              onClick={() => {
                removeTxns(selected);
                setSelected([]);
              }}
            >
              Delete selected
            </Button>
          </div>
        ) : null}
        <DataTable
          rows={rows}
          selectable
          selected={selected}
          onSelected={setSelected}
          searchText={(txn) => `${txn.category} ${txn.note} ${txn.house}`}
          empty={{ title: `No ${currency} entries.`, body: "Add an actual amount you can point to, or a projection you have labeled as one." }}
          columns={[
            { id: "date", header: "Date", sortValue: (txn) => txn.date, cell: (txn) => formatDay(txn.date) },
            { id: "category", header: "Category", sortValue: (txn) => txn.category, cell: (txn) => txn.category },
            { id: "house", header: "House", optional: true, sortValue: (txn) => txn.house, cell: (txn) => HOUSE_LABEL[txn.house] },
            {
              id: "kind",
              header: "Kind",
              cell: (txn) => <Stamp tone={txn.certainty === "projected" ? "brass" : "neutral"}>{txn.certainty === "actual" ? txn.kind : `Projected ${txn.kind}`}</Stamp>,
            },
            {
              id: "amount",
              header: "Amount",
              align: "right",
              sortValue: (txn) => txn.amount,
              cell: (txn) => (
                <span className={txn.kind === "out" ? "text-rust" : undefined}>
                  {txn.kind === "out" ? "−" : ""}
                  {formatMoney(txn.amount, txn.currency)}
                </span>
              ),
            },
          ]}
        />
      </div>
      <TxnPanel open={composer === "txn"} onClose={closeComposer} currency={currency} />
    </Page>
  );
}

function TxnPanel({ open, onClose, currency }: { open: boolean; onClose: () => void; currency: Currency }) {
  const addTxn = useDesk((state) => state.addTxn);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [date, setDate] = useState("");
  const [house, setHouse] = useState<House>("brand");
  const [kind, setKind] = useState<"in" | "out">("out");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [certainty, setCertainty] = useState<Certainty>("actual");
  const [book, setBook] = useState<Currency>(currency);
  const [error, setError] = useState("");

  return (
    <Panel open={open} title="Ledger entry" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Date (required)" error={error}>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="Category">
          <Input value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Thread, royalty, transport" />
        </Field>
        <Field label="Amount">
          <Input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} />
        </Field>
        <Field label="Currency">
          <Select value={book} onChange={(event) => setBook(event.target.value as Currency)}>
            <option value="UGX">UGX</option>
            <option value="USD">USD</option>
          </Select>
        </Field>
        <Field label="Direction">
          <Select value={kind} onChange={(event) => setKind(event.target.value as "in" | "out")}>
            <option value="in">Money in</option>
            <option value="out">Money out</option>
          </Select>
        </Field>
        <Field label="Certainty" hint="Actual means it happened. Projected means it has not.">
          <Select value={certainty} onChange={(event) => setCertainty(event.target.value as Certainty)}>
            <option value="actual">Actual</option>
            <option value="projected">Projected</option>
          </Select>
        </Field>
        <Field label="House">
          <Select value={house} onChange={(event) => setHouse(event.target.value as House)}>
            {HOUSES.map((item) => (
              <option key={item} value={item}>
                {HOUSE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Note">
          <Input value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            const value = Number(amount.replace(/,/g, ""));
            if (!date || category.trim().length < 2 || !Number.isFinite(value) || value < 0) {
              setError("Date, category, and a real amount are required.");
              return;
            }
            addTxn({
              date,
              house,
              kind,
              category: category.trim(),
              amount: Math.round(value * 100) / 100,
              currency: book,
              note: note.trim(),
              certainty,
            });
            setAmount("");
            setCategory("");
            setNote("");
            setError("");
            flashMsg("Entry saved in the " + book + " book.");
            onClose();
          }}
        >
          Save entry
        </Button>
      </div>
    </Panel>
  );
}
