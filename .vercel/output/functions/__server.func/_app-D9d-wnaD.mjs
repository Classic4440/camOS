import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { A as salutation, I as weekDates, L as weekdayShort, O as releaseFact, P as useDesk, S as kampalaToday, g as formatDay, j as sampleCount, m as cn, o as Page, p as cashPosition, t as Button, u as Stamp, x as isLate } from "./_ssr/ui-CJBsTUw5.mjs";
import { o as RELEASE_STAGE_LABEL, t as HOME_LABEL } from "./_ssr/types-BoxosEJd.mjs";
import { b as Link } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-D9d-wnaD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HomeView() {
	const settings = useDesk((state) => state.settings);
	const tasks = useDesk((state) => state.tasks);
	const decisions = useDesk((state) => state.decisions);
	const releases = useDesk((state) => state.releases);
	const orders = useDesk((state) => state.orders);
	const projects = useDesk((state) => state.projects);
	const txns = useDesk((state) => state.txns);
	const paths = useDesk((state) => state.paths);
	const ideas = useDesk((state) => state.ideas);
	const quotes = useDesk((state) => state.quotes);
	const customers = useDesk((state) => state.customers);
	const moveHome = useDesk((state) => state.moveHome);
	const toggleHomeBlock = useDesk((state) => state.toggleHomeBlock);
	const updateTask = useDesk((state) => state.updateTask);
	const today = kampalaToday();
	const [day, setDay] = (0, import_react.useState)(today);
	const [arrange, setArrange] = (0, import_react.useState)(false);
	const samples = sampleCount({
		orders,
		quotes,
		customers
	});
	const visible = settings.homeOrder.filter((id) => !settings.hiddenHome.includes(id));
	const late = tasks.filter((task) => isLate(task.due, task.done, today));
	const dueToday = tasks.filter((task) => !task.done && task.due === today);
	const album = releases[0];
	const parts = [];
	if (late.length) parts.push(`${late.length} open ${late.length === 1 ? "task is" : "tasks are"} past date`);
	else if (dueToday.length) parts.push(`${dueToday.length} ${dueToday.length === 1 ? "task is" : "tasks are"} due today`);
	else parts.push("No task is due today");
	if (album) parts.push(`${album.catalog} is in ${RELEASE_STAGE_LABEL[album.stage].toLowerCase()}`);
	if (samples) parts.push("sample shop jobs are still on the board");
	const blocks = {
		sequence: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sequence, {
			day,
			tasks: tasks.filter((task) => !task.done && (task.due === day || !task.due && task.priority === "now" && day === today)),
			onDone: (id) => updateTask(id, { done: true })
		}),
		attention: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Attention, { today }),
		houses: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
			className: "divide-y divide-line border-y border-line",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseLink, {
					href: "/music",
					name: "Cam Leinad",
					detail: album ? `${album.title} · ${RELEASE_STAGE_LABEL[album.stage]} · ${releaseFact(album)}` : "No release on the catalog yet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseLink, {
					href: "/brand",
					name: "Classic Brand",
					detail: `${orders.filter((order) => !order.sample && order.stage !== "delivered").length} live jobs in progress · Matugga`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HouseLink, {
					href: "/lab",
					name: "Lab",
					detail: `${projects.filter((project) => project.status === "active").length} active projects of ${projects.length} recorded`
				})
			]
		}),
		week: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-4 lg:grid-cols-7",
			children: weekDates(today).map((date) => {
				const count = tasks.filter((task) => !task.done && task.due === date).length + orders.filter((order) => !order.sample && order.stage !== "delivered" && order.due === date).length;
				const active = date === day;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
					className: "bg-paper",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setDay(date),
						className: cn("flex min-h-16 w-full flex-col items-start px-3 py-2 text-left", active && "bg-ink text-paper"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: cn("text-xs uppercase tracking-widest", active ? "text-paper" : "text-faint"),
								children: date === today ? "Today" : weekdayShort(date)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg tabular-nums",
								children: date.slice(8)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs tabular-nums",
								children: count === 0 ? "Clear" : `${count} due`
							})
						]
					})
				}, date);
			})
		}),
		books: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/finance",
					className: "border-t-2 border-ink pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Actual cash"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl tabular-nums",
							children: formatUg(cashPosition(txns, "UGX"))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "UGX shop book. Dollars stay on the ledger."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/learn",
					className: "border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Study"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-2 font-display text-2xl tabular-nums",
							children: [paths.length ? Math.round(paths.reduce((sum, path) => sum + path.progress, 0) / paths.length) : 0, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-base text-muted",
								children: "%"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Mean progress across recorded paths."
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/ideas",
					className: "border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-faint",
							children: "Ideas"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl tabular-nums",
							children: ideas.filter((idea) => idea.status !== "shelved").length
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [decisions.filter((item) => item.status === "open").length, " open decisions on the task desk."]
						})
					]
				})
			]
		})
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-8 grid gap-4 border-b border-line pb-6 md:grid-cols-[1fr_auto] md:items-end",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-3xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: formatDay(today)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
					className: "mt-2 font-display text-3xl font-medium leading-tight md:text-4xl",
					children: [
						salutation(),
						", ",
						settings.called,
						"."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-base leading-relaxed",
					children: [parts.map((part, index) => index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)).join(". "), "."]
				}),
				settings.focus ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: settings.focus
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: arrange ? "primary" : "line",
			onClick: () => setArrange((open) => !open),
			children: arrange ? "Done" : "Arrange"
		})]
	}), visible.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			"Every desk block is hidden. Restore them in",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/settings",
				className: "text-accent underline",
				children: "Settings"
			}),
			"."
		]
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-x-10 gap-y-10 lg:grid-cols-12",
		children: visible.map((id) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: cn(id === "sequence" ? "lg:col-span-7" : id === "attention" ? "lg:col-span-5" : "lg:col-span-12"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: HOME_LABEL[id]
				}), arrange ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							"aria-label": `Move ${HOME_LABEL[id]} earlier`,
							onClick: () => moveHome(id, -1),
							children: "Up"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							"aria-label": `Move ${HOME_LABEL[id]} later`,
							onClick: () => moveHome(id, 1),
							children: "Down"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => toggleHomeBlock(id),
							children: "Hide"
						})
					]
				}) : null]
			}), blocks[id]]
		}, id))
	})] });
}
function formatUg(value) {
	return new Intl.NumberFormat("en-UG", {
		style: "currency",
		currency: "UGX",
		maximumFractionDigits: 0
	}).format(value);
}
function Sequence({ day, tasks, onDone }) {
	if (!tasks.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted",
		children: [
			"Nothing is scheduled for ",
			formatDay(day),
			". The week strip can move the day."
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "divide-y divide-line border-y border-line",
		children: tasks.map((task, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "grid grid-cols-[2.5rem_1fr_auto] items-center gap-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-display text-lg tabular-nums text-faint",
					children: String(index + 1).padStart(2, "0")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-semibold",
						children: task.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							task.house,
							" · ",
							task.priority,
							task.due ? ` · ${formatDay(task.due)}` : ""
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => onDone(task.id),
					children: "Done"
				})
			]
		}, task.id))
	});
}
function Attention({ today }) {
	const tasks = useDesk((state) => state.tasks);
	const decisions = useDesk((state) => state.decisions);
	const releases = useDesk((state) => state.releases);
	const orders = useDesk((state) => state.orders);
	const rows = [];
	for (const task of tasks) {
		if (task.done) continue;
		if (isLate(task.due, task.done, today)) rows.push({
			id: task.id,
			label: task.title,
			href: "/personal",
			tone: "rust",
			mark: "Late"
		});
		else if (task.due === today) rows.push({
			id: task.id,
			label: task.title,
			href: "/personal",
			tone: "brass",
			mark: "Today"
		});
	}
	for (const decision of decisions) if (decision.status === "open") rows.push({
		id: decision.id,
		label: decision.question,
		href: "/personal",
		tone: "brass",
		mark: "Decide"
	});
	for (const release of releases) if (release.tracks.length === 0) rows.push({
		id: release.id,
		label: `${release.catalog} has no tracklist`,
		href: "/music",
		tone: "neutral",
		mark: "Gap"
	});
	for (const order of orders) {
		if (order.sample || order.stage === "delivered") continue;
		if (order.due && order.due < today) rows.push({
			id: order.id,
			label: `${order.number} is past its date`,
			href: "/brand",
			tone: "rust",
			mark: "Late"
		});
	}
	if (!rows.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm leading-relaxed text-muted",
		children: "Nothing is late, and no decision is waiting. Use the day for the focus line above."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-line border-y border-line",
		children: rows.slice(0, 6).map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: row.href,
			className: "flex min-h-12 items-center justify-between gap-3 py-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm",
				children: row.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
				tone: row.tone,
				children: row.mark
			})]
		}) }, row.id))
	});
}
function HouseLink({ href, name, detail }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: href,
		className: "flex min-h-14 flex-col justify-center py-2 md:flex-row md:items-baseline md:justify-between md:gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-lg",
			children: name
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm text-muted",
			children: detail
		})]
	}) });
}
var SplitComponent = HomeView;
//#endregion
export { SplitComponent as component };
