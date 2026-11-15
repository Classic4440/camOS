import { useEffect, useState } from "react";
import { customerBalance, owed } from "@/lib/camos/calc";
import { formatDay, formatMoney, kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { ORDER_STAGE_LABEL, ORDER_STAGES, type OrderStage, type QuoteStatus } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import {
  Button,
  DataTable,
  Empty,
  Field,
  Input,
  Page,
  Panel,
  Select,
  Stamp,
  Textarea,
  parseAmount,
} from "@/components/camos/ui";

type Tab = "queue" | "customers" | "stock" | "quotes";

export function BrandView() {
  const settings = useDesk((state) => state.settings);
  const orders = useDesk((state) => state.orders);
  const customers = useDesk((state) => state.customers);
  const inventory = useDesk((state) => state.inventory);
  const quotes = useDesk((state) => state.quotes);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const updateOrder = useDesk((state) => state.updateOrder);
  const removeOrders = useDesk((state) => state.removeOrders);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [tab, setTab] = useState<Tab>("queue");
  const [stage, setStage] = useState<OrderStage | "all">("all");
  const [activeId, setActiveId] = useState<string | null>(orders[0]?.id ?? null);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (composer === "order" || composer === "quote") setTab(composer === "quote" ? "quotes" : "queue");
  }, [composer]);

  useEffect(() => {
    if (!focusId) return;
    if (orders.some((order) => order.id === focusId)) {
      setTab("queue");
      setActiveId(focusId);
      setFocus(null);
    } else if (customers.some((customer) => customer.id === focusId)) {
      setTab("customers");
      setFocus(null);
    }
  }, [focusId, orders, customers, setFocus]);

  const counts = Object.fromEntries(ORDER_STAGES.map((item) => [item, orders.filter((order) => order.stage === item).length]));
  const onBoard = orders.filter((order) => order.stage !== "delivered").length;
  const liveJobs = orders.filter((order) => !order.sample && order.stage !== "delivered").length;
  const sampleJobs = orders.filter((order) => order.sample && order.stage !== "delivered").length;
  const rows = orders.filter((order) => stage === "all" || order.stage === stage);
  const active = orders.find((order) => order.id === activeId) ?? null;
  const nameOf = (id: string) => customers.find((customer) => customer.id === id)?.name ?? "Unknown customer";

  return (
    <Page>
      <header className="mb-6 grid gap-4 border-b-2 border-ink pb-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Production floor · Matugga</p>
          <h1 className="mt-1 font-display text-3xl font-medium leading-tight">{settings.shop}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">{settings.shopLocation}. Embroidery, heat transfer, jerseys, names and numbers.</p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <p className="font-display text-4xl tabular-nums leading-none">{onBoard}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-faint">
              {sampleJobs ? `${liveJobs} live · ${sampleJobs} sample` : "Live jobs"}
            </p>
          </div>
          <Button variant="primary" onClick={() => openComposer("order")}>
            New job
          </Button>
          <Button onClick={() => openComposer("quote")}>New quote</Button>
        </div>
      </header>
      <nav aria-label="Classic Brand sections" className="mb-6 flex gap-1 overflow-x-auto border-b border-line">
        {(
          [
            ["queue", "Queue", orders.filter((order) => order.stage !== "delivered").length],
            ["customers", "Customers", customers.length],
            ["stock", "Floor", inventory.length],
            ["quotes", "Quotes", quotes.length],
          ] as const
        ).map(([id, label, count]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold",
              tab === id ? "border-ink text-ink" : "border-transparent text-muted",
            )}
          >
            {label}
            <span className="tabular-nums text-faint">{count}</span>
          </button>
        ))}
      </nav>

      {tab === "queue" ? (
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ol className="mb-4 flex overflow-x-auto border border-line">
              <li className="min-w-24 flex-1">
                <StageButton label="All" count={orders.length} active={stage === "all"} onClick={() => setStage("all")} />
              </li>
              {ORDER_STAGES.map((item) => (
                <li key={item} className="min-w-24 flex-1 border-l border-line">
                  <StageButton
                    label={ORDER_STAGE_LABEL[item]}
                    count={counts[item] ?? 0}
                    active={stage === item}
                    onClick={() => setStage(item)}
                  />
                </li>
              ))}
            </ol>
            {selected.length ? (
              <div className="mb-3 flex flex-wrap gap-2 border border-line bg-surface px-3 py-2">
                <span className="self-center text-sm tabular-nums">{selected.length} selected</span>
                <Button
                  variant="ghost"
                  onClick={() => {
                    for (const id of selected) updateOrder(id, { stage: "delivered" });
                    setSelected([]);
                    flashMsg("Marked delivered.");
                  }}
                >
                  Mark delivered
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    removeOrders(selected);
                    setSelected([]);
                    flashMsg("Jobs removed.");
                  }}
                >
                  Delete
                </Button>
              </div>
            ) : null}
            <DataTable
              rows={rows}
              selectable
              selected={selected}
              onSelected={setSelected}
              activeId={activeId}
              onRow={(order) => setActiveId(order.id)}
              searchText={(order) => `${order.number} ${order.garment} ${order.spec} ${nameOf(order.customerId)}`}
              empty={{ title: "No jobs in this stage.", body: "Add a live job, or clear the sample records from Settings." }}
              columns={[
                {
                  id: "number",
                  header: "Job",
                  sortValue: (order) => order.number,
                  cell: (order) => (
                    <span>
                      {order.number}
                      {order.sample ? <Stamp>Sample</Stamp> : null}
                    </span>
                  ),
                },
                { id: "garment", header: "Garment", optional: true, sortValue: (order) => order.garment, cell: (order) => order.garment },
                { id: "stage", header: "Stage", sortValue: (order) => order.stage, cell: (order) => ORDER_STAGE_LABEL[order.stage] },
                {
                  id: "due",
                  header: "Due",
                  align: "right",
                  sortValue: (order) => order.due ?? "9999",
                  cell: (order) => (
                    <span className={!order.sample && order.due && order.due < kampalaToday() && order.stage !== "delivered" ? "text-rust" : undefined}>
                      {formatDay(order.due)}
                    </span>
                  ),
                },
                {
                  id: "owed",
                  header: "Owed",
                  align: "right",
                  sortValue: (order) => owed(order),
                  cell: (order) => formatMoney(owed(order), "UGX"),
                },
              ]}
            />
          </div>
          <div className="lg:col-span-5">{active ? <Ticket orderId={active.id} /> : <Empty title="No job selected." body="Choose a row to open its ticket." />}</div>
        </div>
      ) : null}

      {tab === "customers" ? <Customers /> : null}
      {tab === "stock" ? (
        <Floor inventory={inventory} services={settings.services} location={settings.shopLocation} />
      ) : null}
      {tab === "quotes" ? <Quotes /> : null}
      <OrderPanel open={composer === "order"} onClose={closeComposer} />
      <QuotePanel open={composer === "quote"} onClose={closeComposer} />
    </Page>
  );
}

function StageButton({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={cn("flex min-h-16 w-full flex-col items-start px-3", active ? "bg-ink text-paper" : "bg-elevated")}>
      <span className="text-sm font-semibold">{label}</span>
      <span className="text-xs tabular-nums">{count}</span>
    </button>
  );
}

function Ticket({ orderId }: { orderId: string }) {
  const order = useDesk((state) => state.orders.find((item) => item.id === orderId));
  const customers = useDesk((state) => state.customers);
  const updateOrder = useDesk((state) => state.updateOrder);
  const removeOrders = useDesk((state) => state.removeOrders);
  const flashMsg = useDesk((state) => state.flashMsg);
  if (!order) return null;
  const customer = customers.find((item) => item.id === order.customerId);
  return (
    <article className="border border-line bg-elevated">
      <header className="border-b border-dashed border-line px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-faint">Classic Brand · Job ticket</p>
        <div className="mt-1 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-2xl">{order.number}</p>
            <p className="text-sm text-muted">{customer?.name ?? "No customer"}</p>
          </div>
          {order.sample ? <Stamp tone="brass">Sample</Stamp> : <Stamp tone="moss">Live</Stamp>}
        </div>
      </header>
      <div className="space-y-3 px-4 py-4 text-sm">
        <p className="font-semibold">{order.garment}</p>
        <p className="text-muted">{order.spec}</p>
        <dl className="grid grid-cols-2 gap-y-2 border-t border-line pt-3">
          <dt className="text-muted">Quantity</dt>
          <dd className="text-right tabular-nums">{order.qty}</dd>
          <dt className="text-muted">Price</dt>
          <dd className="text-right tabular-nums">{formatMoney(order.price, "UGX")}</dd>
          <dt className="text-muted">Paid</dt>
          <dd className="text-right tabular-nums">{formatMoney(order.paid, "UGX")}</dd>
          <dt className="text-muted">Owed</dt>
          <dd className="text-right font-semibold tabular-nums">{formatMoney(owed(order), "UGX")}</dd>
        </dl>
        <Field label="Stage">
          <Select value={order.stage} onChange={(event) => updateOrder(order.id, { stage: event.target.value as OrderStage })}>
            {ORDER_STAGES.map((item) => (
              <option key={item} value={item}>
                {ORDER_STAGE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Quality notes">
          <Textarea value={order.qc} onChange={(event) => updateOrder(order.id, { qc: event.target.value })} />
        </Field>
        <Field label="Payment received (UGX)">
          <Input
            inputMode="decimal"
            defaultValue={String(order.paid)}
            key={order.paid}
            onBlur={(event) => {
              const value = parseAmount(event.target.value);
              if (value === null) {
                flashMsg("Payment must be a number.");
                return;
              }
              updateOrder(order.id, { paid: value });
            }}
          />
        </Field>
        {order.sample ? (
          <div className="flex flex-wrap gap-2 border-t border-dashed border-line pt-3">
            <Button onClick={() => updateOrder(order.id, { sample: false })}>Keep as a real job</Button>
            <Button variant="danger" onClick={() => removeOrders([order.id])}>
              Delete sample
            </Button>
          </div>
        ) : (
          <Button variant="danger" onClick={() => removeOrders([order.id])}>
            Delete job
          </Button>
        )}
      </div>
    </article>
  );
}

function Customers() {
  const customers = useDesk((state) => state.customers);
  const orders = useDesk((state) => state.orders);
  const addCustomer = useDesk((state) => state.addCustomer);
  const removeCustomer = useDesk((state) => state.removeCustomer);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  return (
    <div>
      <DataTable
        rows={customers}
        searchText={(customer) => `${customer.name} ${customer.phone} ${customer.note}`}
        empty={{ title: "No customers yet.", body: "Add a person when there is a real order. Do not invent one." }}
        columns={[
          {
            id: "name",
            header: "Customer",
            sortValue: (customer) => customer.name,
            cell: (customer) => (
              <span>
                {customer.name} {customer.sample ? <Stamp>Sample</Stamp> : null}
              </span>
            ),
          },
          { id: "phone", header: "Phone", optional: true, cell: (customer) => customer.phone || "—" },
          {
            id: "balance",
            header: "Balance",
            align: "right",
            sortValue: (customer) => customerBalance(customer, orders),
            cell: (customer) => {
              const balance = customerBalance(customer, orders);
              return (
                <span className={balance > 0 ? "text-rust" : undefined}>
                  {balance < 0 ? `Credit ${formatMoney(Math.abs(balance), "UGX")}` : formatMoney(balance, "UGX")}
                </span>
              );
            },
          },
          {
            id: "act",
            header: "",
            cell: (customer) => (
              <button type="button" className="min-h-11 text-sm text-rust" onClick={() => removeCustomer(customer.id)}>
                Remove
              </button>
            ),
          },
        ]}
      />
      <form
        className="mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim().length < 2) {
            setError("Enter the customer name.");
            return;
          }
          addCustomer({ name: name.trim(), phone: phone.trim(), opening: 0, note: "" });
          setName("");
          setPhone("");
          setError("");
        }}
      >
        <Field label="Name (required)" error={error}>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Phone">
          <Input value={phone} onChange={(event) => setPhone(event.target.value)} />
        </Field>
        <div className="self-end">
          <Button type="submit">Add customer</Button>
        </div>
      </form>
    </div>
  );
}

function Floor({ inventory, services, location }: { inventory: { id: string; name: string; kind: "equipment" | "supply"; onHand: number; reorderAt: number; note: string }[]; services: string[]; location: string }) {
  const adjustInventory = useDesk((state) => state.adjustInventory);
  const addInventory = useDesk((state) => state.addInventory);
  const removeInventory = useDesk((state) => state.removeInventory);
  const [name, setName] = useState("");
  const [reorder, setReorder] = useState("5");
  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <h2 className="font-display text-2xl">Machines</h2>
        <p className="mt-1 mb-3 text-sm text-muted">{location}</p>
        <ul className="divide-y divide-line border-y border-line">
          {inventory
            .filter((item) => item.kind === "equipment")
            .map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-3 py-3">
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-muted">{item.note}</p>
                </div>
                <span className="tabular-nums text-sm">{item.onHand} on floor</span>
              </li>
            ))}
        </ul>
        <h2 className="mt-8 font-display text-2xl">Supplies</h2>
        {inventory.every((item) => item.kind !== "supply") ? (
          <p className="mt-2 text-sm text-muted">No thread, vinyl, or blank garments recorded yet. Add them when you count them.</p>
        ) : (
          <ul className="mt-3 divide-y divide-line border-y border-line">
            {inventory
              .filter((item) => item.kind === "supply")
              .map((item) => {
                const low = item.onHand <= item.reorderAt;
                return (
                  <li key={item.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
                    <div>
                      <p className="font-semibold">
                        {item.name} {low ? <Stamp tone="rust">Reorder</Stamp> : null}
                      </p>
                      <p className="text-sm text-muted">Reorder at {item.reorderAt}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" onClick={() => adjustInventory(item.id, item.onHand - 1)} aria-label={`Decrease ${item.name}`}>
                        −
                      </Button>
                      <span className="w-8 text-center tabular-nums">{item.onHand}</span>
                      <Button variant="ghost" onClick={() => adjustInventory(item.id, item.onHand + 1)} aria-label={`Increase ${item.name}`}>
                        +
                      </Button>
                      <Button variant="ghost" onClick={() => removeInventory(item.id)}>
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
          </ul>
        )}
        <form
          className="mt-4 flex flex-wrap gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            const at = Number(reorder);
            if (name.trim().length < 2 || !Number.isFinite(at)) return;
            addInventory({ name: name.trim(), kind: "supply", onHand: 0, reorderAt: at, note: "" });
            setName("");
          }}
        >
          <Input className="max-w-xs" value={name} placeholder="Supply name" aria-label="Supply name" onChange={(event) => setName(event.target.value)} />
          <Input className="w-28" value={reorder} aria-label="Reorder at" onChange={(event) => setReorder(event.target.value)} />
          <Button type="submit">Add supply</Button>
        </form>
      </div>
      <aside className="lg:col-span-5">
        <h2 className="font-display text-2xl">What the shop does</h2>
        <p className="mt-1 mb-3 text-sm text-muted">Capabilities, not a price list. Prices belong on a quote.</p>
        <ul className="divide-y divide-line border-y border-line">
          {services.map((service) => (
            <li key={service} className="py-2 text-sm">
              {service}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Quotes() {
  const quotes = useDesk((state) => state.quotes);
  const customers = useDesk((state) => state.customers);
  const updateQuote = useDesk((state) => state.updateQuote);
  const removeQuote = useDesk((state) => state.removeQuote);
  const convertQuote = useDesk((state) => state.convertQuote);
  const nameOf = (id: string) => customers.find((customer) => customer.id === id)?.name ?? "Unknown";
  if (!quotes.length) return <Empty title="No quotes." body="A quote is a price and a spec. It becomes a job only when you accept it." />;
  return (
    <ul className="divide-y divide-line border-y border-line">
      {quotes.map((quote) => (
        <li key={quote.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto]">
          <div>
            <p className="font-semibold">
              {quote.summary} {quote.sample ? <Stamp>Sample</Stamp> : null}
            </p>
            <p className="text-sm text-muted">
              {nameOf(quote.customerId)} · {quote.spec || "No spec"} · {formatMoney(quote.amount, "UGX")}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Select
              aria-label="Quote status"
              value={quote.status}
              onChange={(event) => updateQuote(quote.id, { status: event.target.value as QuoteStatus })}
            >
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="accepted">Accepted</option>
              <option value="declined">Declined</option>
            </Select>
            <Button onClick={() => convertQuote(quote.id)} disabled={quote.status === "accepted"}>
              Open as job
            </Button>
            <Button variant="ghost" onClick={() => removeQuote(quote.id)}>
              Remove
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}

function OrderPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const customers = useDesk((state) => state.customers);
  const addCustomer = useDesk((state) => state.addCustomer);
  const addOrder = useDesk((state) => state.addOrder);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [customerId, setCustomerId] = useState(customers.find((item) => !item.sample)?.id ?? "");
  const [newName, setNewName] = useState("");
  const [garment, setGarment] = useState("");
  const [spec, setSpec] = useState("");
  const [qty, setQty] = useState("1");
  const [price, setPrice] = useState("");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");

  return (
    <Panel open={open} title="New job ticket" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Customer">
          <Select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            <option value="">New customer, named below</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
        </Field>
        {!customerId ? (
          <Field label="New customer name">
            <Input value={newName} onChange={(event) => setNewName(event.target.value)} />
          </Field>
        ) : null}
        <Field label="Garment (required)" error={error}>
          <Input value={garment} onChange={(event) => setGarment(event.target.value)} />
        </Field>
        <Field label="Specification">
          <Textarea value={spec} onChange={(event) => setSpec(event.target.value)} />
        </Field>
        <Field label="Quantity">
          <Input value={qty} inputMode="numeric" onChange={(event) => setQty(event.target.value)} />
        </Field>
        <Field label="Price (UGX)">
          <Input value={price} inputMode="decimal" onChange={(event) => setPrice(event.target.value)} />
        </Field>
        <Field label="Due">
          <Input type="date" value={due} onChange={(event) => setDue(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            const count = Number(qty);
            const amount = parseAmount(price);
            if (garment.trim().length < 2 || !Number.isInteger(count) || count < 1 || amount === null) {
              setError("Need a garment, a whole quantity, and a price.");
              return;
            }
            let id = customerId;
            if (!id) {
              if (newName.trim().length < 2) {
                setError("Name the customer.");
                return;
              }
              id = addCustomer({ name: newName.trim(), phone: "", opening: 0, note: "" });
            }
            addOrder({
              customerId: id,
              garment: garment.trim(),
              spec: spec.trim(),
              qty: count,
              due: due || null,
              stage: "quote",
              price: amount,
              paid: 0,
              qc: "",
              notes: "",
            });
            setGarment("");
            setSpec("");
            setPrice("");
            setError("");
            flashMsg("Job opened.");
            onClose();
          }}
        >
          Open job
        </Button>
      </div>
    </Panel>
  );
}

function QuotePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const customers = useDesk((state) => state.customers);
  const addQuote = useDesk((state) => state.addQuote);
  const [customerId, setCustomerId] = useState(customers[0]?.id ?? "");
  const [summary, setSummary] = useState("");
  const [spec, setSpec] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel open={open} title="New quote" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Customer" error={!customers.length ? "Add a customer first." : undefined}>
          <Select value={customerId} onChange={(event) => setCustomerId(event.target.value)}>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.name}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Summary (required)" error={error}>
          <Input value={summary} onChange={(event) => setSummary(event.target.value)} />
        </Field>
        <Field label="Spec">
          <Textarea value={spec} onChange={(event) => setSpec(event.target.value)} />
        </Field>
        <Field label="Amount (UGX)">
          <Input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          disabled={!customers.length}
          onClick={() => {
            const value = parseAmount(amount);
            if (summary.trim().length < 2 || value === null || !customerId) {
              setError("Need a summary and an amount.");
              return;
            }
            addQuote({ customerId, summary: summary.trim(), spec: spec.trim(), amount: value, status: "draft" });
            setSummary("");
            setAmount("");
            setError("");
            onClose();
          }}
        >
          Save quote
        </Button>
      </div>
    </Panel>
  );
}
