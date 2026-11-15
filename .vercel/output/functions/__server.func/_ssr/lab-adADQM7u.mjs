import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, S as kampalaToday, a as Input, d as Textarea, i as Field, l as Select, m as cn, o as Page, r as Empty, t as Button, u as Stamp } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/lab-adADQM7u.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	recorded: "Recorded",
	active: "Active",
	paused: "Paused",
	shipped: "Shipped"
};
function LabView() {
	const projects = useDesk((state) => state.projects);
	const bugs = useDesk((state) => state.bugs);
	const decisions = useDesk((state) => state.techDecisions);
	const deploys = useDesk((state) => state.deploys);
	const updateProject = useDesk((state) => state.updateProject);
	const updateBug = useDesk((state) => state.updateBug);
	const removeBug = useDesk((state) => state.removeBug);
	const addTechDecision = useDesk((state) => state.addTechDecision);
	const removeTechDecision = useDesk((state) => state.removeTechDecision);
	const addDeploy = useDesk((state) => state.addDeploy);
	const removeDeploy = useDesk((state) => state.removeDeploy);
	const addBug = useDesk((state) => state.addBug);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const [query, setQuery] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [currentId, setCurrentId] = (0, import_react.useState)(projects[0]?.id ?? "");
	const [bugTitle, setBugTitle] = (0, import_react.useState)("");
	const [decisionTitle, setDecisionTitle] = (0, import_react.useState)("");
	const [choice, setChoice] = (0, import_react.useState)("");
	const [deployNote, setDeployNote] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (focusId && projects.some((project) => project.id === focusId)) {
			setCurrentId(focusId);
			setFocus(null);
		}
	}, [
		focusId,
		projects,
		setFocus
	]);
	const shown = projects.filter((project) => {
		return `${project.name} ${project.summary} ${project.stack}`.toLowerCase().includes(query.trim().toLowerCase()) && (status === "all" || project.status === status);
	});
	const current = projects.find((project) => project.id === currentId) ?? shown[0] ?? null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		mark: "dashed",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "mb-6 flex flex-col gap-3 border-b border-dashed border-line pb-4 sm:flex-row sm:items-end sm:justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-faint",
						children: "Development lab"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium leading-tight",
						children: "Projects on record"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							projects.filter((project) => project.status === "active").length,
							" active · ",
							bugs.filter((bug) => bug.open).length,
							" open defects"
						]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: query,
					onChange: (event) => setQuery(event.target.value),
					placeholder: "Filter projects",
					"aria-label": "Filter projects",
					className: "sm:max-w-xs"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
					"aria-label": "Status",
					value: status,
					className: "sm:max-w-48",
					onChange: (event) => setStatus(event.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "all",
						children: "All statuses"
					}), Object.keys(STATUS).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: item,
						children: STATUS[item]
					}, item))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-8 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "border-t border-line lg:col-span-5",
					children: [shown.map((project) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "border-b border-line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setCurrentId(project.id),
							className: cn("flex w-full min-h-14 flex-col items-start justify-center px-1 py-3 text-left", current?.id === project.id && "bg-surface"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "flex w-full items-baseline justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-semibold",
									children: project.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "shrink-0 text-xs font-semibold uppercase tracking-widest text-faint",
									children: STATUS[project.status]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-sm text-muted",
								children: project.stack
							})]
						})
					}, project.id)), shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-6 text-sm text-muted",
						children: "No project matches."
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
					className: "lg:col-span-7",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl",
										children: current.name
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: current.status === "active" ? "brass" : "neutral",
										children: STATUS[current.status]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm leading-relaxed text-muted",
									children: current.summary
								}),
								current.href ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "mt-2 inline-block text-sm text-accent underline",
									href: current.href,
									target: "_blank",
									rel: "noreferrer",
									children: current.href
								}) : null
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-3 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Status",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
										value: current.status,
										onChange: (event) => updateProject(current.id, { status: event.target.value }),
										children: Object.keys(STATUS).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: item,
											children: STATUS[item]
										}, item))
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
									label: "Stack",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: current.stack,
										onChange: (event) => updateProject(current.id, { stack: event.target.value })
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
								label: "Working notes",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
									value: current.notes,
									onChange: (event) => updateProject(current.id, { notes: event.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold uppercase tracking-widest text-faint",
									children: "Defects"
								}),
								bugs.filter((bug) => bug.projectId === current.id).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "No defects filed."
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 divide-y divide-line border-y border-line",
									children: bugs.filter((bug) => bug.projectId === current.id).map((bug) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between gap-3 py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: bug.open ? "" : "text-muted line-through",
											children: [
												bug.title,
												" · ",
												bug.severity
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "flex gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												onClick: () => updateBug(bug.id, { open: !bug.open }),
												children: bug.open ? "Close" : "Reopen"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "ghost",
												onClick: () => removeBug(bug.id),
												children: "Remove"
											})]
										})]
									}, bug.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: bugTitle,
										placeholder: "What broke",
										"aria-label": "Defect",
										onChange: (event) => setBugTitle(event.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											if (bugTitle.trim().length < 3) return;
											addBug({
												projectId: current.id,
												title: bugTitle.trim(),
												severity: "med"
											});
											setBugTitle("");
										},
										children: "File"
									})]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold uppercase tracking-widest text-faint",
									children: "Decisions"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2 space-y-2",
									children: decisions.filter((item) => item.projectId === current.id).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "border-t border-line py-2 text-sm",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-semibold",
												children: item.title
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-muted",
												children: item.choice
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												className: "mt-1 text-rust",
												onClick: () => removeTechDecision(item.id),
												children: "Remove"
											})
										]
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 grid gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: decisionTitle,
											placeholder: "Decision",
											"aria-label": "Decision title",
											onChange: (event) => setDecisionTitle(event.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
											value: choice,
											placeholder: "What you chose, and why",
											"aria-label": "Decision choice",
											onChange: (event) => setChoice(event.target.value)
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											onClick: () => {
												if (decisionTitle.trim().length < 3 || choice.trim().length < 3) return;
												addTechDecision({
													projectId: current.id,
													title: decisionTitle.trim(),
													choice: choice.trim(),
													date: kampalaToday()
												});
												setDecisionTitle("");
												setChoice("");
											},
											children: "Record decision"
										})
									]
								})
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-sm font-semibold uppercase tracking-widest text-faint",
									children: "Deploys"
								}),
								deploys.filter((item) => item.projectId === current.id).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-sm text-muted",
									children: "No deploy has been logged. Add one only after it happens."
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
									className: "mt-2",
									children: deploys.filter((item) => item.projectId === current.id).map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
										className: "flex items-center justify-between border-t border-line py-2 text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											item.at,
											" · ",
											item.env,
											" · ",
											item.note
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											onClick: () => removeDeploy(item.id),
											children: "Remove"
										})]
									}, item.id))
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-2 flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										value: deployNote,
										placeholder: "What shipped",
										"aria-label": "Deploy note",
										onChange: (event) => setDeployNote(event.target.value)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										onClick: () => {
											if (deployNote.trim().length < 2) return;
											addDeploy({
												projectId: current.id,
												env: "production",
												at: kampalaToday(),
												note: deployNote.trim()
											});
											setDeployNote("");
										},
										children: "Log deploy"
									})]
								})
							] })
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "No project selected.",
						body: "The lab index is empty."
					})
				})]
			})
		]
	});
}
var SplitComponent = LabView;
//#endregion
export { SplitComponent as component };
