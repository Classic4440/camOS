import assert from "node:assert/strict";
import test from "node:test";
import { cashPosition, customerBalance, owed, positionSize, projectedPosition, tradePnl } from "./calc.ts";
import type { Customer, Order, Txn } from "./types.ts";

test("cash ignores projections and other currencies", () => {
  const txns: Txn[] = [
    { id: "1", date: "2026-11-01", house: "brand", kind: "in", category: "Job", amount: 100, currency: "UGX", note: "", certainty: "actual" },
    { id: "2", date: "2026-11-02", house: "brand", kind: "out", category: "Thread", amount: 40, currency: "UGX", note: "", certainty: "actual" },
    { id: "3", date: "2026-11-03", house: "brand", kind: "in", category: "Guess", amount: 999, currency: "UGX", note: "", certainty: "projected" },
    { id: "4", date: "2026-11-03", house: "music", kind: "in", category: "Royalty", amount: 50, currency: "USD", note: "", certainty: "actual" },
  ];
  assert.equal(cashPosition(txns, "UGX"), 60);
  assert.equal(projectedPosition(txns, "UGX"), 999);
  assert.equal(cashPosition(txns, "USD"), 50);
});

test("customer balance is opening plus unpaid jobs", () => {
  const customer: Customer = { id: "c", name: "A", phone: "", opening: 1000, note: "" };
  const orders: Order[] = [
    {
      id: "o",
      number: "CB-1",
      customerId: "c",
      garment: "Jersey",
      spec: "",
      qty: 1,
      due: null,
      stage: "production",
      price: 5000,
      paid: 2000,
      qc: "",
      notes: "",
    },
  ];
  assert.equal(owed(orders[0]!), 3000);
  assert.equal(customerBalance(customer, orders), 4000);
});

test("position size and trade pnl", () => {
  assert.equal(positionSize(1000, 1, 2), 5);
  assert.equal(positionSize(1000, 0, 2), null);
  assert.equal(tradePnl({ side: "long", entry: 10, exit: 12, size: 3 }), 6);
  assert.equal(tradePnl({ side: "short", entry: 10, exit: 8, size: 3 }), 6);
  assert.equal(tradePnl({ side: "long", entry: 10, exit: null, size: 3 }), null);
});
