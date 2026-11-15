import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as netsByMonth, D as projectedPosition, P as useDesk, a as Input, c as Panel, g as formatDay, i as Field, l as Select, m as cn, n as DataTable, o as Page, p as cashPosition, t as Button, u as Stamp, v as formatMoney } from "./ui-CJBsTUw5.mjs";
import { n as HOUSE_LABEL } from "./types-BoxosEJd.mjs";
import { t as LedgerChart } from "./chart-CcN_vxCQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/finance-Vx3hDp_U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOUSES = Object.keys(HOUSE_LABEL);
function FinanceView() {
	const txns = useDesk((state) => state.txns);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const removeTxns = useDesk((state) => state.removeTxns);
	const [currency, setCurrency] = (0, import_react.useState)("UGX");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const rows = txns.filter((txn) => txn.currency === currency);
	const months = (0, import_react.useMemo)(() => netsByMonth(txns, currency), [txns, currency]);
	const actual = cashPosition(txns, currency);
	const projected = projectedPosition(txns, currency);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		mark: "double",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: "Ledger"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-1 font-display text-3xl font-medium leading-tight",
					children: [currency, " book"]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => openComposer("txn"),
					children: "New entry"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 flex gap-2",
				children: ["UGX", "USD"].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setCurrency(item),
					className: cn("min-h-11 border px-4 text-sm font-semibold", currency === item ? "border-ink bg-ink text-paper" : "border-line"),
					children: item
				}, item))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-6 border-y border-ink py-4 md:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-faint",
						children: "Actual"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: formatMoney(actual, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Money that has moved. Shillings and dollars are never added."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-brass",
						children: "Projected"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: formatMoney(projected, currency)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "A labeled guess. Not included in actual."
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: months.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"No ",
						currency,
						" entries, so there is no chart. A chart of nothing would be decoration."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerChart, {
					rows: months,
					currency
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [selected.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							removeTxns(selected);
							setSelected([]);
						},
						children: "Delete selected"
					})
				}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
					rows,
					selectable: true,
					selected,
					onSelected: setSelected,
					searchText: (txn) => `${txn.category} ${txn.note} ${txn.house}`,
					empty: {
						title: `No ${currency} entries.`,
						body: "Add an actual amount you can point to, or a projection you have labeled as one."
					},
					columns: [
						{
							id: "date",
							header: "Date",
							sortValue: (txn) => txn.date,
							cell: (txn) => formatDay(txn.date)
						},
						{
							id: "category",
							header: "Category",
							sortValue: (txn) => txn.category,
							cell: (txn) => txn.category
						},
						{
							id: "house",
							header: "House",
							optional: true,
							sortValue: (txn) => txn.house,
							cell: (txn) => HOUSE_LABEL[txn.house]
						},
						{
							id: "kind",
							header: "Kind",
							cell: (txn) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
								tone: txn.certainty === "projected" ? "brass" : "neutral",
								children: txn.certainty === "actual" ? txn.kind : `Projected ${txn.kind}`
							})
						},
						{
							id: "amount",
							header: "Amount",
							align: "right",
							sortValue: (txn) => txn.amount,
							cell: (txn) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: txn.kind === "out" ? "text-rust" : void 0,
								children: [txn.kind === "out" ? "−" : "", formatMoney(txn.amount, txn.currency)]
							})
						}
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TxnPanel, {
				open: composer === "txn",
				onClose: closeComposer,
				currency
			})
		]
	});
}
function TxnPanel({ open, onClose, currency }) {
	const addTxn = useDesk((state) => state.addTxn);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [date, setDate] = (0, import_react.useState)("");
	const [house, setHouse] = (0, import_react.useState)("brand");
	const [kind, setKind] = (0, import_react.useState)("out");
	const [category, setCategory] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [certainty, setCertainty] = (0, import_react.useState)("actual");
	const [book, setBook] = (0, import_react.useState)(currency);
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "Ledger entry",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (event) => setDate(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Category",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: category,
						onChange: (event) => setCategory(event.target.value),
						placeholder: "Thread, royalty, transport"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Amount",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: amount,
						inputMode: "decimal",
						onChange: (event) => setAmount(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Currency",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: book,
						onChange: (event) => setBook(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "UGX",
							children: "UGX"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "USD",
							children: "USD"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Direction",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: kind,
						onChange: (event) => setKind(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "in",
							children: "Money in"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "out",
							children: "Money out"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Certainty",
					hint: "Actual means it happened. Projected means it has not.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: certainty,
						onChange: (event) => setCertainty(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "actual",
							children: "Actual"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "projected",
							children: "Projected"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "House",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: house,
						onChange: (event) => setHouse(event.target.value),
						children: HOUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: HOUSE_LABEL[item]
						}, item))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Note",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: note,
						onChange: (event) => setNote(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
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
							certainty
						});
						setAmount("");
						setCategory("");
						setNote("");
						setError("");
						flashMsg("Entry saved in the " + book + " book.");
						onClose();
					},
					children: "Save entry"
				})
			]
		})
	});
}
var SplitComponent = FinanceView;
//#endregion
export { SplitComponent as component };
