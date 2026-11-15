import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, S as kampalaToday, b as formatTime, d as Textarea, f as buildSnapshot, o as Page, s as PageHead, t as Button } from "./ui-CJBsTUw5.mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/command-DqaoaaJ9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function asHistory(value) {
	if (!Array.isArray(value)) return [];
	const items = [];
	for (const entry of value.slice(-6)) {
		if (!entry || typeof entry !== "object") continue;
		const role = entry.role;
		const content = entry.content;
		if (role !== "user" && role !== "assistant" || typeof content !== "string") continue;
		const text = content.trim().slice(0, 1800);
		if (text) items.push({
			role,
			content: text
		});
	}
	return items;
}
var askDesk = createServerFn({ method: "POST" }).validator((input) => {
	if (!input || typeof input !== "object") throw new Error("Invalid request");
	const raw = input;
	const prompt = typeof raw.prompt === "string" ? raw.prompt.trim() : "";
	if (prompt.length < 2) throw new Error("Write a question first.");
	if (prompt.length > 4e3) throw new Error("That question is too long for one brief.");
	return {
		prompt,
		snapshot: typeof raw.snapshot === "string" ? raw.snapshot.slice(0, 4e3) : "",
		history: asHistory(raw.history)
	};
}).handler(createSsrRpc("72bd5bdd933b8d9af7f21a61c29c17c209fac4c4baeb0a9e47fc7cf0232b97b8"));
var PROMPTS = [
	"What should I finish before anything else, and what am I treating as urgent that is not?",
	"Is CAM-001 actually ready for RouteNote, or am I skipping a stage?",
	"Where can Classic Brand lose money if I trust the sample jobs?",
	"Which lab project is distracting me from the album and the shop?"
];
function CommandView() {
	const settings = useDesk((state) => state.settings);
	const memos = useDesk((state) => state.memos);
	const addMemo = useDesk((state) => state.addMemo);
	const clearMemos = useDesk((state) => state.clearMemos);
	const noteAiUse = useDesk((state) => state.noteAiUse);
	const [prompt, setPrompt] = (0, import_react.useState)("");
	const [pending, setPending] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const used = settings.aiDay === kampalaToday() ? settings.aiUsed : 0;
	const left = Math.max(0, settings.aiLimit - used);
	const snapshot = buildSnapshot(useDesk.getState());
	async function send() {
		const question = prompt.trim();
		if (question.length < 2 || pending) return;
		if (left <= 0) {
			setError("Today's eight briefs are used. The count resets at midnight in Kampala.");
			return;
		}
		setPending(true);
		setError("");
		const history = memos.slice(-6).map((memo) => ({
			role: memo.role,
			content: memo.text
		}));
		addMemo({
			role: "user",
			text: question
		});
		setPrompt("");
		try {
			const result = await askDesk({ data: {
				prompt: question,
				snapshot: buildSnapshot(useDesk.getState()),
				history
			} });
			if (!result.ok) {
				setError(result.error);
				return;
			}
			noteAiUse();
			addMemo({
				role: "assistant",
				text: result.text
			});
		} catch (err) {
			setError(err instanceof Error ? err.message : "The brief failed.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
		kicker: "Desk · Command",
		title: "A brief, not a chat.",
		lede: "The brief reads a summary of this desk and the question you send. It does not open your site, bank, repositories, or FL Studio."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:col-span-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: "Briefs today"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-display text-4xl tabular-nums",
					children: [used, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xl text-muted",
						children: [" / ", settings.aiLimit]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [left, " remaining. Resets at midnight, Africa/Kampala. Each brief is capped."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-2",
					children: PROMPTS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "block w-full border-t border-line py-3 text-left text-sm hover:text-accent",
						onClick: () => setPrompt(item),
						children: item
					}, item))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
					className: "mt-6 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
						className: "min-h-11 cursor-pointer font-semibold",
						children: "What will be sent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "mt-2 max-h-64 overflow-auto whitespace-pre-wrap border border-line bg-surface p-3 text-xs leading-relaxed text-muted",
						children: snapshot
					})]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "lg:col-span-8",
			children: [
				memos.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "border-t border-line py-6 text-sm text-muted",
					children: "No brief yet. Ask about the album, the shop, the lab, or the order of the day. Empty praise is a failed answer."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "border-t border-line",
					children: memos.map((memo) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "border-b border-line py-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs font-semibold uppercase tracking-widest text-faint",
							children: [
								memo.role === "user" ? settings.called : "Desk analyst",
								" · ",
								formatTime(memo.at)
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 whitespace-pre-wrap text-sm leading-relaxed",
							children: memo.text
						})]
					}, memo.id))
				}),
				error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-rust",
					role: "alert",
					children: error
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: prompt,
						onChange: (event) => setPrompt(event.target.value),
						placeholder: "Ask for a decision, not a compliment.",
						"aria-label": "Question for the desk analyst",
						maxLength: 4e3
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => void send(),
							disabled: pending || left <= 0,
							children: pending ? "Writing the brief…" : "Send brief"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => {
								clearMemos();
								setError("");
							},
							disabled: !memos.length || pending,
							children: "Clear correspondence"
						})]
					})]
				})
			]
		})]
	})] });
}
var SplitComponent = CommandView;
//#endregion
export { SplitComponent as component };
