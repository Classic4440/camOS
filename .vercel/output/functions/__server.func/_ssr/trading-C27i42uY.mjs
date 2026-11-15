import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { E as positionSize, N as tradePnl, P as useDesk, S as kampalaToday, a as Input, c as Panel, d as Textarea, g as formatDay, i as Field, l as Select, n as DataTable, o as Page, s as PageHead, t as Button, v as formatMoney } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/trading-C27i42uY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TradingView() {
	const trades = useDesk((state) => state.trades);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const removeTrade = useDesk((state) => state.removeTrade);
	const [account, setAccount] = (0, import_react.useState)("1000");
	const [risk, setRisk] = (0, import_react.useState)("1");
	const [stop, setStop] = (0, import_react.useState)("");
	const size = positionSize(Number(account), Number(risk), Number(stop));
	const pnl = trades.map((trade) => tradePnl(trade)).filter((value) => value !== null).reduce((sum, value) => sum + value, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Records · Trading",
			title: "A journal and a risk sum.",
			lede: "Record the trade you took. Size is account × risk, divided by the stop. No stop, no size.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => openComposer("trade"),
				children: "Log a trade"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "grid gap-8 border-y border-line py-6 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Position size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "Risk amount = account × risk percent. Size = risk amount ÷ stop distance. If the stop is missing, there is no size."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 sm:grid-cols-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Account (USD)",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: account,
									inputMode: "decimal",
									onChange: (event) => setAccount(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Risk %",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: risk,
									inputMode: "decimal",
									onChange: (event) => setRisk(event.target.value)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Stop distance",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: stop,
									inputMode: "decimal",
									onChange: (event) => setStop(event.target.value)
								})
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-5 border-t border-ink pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-faint",
						children: "Size"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: size === null ? "—" : size
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: size === null ? "Enter a stop greater than zero." : `Risking ${formatMoney(Number(account) * Number(risk) / 100, "USD")} if the stop is hit.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm",
						children: ["Closed journal P&L ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums font-semibold",
							children: formatMoney(pnl, "USD")
						})]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
				rows: trades,
				searchText: (trade) => `${trade.instrument} ${trade.thesis} ${trade.lesson}`,
				empty: {
					title: "The journal is empty.",
					body: "Log a trade after it exists. A blank journal is better than a fictional one."
				},
				columns: [
					{
						id: "date",
						header: "Date",
						sortValue: (trade) => trade.date,
						cell: (trade) => formatDay(trade.date)
					},
					{
						id: "instrument",
						header: "Instrument",
						sortValue: (trade) => trade.instrument,
						cell: (trade) => trade.instrument
					},
					{
						id: "side",
						header: "Side",
						cell: (trade) => trade.side
					},
					{
						id: "pnl",
						header: "P&L",
						align: "right",
						sortValue: (trade) => tradePnl(trade) ?? 0,
						cell: (trade) => {
							const value = tradePnl(trade);
							if (value === null) return "Open";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: value < 0 ? "text-rust" : "text-moss",
								children: formatMoney(value, "USD")
							});
						}
					},
					{
						id: "act",
						header: "",
						cell: (trade) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "min-h-11 text-sm text-rust",
							onClick: () => removeTrade(trade.id),
							children: "Remove"
						})
					}
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TradePanel, {
			open: composer === "trade",
			onClose: closeComposer
		})
	] });
}
function TradePanel({ open, onClose }) {
	const addTrade = useDesk((state) => state.addTrade);
	const [date, setDate] = (0, import_react.useState)(kampalaToday());
	const [instrument, setInstrument] = (0, import_react.useState)("");
	const [side, setSide] = (0, import_react.useState)("long");
	const [entry, setEntry] = (0, import_react.useState)("");
	const [exit, setExit] = (0, import_react.useState)("");
	const [size, setSize] = (0, import_react.useState)("");
	const [thesis, setThesis] = (0, import_react.useState)("");
	const [lesson, setLesson] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "Trade journal",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: date,
						onChange: (event) => setDate(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Instrument",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: instrument,
						onChange: (event) => setInstrument(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Side",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: side,
						onChange: (event) => setSide(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "long",
							children: "Long"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "short",
							children: "Short"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Entry",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: entry,
						inputMode: "decimal",
						onChange: (event) => setEntry(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Exit",
					hint: "Leave blank if the trade is still open.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: exit,
						inputMode: "decimal",
						onChange: (event) => setExit(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Size",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: size,
						inputMode: "decimal",
						onChange: (event) => setSize(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Thesis",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: thesis,
						onChange: (event) => setThesis(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lesson",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: lesson,
						onChange: (event) => setLesson(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						const entryN = Number(entry);
						const sizeN = Number(size);
						const exitN = exit.trim() === "" ? null : Number(exit);
						if (instrument.trim().length < 1 || !(entryN > 0) || !(sizeN > 0) || exitN !== null && !Number.isFinite(exitN)) {
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
							lesson: lesson.trim()
						});
						setInstrument("");
						setEntry("");
						setExit("");
						setSize("");
						setThesis("");
						setLesson("");
						setError("");
						onClose();
					},
					children: "Save trade"
				})
			]
		})
	});
}
var SplitComponent = TradingView;
//#endregion
export { SplitComponent as component };
