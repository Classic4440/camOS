import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, a as Input, c as Panel, d as Textarea, g as formatDay, i as Field, l as Select, m as cn, n as DataTable, o as Page, r as Empty, s as PageHead, t as Button, u as Stamp, x as isLate } from "./ui-CJBsTUw5.mjs";
import { n as HOUSE_LABEL } from "./types-BoxosEJd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/personal-r4iTQwmJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HOUSES = Object.keys(HOUSE_LABEL);
function PersonalView() {
	const tasks = useDesk((state) => state.tasks);
	const decisions = useDesk((state) => state.decisions);
	const composer = useDesk((state) => state.composer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const openComposer = useDesk((state) => state.openComposer);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const updateTask = useDesk((state) => state.updateTask);
	const removeTasks = useDesk((state) => state.removeTasks);
	const completeTasks = useDesk((state) => state.completeTasks);
	const updateDecision = useDesk((state) => state.updateDecision);
	const removeDecision = useDesk((state) => state.removeDecision);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [house, setHouse] = (0, import_react.useState)("all");
	const [status, setStatus] = (0, import_react.useState)("open");
	const [selected, setSelected] = (0, import_react.useState)([]);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!focusId || !tasks.some((task) => task.id === focusId)) return;
		setSelected([focusId]);
		setStatus("all");
		setFocus(null);
	}, [
		focusId,
		tasks,
		setFocus
	]);
	const rows = tasks.filter((task) => (house === "all" || task.house === house) && (status === "all" || (status === "done" ? task.done : !task.done)));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Desk · Personal",
			title: "What is actually on you.",
			lede: "Open work is listed first. A decision stays in its own list, under the tasks.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => openComposer("task"),
				children: "New task"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => openComposer("decision"),
				children: "New decision"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 space-y-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				role: "group",
				"aria-label": "Task status",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						label: "Open",
						active: status === "open",
						onClick: () => setStatus("open")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						label: "Done",
						active: status === "done",
						onClick: () => setStatus("done")
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
						label: "All tasks",
						active: status === "all",
						onClick: () => setStatus("all")
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2 overflow-x-auto",
				role: "group",
				"aria-label": "House",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					label: "All houses",
					active: house === "all",
					onClick: () => setHouse("all")
				}), HOUSES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
					label: HOUSE_LABEL[item],
					active: house === item,
					onClick: () => setHouse(item)
				}, item))]
			})]
		}),
		selected.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-wrap items-center gap-2 border border-line bg-surface px-3 py-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm tabular-nums",
					children: [selected.length, " selected"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: () => {
						completeTasks(selected);
						setSelected([]);
						flashMsg("Marked done.");
					},
					children: "Mark done"
				}),
				confirmDelete ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-rust",
						children: "Delete these tasks?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => {
							removeTasks(selected);
							setSelected([]);
							setConfirmDelete(false);
							flashMsg("Tasks deleted.");
						},
						children: "Delete"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => setConfirmDelete(false),
						children: "Keep"
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => setConfirmDelete(true),
					children: "Delete"
				})
			]
		}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
			rows,
			selected,
			onSelected: setSelected,
			selectable: true,
			searchText: (task) => `${task.title} ${task.notes} ${task.house}`,
			empty: {
				title: "No tasks in this cut.",
				body: "Add the next real obligation, or switch the filter."
			},
			columns: [
				{
					id: "title",
					header: "Task",
					sortValue: (task) => task.title,
					cell: (task) => task.title
				},
				{
					id: "house",
					header: "House",
					optional: true,
					sortValue: (task) => task.house,
					cell: (task) => HOUSE_LABEL[task.house]
				},
				{
					id: "priority",
					header: "Priority",
					sortValue: (task) => task.priority,
					cell: (task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "uppercase tracking-wide",
						children: task.priority
					})
				},
				{
					id: "due",
					header: "Due",
					align: "right",
					sortValue: (task) => task.due ?? "9999",
					cell: (task) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: isLate(task.due, task.done) ? "text-rust" : void 0,
						children: [formatDay(task.due), task.done ? " · done" : ""]
					})
				},
				{
					id: "act",
					header: "",
					cell: (task) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "min-h-11 text-sm font-semibold text-accent",
						onClick: () => updateTask(task.id, { done: !task.done }),
						children: task.done ? "Reopen" : "Done"
					})
				}
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-12",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Decisions"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-4 max-w-2xl text-sm text-muted",
					children: "Write the question, the context, and — when you choose — the choice. Deferred is allowed. Pretending it is settled is not."
				}),
				decisions.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No open questions recorded.",
					body: "A decision record is useful when two houses are competing for the same afternoon.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => openComposer("decision"),
						children: "Record a decision"
					})
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line border-y border-line",
					children: decisions.map((decision) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "py-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-start justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "max-w-2xl font-semibold",
									children: decision.question
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
									tone: decision.status === "open" ? "brass" : decision.status === "made" ? "moss" : "neutral",
									children: decision.status
								})]
							}),
							decision.context ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
								children: decision.context
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 grid gap-3 md:grid-cols-[12rem_1fr_auto]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										"aria-label": "Decision status",
										value: decision.status,
										onChange: (event) => updateDecision(decision.id, { status: event.target.value }),
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "open",
												children: "Open"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "made",
												children: "Made"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "deferred",
												children: "Deferred"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										"aria-label": "Choice",
										value: decision.choice,
										placeholder: "The choice, if made",
										onChange: (event) => updateDecision(decision.id, { choice: event.target.value })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "danger",
										onClick: () => removeDecision(decision.id),
										children: "Remove"
									})
								]
							})
						]
					}, decision.id))
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TaskPanel, {
			open: composer === "task",
			onClose: closeComposer
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DecisionPanel, {
			open: composer === "decision",
			onClose: closeComposer
		})
	] });
}
function Filter({ label, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("min-h-11 shrink-0 border px-3 text-sm", active ? "border-ink bg-ink text-paper" : "border-line bg-elevated text-ink"),
		children: label
	});
}
function TaskPanel({ open, onClose }) {
	const addTask = useDesk((state) => state.addTask);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [title, setTitle] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [house, setHouse] = (0, import_react.useState)("personal");
	const [priority, setPriority] = (0, import_react.useState)("next");
	const [due, setDue] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	function save() {
		if (title.trim().length < 2) {
			setError("Give the task a real name.");
			return;
		}
		addTask({
			title: title.trim(),
			notes: notes.trim(),
			house,
			priority,
			due: due || null
		});
		setTitle("");
		setNotes("");
		setDue("");
		setError("");
		flashMsg("Task saved on this device.");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New task",
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
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: notes,
						onChange: (event) => setNotes(event.target.value)
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
					label: "Priority",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: priority,
						onChange: (event) => setPriority(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "now",
								children: "Now"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "next",
								children: "Next"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "later",
								children: "Later"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Due",
					hint: "Leave blank if it has no date.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: due,
						onChange: (event) => setDue(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: save,
					children: "Save task"
				})
			]
		})
	});
}
function DecisionPanel({ open, onClose }) {
	const addDecision = useDesk((state) => state.addDecision);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [question, setQuestion] = (0, import_react.useState)("");
	const [context, setContext] = (0, import_react.useState)("");
	const [house, setHouse] = (0, import_react.useState)("personal");
	const [error, setError] = (0, import_react.useState)("");
	function save() {
		if (question.trim().length < 8) {
			setError("Write the question in a full sentence.");
			return;
		}
		addDecision({
			question: question.trim(),
			context: context.trim(),
			house,
			status: "open",
			choice: ""
		});
		setQuestion("");
		setContext("");
		setError("");
		flashMsg("Decision recorded.");
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New decision",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Question (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: question,
						onChange: (event) => setQuestion(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Context",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: context,
						onChange: (event) => setContext(event.target.value)
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: save,
					children: "Save decision"
				})
			]
		})
	});
}
var SplitComponent = PersonalView;
//#endregion
export { SplitComponent as component };
