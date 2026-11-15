import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatMoney, formatMonth } from "@/lib/camos/format";
import type { Currency } from "@/lib/camos/types";

export function LedgerChart({
  rows,
  currency,
}: {
  rows: { month: string; actual: number; projected: number }[];
  currency: Currency;
}) {
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  if (!ready) return <div className="h-56 border-t border-line" />;
  const data = rows.map((row) => ({ ...row, label: formatMonth(row.month) }));
  return (
    <div>
      <p className="mb-3 text-sm text-muted">
        <span className="text-ink">Ink</span> is actual net. <span className="text-brass">Brass</span> is projected net.
        The two are never added together.
      </p>
      <div className="h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--line)" />
            <XAxis dataKey="label" tick={{ fill: "var(--muted)", fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={72}
              tickFormatter={(value: number) => formatMoney(value, currency)}
            />
            <Tooltip
              cursor={{ fill: "var(--surface)" }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                return (
                  <div className="border border-line bg-elevated px-3 py-2 text-sm">
                    <p className="font-semibold">{label}</p>
                    {payload.map((item) => (
                      <p key={String(item.name)} className="tabular-nums text-muted">
                        {item.name === "actual" ? "Actual" : "Projected"}: {formatMoney(Number(item.value ?? 0), currency)}
                      </p>
                    ))}
                  </div>
                );
              }}
            />
            <Bar dataKey="actual" fill="var(--ink)" maxBarSize={28} />
            <Bar dataKey="projected" fill="var(--brass)" maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
