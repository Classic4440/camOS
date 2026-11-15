import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, a as Input, c as Panel, d as Textarea, i as Field, m as cn, o as Page, r as Empty, s as PageHead, t as Button } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ideas-BW2nCzfp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS = {
	raw: "Raw",
	testing: "Testing",
	committed: "Committed",
	shelved: "Shelved"
};
function IdeasView() {
	const ideas = useDesk((state) => state.ideas);
	const updateIdea = useDesk((state) => state.updateIdea);
	const removeIdea = useDesk((state) => state.removeIdea);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const [filter, setFilter] = (0, import_react.useState)("all");
	(0, import_react.useEffect)(() => {
		if (focusId && ideas.some((idea) => idea.id === focusId)) setFocus(null);
	}, [
		focusId,
		ideas,
		setFocus
	]);
	const shown = ideas.filter((idea) => filter === "all" || idea.status === filter);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Records · Ideas",
			title: "Score it before you love it.",
			lede: "Each sheet keeps a thesis, the risks, a score out of ten, and a status.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => openComposer("idea"),
				children: "New idea"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-6 flex flex-wrap gap-2",
			children: [
				"all",
				"raw",
				"testing",
				"committed",
				"shelved"
			].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setFilter(item),
				className: cn("min-h-11 border px-3 text-sm", filter === item ? "border-ink bg-ink text-paper" : "border-line"),
				children: item === "all" ? "All" : STATUS[item]
			}, item))
		}),
		shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: "No ideas on this desk.",
			body: "Write the thesis in one or two sentences. If you cannot name the risk, it is not ready to build.",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => openComposer("idea"),
				children: "Start a sheet"
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "space-y-6",
			children: shown.map((idea) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border border-line bg-elevated",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-3 border-b border-dashed border-line px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: idea.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-2xl tabular-nums",
						children: [idea.score, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-base text-muted",
							children: " / 10"
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 px-4 py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm leading-relaxed",
							children: idea.thesis
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Risks",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								value: idea.risks,
								onChange: (event) => updateIdea(idea.id, { risks: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Next physical step",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: idea.next,
								onChange: (event) => updateIdea(idea.id, { next: event.target.value })
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-1",
							role: "group",
							"aria-label": "Score",
							children: Array.from({ length: 10 }, (_, index) => index + 1).map((score) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								"aria-pressed": idea.score === score,
								onClick: () => updateIdea(idea.id, { score }),
								className: cn("inline-flex size-11 items-center justify-center border text-sm tabular-nums", idea.score === score ? "border-ink bg-ink text-paper" : "border-line"),
								children: score
							}, score))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [Object.keys(STATUS).map((status) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => updateIdea(idea.id, { status }),
								className: cn("min-h-11 border px-3 text-sm", idea.status === status ? "border-brass text-brass" : "border-line text-muted"),
								children: STATUS[status]
							}, status)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => removeIdea(idea.id),
								children: "Delete"
							})]
						})
					]
				})]
			}, idea.id))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(IdeaPanel, {
			open: composer === "idea",
			onClose: closeComposer
		})
	] });
}
function IdeaPanel({ open, onClose }) {
	const addIdea = useDesk((state) => state.addIdea);
	const [title, setTitle] = (0, import_react.useState)("");
	const [thesis, setThesis] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New idea",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Title (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: title,
						onChange: (event) => setTitle(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Thesis",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: thesis,
						onChange: (event) => setThesis(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						if (title.trim().length < 2) {
							setError("Name the idea.");
							return;
						}
						addIdea({
							title: title.trim(),
							thesis: thesis.trim(),
							risks: "",
							next: "",
							score: 5,
							status: "raw"
						});
						setTitle("");
						setThesis("");
						setError("");
						onClose();
					},
					children: "Open sheet"
				})
			]
		})
	});
}
var SplitComponent = IdeasView;
//#endregion
export { SplitComponent as component };
