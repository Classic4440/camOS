import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, a as Input, c as Panel, d as Textarea, g as formatDay, i as Field, l as Select, o as Page, r as Empty, s as PageHead, t as Button } from "./ui-CJBsTUw5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/marketing-BxtaseAF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MarketingView() {
	const campaigns = useDesk((state) => state.campaigns);
	const updateCampaign = useDesk((state) => state.updateCampaign);
	const removeCampaign = useDesk((state) => state.removeCampaign);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
			kicker: "Office · Marketing",
			title: "Two audiences, two calendars.",
			lede: "Listeners and garment clients stay on separate calendars.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "primary",
				onClick: () => openComposer("campaign"),
				children: "New campaign"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
				title: "Cam Leinad",
				rows: campaigns.filter((item) => item.house === "music"),
				onStatus: updateCampaign,
				onRemove: removeCampaign
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
				title: "Classic Brand",
				rows: campaigns.filter((item) => item.house === "brand"),
				onStatus: updateCampaign,
				onRemove: removeCampaign
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CampaignPanel, {
			open: composer === "campaign",
			onClose: closeComposer
		})
	] });
}
function Calendar({ title, rows, onStatus, onRemove }) {
	const ordered = [...rows].sort((a, b) => a.start.localeCompare(b.start));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
		className: "border-t border-ink pt-3 font-display text-2xl",
		children: title
	}), ordered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "No campaign dated.",
		body: "Add one when there is a channel, a start, and an end. An undated wish is not a plan."
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "mt-4 border-t border-line",
		children: ordered.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "border-b border-line py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs uppercase tracking-widest text-faint",
					children: [
						formatDay(row.start),
						" — ",
						formatDay(row.end)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-semibold",
					children: row.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [row.channel, row.note ? ` · ${row.note}` : ""]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						"aria-label": "Campaign status",
						value: row.status,
						onChange: (event) => onStatus(row.id, { status: event.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "planned",
								children: "Planned"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "live",
								children: "Live"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "done",
								children: "Done"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => onRemove(row.id),
						children: "Remove"
					})]
				})
			]
		}, row.id))
	})] });
}
function CampaignPanel({ open, onClose }) {
	const addCampaign = useDesk((state) => state.addCampaign);
	const [house, setHouse] = (0, import_react.useState)("music");
	const [name, setName] = (0, import_react.useState)("");
	const [channel, setChannel] = (0, import_react.useState)("");
	const [start, setStart] = (0, import_react.useState)("");
	const [end, setEnd] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New campaign",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "House",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: house,
						onChange: (event) => setHouse(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "music",
							children: "Cam Leinad"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "brand",
							children: "Classic Brand"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: name,
						onChange: (event) => setName(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Channel",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: channel,
						onChange: (event) => setChannel(event.target.value),
						placeholder: "RouteNote, Instagram, shop front"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Start",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: start,
						onChange: (event) => setStart(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "End",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: end,
						onChange: (event) => setEnd(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Note",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: note,
						onChange: (event) => setNote(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						if (name.trim().length < 2 || !start || !end || end < start) {
							setError("Name the campaign and give it a real date range.");
							return;
						}
						addCampaign({
							house,
							name: name.trim(),
							channel: channel.trim(),
							start,
							end,
							status: "planned",
							note: note.trim()
						});
						setName("");
						setChannel("");
						setNote("");
						setError("");
						onClose();
					},
					children: "Save campaign"
				})
			]
		})
	});
}
var SplitComponent = MarketingView;
//#endregion
export { SplitComponent as component };
