import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { v as formatMoney, y as formatMonth } from "./ui-CJBsTUw5.mjs";
import { a as Bar, i as CartesianGrid, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chart-CcN_vxCQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LedgerChart({ rows, currency }) {
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setReady(true), []);
	if (!ready) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-56 border-t border-line" });
	const data = rows.map((row) => ({
		...row,
		label: formatMonth(row.month)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mb-3 text-sm text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-ink",
				children: "Ink"
			}),
			" is actual net. ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-brass",
				children: "Brass"
			}),
			" is projected net. The two are never added together."
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-56",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
				data,
				barGap: 2,
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						vertical: false,
						stroke: "var(--line)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: {
							fill: "var(--muted)",
							fontSize: 12
						},
						tickLine: false,
						axisLine: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: {
							fill: "var(--muted)",
							fontSize: 12
						},
						tickLine: false,
						axisLine: false,
						width: 72,
						tickFormatter: (value) => formatMoney(value, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						cursor: { fill: "var(--surface)" },
						content: ({ active, payload, label }) => {
							if (!active || !payload?.length) return null;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border border-line bg-elevated px-3 py-2 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-semibold",
									children: label
								}), payload.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "tabular-nums text-muted",
									children: [
										item.name === "actual" ? "Actual" : "Projected",
										": ",
										formatMoney(Number(item.value ?? 0), currency)
									]
								}, String(item.name)))]
							});
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "actual",
						fill: "var(--ink)",
						maxBarSize: 28
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
						dataKey: "projected",
						fill: "var(--brass)",
						maxBarSize: 28
					})
				]
			})
		})
	})] });
}
//#endregion
export { LedgerChart as t };
