import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { C as netsByMonth, P as useDesk, S as kampalaToday, j as sampleCount, o as Page, p as cashPosition, s as PageHead, u as Stamp, v as formatMoney, x as isLate } from "./ui-CJBsTUw5.mjs";
import { i as ORDER_STAGE_LABEL, o as RELEASE_STAGE_LABEL } from "./types-BoxosEJd.mjs";
import { t as LedgerChart } from "./chart-CcN_vxCQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/analytics-B6Z1ramV.js
var import_jsx_runtime = require_jsx_runtime();
function AnalyticsView() {
	const tasks = useDesk((state) => state.tasks);
	const orders = useDesk((state) => state.orders);
	const releases = useDesk((state) => state.releases);
	const projects = useDesk((state) => state.projects);
	const bugs = useDesk((state) => state.bugs);
	const txns = useDesk((state) => state.txns);
	const ideas = useDesk((state) => state.ideas);
	const paths = useDesk((state) => state.paths);
	const quotes = useDesk((state) => state.quotes);
	const customers = useDesk((state) => state.customers);
	const today = kampalaToday();
	const month = today.slice(0, 7);
	const late = tasks.filter((task) => isLate(task.due, task.done, today));
	const liveOrders = orders.filter((order) => !order.sample && order.stage !== "delivered");
	const stuckReleases = releases.filter((release) => release.stage !== "released");
	const openBugs = bugs.filter((bug) => bug.open);
	const ugx = netsByMonth(txns, "UGX").filter((row) => row.month === month);
	const samples = sampleCount({
		orders,
		quotes,
		customers
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Office · Analytics",
			title: "What the records actually say.",
			lede: "Counted from the records on this desk. Sample shop jobs are left out of the live totals."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 md:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "border-t border-ink pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: "Past-date tasks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-4xl tabular-nums",
					children: late.length
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "border-t border-line pt-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "text-xs font-semibold uppercase tracking-widest text-faint",
						children: "Live shop jobs"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums",
						children: liveOrders.length
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [samples, " sample records still sitting in Classic Brand."]
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Releases not out"
			}), stuckReleases.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Every catalog entry is marked released."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 divide-y divide-line border-y border-line",
				children: stuckReleases.map((release) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold",
						children: release.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "ml-2 text-sm text-muted",
						children: release.catalog
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
						tone: "brass",
						children: RELEASE_STAGE_LABEL[release.stage]
					})]
				}, release.id))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Shop queue, live only"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-3 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3",
				children: Object.keys(ORDER_STAGE_LABEL).map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "bg-paper px-3 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-widest text-faint",
						children: ORDER_STAGE_LABEL[stage]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl tabular-nums",
						children: orders.filter((order) => !order.sample && order.stage === stage).length
					})]
				}, stage))
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "This month, UGX"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						"Actual position overall ",
						formatMoney(cashPosition(txns, "UGX"), "UGX"),
						". This month's net is below, split by certainty."
					]
				}),
				ugx.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted",
					children: "No UGX movement dated this month."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LedgerChart, {
						rows: ugx,
						currency: "UGX"
					})
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-10 grid gap-6 border-t border-line pt-4 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Open defects"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl tabular-nums",
							children: openBugs.length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-muted",
							children: [projects.filter((project) => project.status === "active").length, " projects marked active."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Ideas in play"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl tabular-nums",
							children: ideas.filter((idea) => idea.status === "testing" || idea.status === "committed").length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-muted",
							children: [ideas.filter((idea) => idea.status === "raw").length, " still raw."]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Study mean"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "font-display text-3xl tabular-nums",
							children: [paths.length ? Math.round(paths.reduce((sum, path) => sum + path.progress, 0) / paths.length) : 0, "%"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-muted",
							children: "Across the learning paths, not a certificate."
						})
					]
				})
			]
		})
	] });
}
var SplitComponent = AnalyticsView;
//#endregion
export { SplitComponent as component };
