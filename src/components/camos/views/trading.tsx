import { useState } from "react";
import { positionSize, tradePnl } from "@/lib/camos/calc";
import { formatDay, formatMoney, kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { Button, DataTable, Field, Input, Page, PageHead, Panel, Select, Textarea } from "@/components/camos/ui";

export function TradingView() {
  const trades = useDesk((state) => state.trades);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const removeTrade = useDesk((state) => state.removeTrade);
  const [account, setAccount] = useState("1000");
  const [risk, setRisk] = useState("1");
  const [stop, setStop] = useState("");
  const size = positionSize(Number(account), Number(risk), Number(stop));
  const closed = trades.map((trade) => tradePnl(trade)).filter((value): value is number => value !== null);
  const pnl = closed.reduce((sum, value) => sum + value, 0);

  return (
    <Page>
      <PageHead
        kicker="Records · Trading"
        title="A journal and a risk sum."
        lede="Record the trade you took. Size is account × risk, divided by the stop. No stop, no size."
        actions={
          <Button variant="primary" onClick={() => openComposer("trade")}>
            Log a trade
          </Button>
        }
      />
      <section className="grid gap-8 border-y border-line py-6 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="font-display text-2xl">Position size</h2>
          <p className="mt-1 text-sm text-muted">Risk amount = account × risk percent. Size = risk amount ÷ stop distance. If the stop is missing, there is no size.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <Field label="Account (USD)">
              <Input value={account} inputMode="decimal" onChange={(event) => setAccount(event.target.value)} />
            </Field>
            <Field label="Risk %">
              <Input value={risk} inputMode="decimal" onChange={(event) => setRisk(event.target.value)} />
            </Field>
            <Field label="Stop distance">
              <Input value={stop} inputMode="decimal" onChange={(event) => setStop(event.target.value)} />
            </Field>
          </div>
        </div>
        <div className="lg:col-span-5 border-t border-ink pt-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Size</p>
          <p className="font-display text-4xl tabular-nums">{size === null ? "—" : size}</p>
          <p className="mt-2 text-sm text-muted">
            {size === null ? "Enter a stop greater than zero." : `Risking ${formatMoney((Number(account) * Number(risk)) / 100, "USD")} if the stop is hit.`}
          </p>
          <p className="mt-4 text-sm">
            Closed journal P&L <span className="tabular-nums font-semibold">{formatMoney(pnl, "USD")}</span>
          </p>
        </div>
      </section>
      <div className="mt-8">
        <DataTable
          rows={trades}
          searchText={(trade) => `${trade.instrument} ${trade.thesis} ${trade.lesson}`}
          empty={{ title: "The journal is empty.", body: "Log a trade after it exists. A blank journal is better than a fictional one." }}
          columns={[
            { id: "date", header: "Date", sortValue: (trade) => trade.date, cell: (trade) => formatDay(trade.date) },
            { id: "instrument", header: "Instrument", sortValue: (trade) => trade.instrument, cell: (trade) => trade.instrument },
            { id: "side", header: "Side", cell: (trade) => trade.side },
            {
              id: "pnl",
              header: "P&L",
              align: "right",
              sortValue: (trade) => tradePnl(trade) ?? 0,
              cell: (trade) => {
                const value = tradePnl(trade);
                if (value === null) return "Open";
                return <span className={value < 0 ? "text-rust" : "text-moss"}>{formatMoney(value, "USD")}</span>;
              },
            },
            {
              id: "act",
              header: "",
              cell: (trade) => (
                <button type="button" className="min-h-11 text-sm text-rust" onClick={() => removeTrade(trade.id)}>
                  Remove
                </button>
              ),
            },
          ]}
        />
      </div>
      <TradePanel open={composer === "trade"} onClose={closeComposer} />
    </Page>
  );
}

function TradePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTrade = useDesk((state) => state.addTrade);
  const [date, setDate] = useState(kampalaToday());
  const [instrument, setInstrument] = useState("");
  const [side, setSide] = useState<"long" | "short">("long");
  const [entry, setEntry] = useState("");
  const [exit, setExit] = useState("");
  const [size, setSize] = useState("");
  const [thesis, setThesis] = useState("");
  const [lesson, setLesson] = useState("");
  const [error, setError] = useState("");

  return (
    <Panel open={open} title="Trade journal" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Date" error={error}>
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="Instrument">
          <Input value={instrument} onChange={(event) => setInstrument(event.target.value)} />
        </Field>
        <Field label="Side">
          <Select value={side} onChange={(event) => setSide(event.target.value as "long" | "short")}>
            <option value="long">Long</option>
            <option value="short">Short</option>
          </Select>
        </Field>
        <Field label="Entry">
          <Input value={entry} inputMode="decimal" onChange={(event) => setEntry(event.target.value)} />
        </Field>
        <Field label="Exit" hint="Leave blank if the trade is still open.">
          <Input value={exit} inputMode="decimal" onChange={(event) => setExit(event.target.value)} />
        </Field>
        <Field label="Size">
          <Input value={size} inputMode="decimal" onChange={(event) => setSize(event.target.value)} />
        </Field>
        <Field label="Thesis">
          <Textarea value={thesis} onChange={(event) => setThesis(event.target.value)} />
        </Field>
        <Field label="Lesson">
          <Textarea value={lesson} onChange={(event) => setLesson(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            const entryN = Number(entry);
            const sizeN = Number(size);
            const exitN = exit.trim() === "" ? null : Number(exit);
            if (instrument.trim().length < 1 || !(entryN > 0) || !(sizeN > 0) || (exitN !== null && !Number.isFinite(exitN))) {
              setError("Instrument, entry, and size are required.");
              return;
            }
            addTrade({
              date,
              instrument: instrument.trim(),
              side,
              entry: entryN,
              exit: exitN,
              size: sizeN,
              thesis: thesis.trim(),
              lesson: lesson.trim(),
            });
            setInstrument("");
            setEntry("");
            setExit("");
            setSize("");
            setThesis("");
            setLesson("");
            setError("");
            onClose();
          }}
        >
          Save trade
        </Button>
      </div>
    </Panel>
  );
}
