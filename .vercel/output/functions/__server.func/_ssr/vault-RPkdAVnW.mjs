import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as useWarnUnsaved, P as useDesk, R as wikiTitles, S as kampalaToday, a as Input, c as Panel, d as Textarea, g as formatDay, i as Field, m as cn, o as Page, r as Empty, s as PageHead, t as Button } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vault-RPkdAVnW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VaultView() {
	const notes = useDesk((state) => state.notes);
	const updateNote = useDesk((state) => state.updateNote);
	const removeNote = useDesk((state) => state.removeNote);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const [query, setQuery] = (0, import_react.useState)("");
	const [tag, setTag] = (0, import_react.useState)("all");
	const [currentId, setCurrentId] = (0, import_react.useState)(notes[0]?.id ?? "");
	const [draft, setDraft] = (0, import_react.useState)("");
	const [title, setTitle] = (0, import_react.useState)("");
	const tags = ["all", ...new Set(notes.flatMap((note) => note.tags))];
	const shown = notes.filter((note) => {
		return `${note.title} ${note.body} ${note.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase()) && (tag === "all" || note.tags.includes(tag));
	});
	const current = notes.find((note) => note.id === currentId) ?? null;
	const dirty = current ? draft !== current.body || title !== current.title : false;
	useWarnUnsaved(dirty);
	(0, import_react.useEffect)(() => {
		if (focusId && notes.some((note) => note.id === focusId)) {
			setCurrentId(focusId);
			setFocus(null);
		}
	}, [
		focusId,
		notes,
		setFocus
	]);
	(0, import_react.useEffect)(() => {
		if (!current) return;
		setDraft(current.body);
		setTitle(current.title);
	}, [current]);
	const links = current ? notes.filter((note) => note.id !== current.id && wikiTitles(current.body).some((item) => item.toLowerCase() === note.title.toLowerCase())) : [];
	const backlinks = current ? notes.filter((note) => note.id !== current.id && wikiTitles(note.body).some((item) => item.toLowerCase() === current.title.toLowerCase())) : [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Records · Vault",
			title: "Notes that point at each other.",
			lede: "Link notes with [[Title]]. Tag a page fact or idea so the two stay distinct.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => openComposer("note"),
				children: "New note"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search notes",
						"aria-label": "Search notes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: tags.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setTag(item),
							className: cn("min-h-11 border px-3 text-sm", tag === item ? "border-ink bg-ink text-paper" : "border-line"),
							children: item
						}, item))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-4 divide-y divide-line border-y border-line",
						children: shown.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("w-full py-3 text-left", currentId === note.id && "border-l-2 border-brass pl-3"),
							onClick: () => setCurrentId(note.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: note.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-xs text-muted",
								children: [
									formatDay(note.updated),
									" · ",
									note.tags.join(", ") || "untagged"
								]
							})]
						}) }, note.id))
					}),
					shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: "No note matches."
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-8",
				children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Title",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (event) => setTitle(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Body",
						hint: dirty ? "Unsaved." : `Saved ${formatDay(current.updated)}.`,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-72",
							value: draft,
							onChange: (event) => setDraft(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => {
								updateNote(current.id, {
									title: title.trim() || current.title,
									body: draft,
									updated: kampalaToday()
								});
							},
							children: "Save note"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => removeNote(current.id),
							children: "Delete"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-6 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Connection, {
							title: "Points to",
							notes: links,
							onOpen: setCurrentId,
							empty: "No outgoing links."
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Connection, {
							title: "Pointed from",
							notes: backlinks,
							onOpen: setCurrentId,
							empty: "Nothing links here yet."
						})]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "The vault is empty.",
					body: "Start with a fact you would be angry to lose.",
					action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => openComposer("note"),
						children: "New note"
					})
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NotePanel, {
			open: composer === "note",
			onClose: closeComposer
		})
	] });
}
function Connection({ title, notes, onOpen, empty }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "text-xs font-semibold uppercase tracking-widest text-faint",
		children: title
	}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-sm text-muted",
		children: empty
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 border-t border-line",
		children: notes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "min-h-11 text-sm text-accent",
			onClick: () => onOpen(note.id),
			children: note.title
		}) }, note.id))
	})] });
}
function NotePanel({ open, onClose }) {
	const addNote = useDesk((state) => state.addNote);
	const [title, setTitle] = (0, import_react.useState)("");
	const [body, setBody] = (0, import_react.useState)("");
	const [tags, setTags] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New note",
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
					label: "Tags",
					hint: "Comma separated. Use reading, confirmed, or shop.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: tags,
						onChange: (event) => setTags(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Body",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: body,
						onChange: (event) => setBody(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						if (title.trim().length < 2) {
							setError("The note needs a title.");
							return;
						}
						addNote({
							title: title.trim(),
							body,
							tags: tags.split(",").map((tag) => tag.trim()).filter(Boolean)
						});
						setTitle("");
						setBody("");
						setTags("");
						setError("");
						onClose();
					},
					children: "Save note"
				})
			]
		})
	});
}
var SplitComponent = VaultView;
//#endregion
export { SplitComponent as component };
