import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, m as cn, o as Page, s as PageHead } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/learn-CwcBJv9H.js
var import_jsx_runtime = require_jsx_runtime();
function LearnView() {
	const paths = useDesk((state) => state.paths);
	const exercises = useDesk((state) => state.exercises);
	const notes = useDesk((state) => state.notes);
	const setPath = useDesk((state) => state.setPath);
	const answerExercise = useDesk((state) => state.answerExercise);
	const correct = exercises.filter((item) => item.picked !== null).filter((item) => item.picked === item.answer).length;
	const reading = notes.filter((note) => note.tags.some((tag) => tag.toLowerCase() === "reading"));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		width: "read",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
				kicker: "Records · Learning",
				title: "Study with a consequence.",
				lede: "Move a path when you have actually practiced. The questions check the rules this desk uses."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "divide-y divide-line border-y border-line",
				children: paths.map((path) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "py-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-baseline justify-between gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl",
								children: path.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums text-sm",
								children: [path.progress, "%"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: path.domain
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-3 block",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "sr-only",
								children: [path.title, " progress"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: 0,
								max: 100,
								step: 5,
								value: path.progress,
								onChange: (event) => setPath(path.id, { progress: Number(event.target.value) })
							})]
						})
					]
				}, path.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Reasoning"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm tabular-nums text-muted",
						children: [
							correct,
							" / ",
							exercises.length,
							" correct"
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "space-y-8",
					children: exercises.map((exercise, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-faint",
							children: ["Question ", index + 1]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-semibold",
							children: exercise.prompt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-2",
							children: exercise.choices.map((choice, choiceIndex) => {
								const picked = exercise.picked === choiceIndex;
								const show = exercise.picked !== null;
								const right = choiceIndex === exercise.answer;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: exercise.picked !== null,
									onClick: () => answerExercise(exercise.id, choiceIndex),
									className: cn("min-h-11 w-full border px-3 text-left text-sm", !show && "border-line hover:border-ink", show && right && "border-moss text-moss", show && picked && !right && "border-rust text-rust", show && !picked && !right && "border-line text-muted"),
									children: choice
								}) }, choice);
							})
						}),
						exercise.picked !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: exercise.explanation
						}) : null
					] }, exercise.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl",
					children: "Reading"
				}), reading.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No note is tagged reading. In the vault, add that tag to a note you are actually working through."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-2 text-sm",
					children: reading.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: note.title }, note.id))
				})]
			})
		]
	});
}
var SplitComponent = LearnView;
//#endregion
export { SplitComponent as component };
