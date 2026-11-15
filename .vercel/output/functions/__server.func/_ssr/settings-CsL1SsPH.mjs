import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, S as kampalaToday, a as Input, d as Textarea, i as Field, m as cn, o as Page, s as PageHead, t as Button } from "./ui-CJBsTUw5.mjs";
import { t as HOME_LABEL } from "./types-BoxosEJd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CsL1SsPH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsView() {
	const settings = useDesk((state) => state.settings);
	const patchSettings = useDesk((state) => state.patchSettings);
	const setTheme = useDesk((state) => state.setTheme);
	const setDensity = useDesk((state) => state.setDensity);
	const toggleHomeBlock = useDesk((state) => state.toggleHomeBlock);
	const clearSamples = useDesk((state) => state.clearSamples);
	const resetDesk = useDesk((state) => state.resetDesk);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [phrase, setPhrase] = (0, import_react.useState)("");
	const [confirmSamples, setConfirmSamples] = (0, import_react.useState)(false);
	const used = settings.aiDay === kampalaToday() ? settings.aiUsed : 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		width: "read",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHead, {
				kicker: "Office · Settings",
				title: "The desk, named properly.",
				lede: "CamOS is the operating desk. DanielMac is the professional name. Cam Leinad is the artist. Records stay on this device until you clear them."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4 border-t border-line pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "What the desk calls you",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.called,
							onChange: (event) => patchSettings({ called: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Legal name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.legalName,
							onChange: (event) => patchSettings({ legalName: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Professional name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.professional,
							onChange: (event) => patchSettings({ professional: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Artist name",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.artist,
							onChange: (event) => patchSettings({ artist: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Label",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: settings.label,
							onChange: (event) => patchSettings({ label: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Focus line",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: settings.focus,
							onChange: (event) => patchSettings({ focus: event.target.value })
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Changes save as you type, on this device."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Theme"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTheme("light"),
							className: cn("border px-4 py-4 text-left", settings.theme === "light" ? "border-ink" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: "Paper"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted",
								children: "Warm daylight. Ink text, brass marks."
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setTheme("dark"),
							className: cn("border px-4 py-4 text-left", settings.theme === "dark" ? "border-ink" : "border-line"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-semibold",
								children: "Ink"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm text-muted",
								children: "Charcoal ground, not pure black. Its own contrast."
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: settings.density === "regular" ? "primary" : "line",
							onClick: () => setDensity("regular"),
							children: "Regular density"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: settings.density === "compact" ? "primary" : "line",
							onClick: () => setDensity("compact"),
							children: "Compact"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Home blocks"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line border-y border-line",
					children: settings.homeOrder.map((id) => {
						const hidden = settings.hiddenHome.includes(id);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex min-h-12 items-center justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: HOME_LABEL[id] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => toggleHomeBlock(id),
								children: hidden ? "Show" : "Hide"
							})]
						}, id);
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Analyst"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						used,
						" of ",
						settings.aiLimit,
						" briefs used today. The cap is there so a stuck button cannot spend the account."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border-t border-line pt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Sample records"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "Sample jobs, the sample customer, and the sample quote are illustrations. Confirmed machines, the album, and the projects stay."
					}),
					confirmSamples ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								clearSamples();
								setConfirmSamples(false);
							},
							children: "Remove samples"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => setConfirmSamples(false),
							children: "Cancel"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						onClick: () => setConfirmSamples(true),
						children: "Clear sample shop records"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 border border-rust p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl text-rust",
						children: "Restore the opening desk"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm",
						children: "This deletes everything you have added on this device and reloads the opening records. Type RESET to enable it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "mt-3 max-w-xs",
						value: phrase,
						onChange: (event) => setPhrase(event.target.value),
						"aria-label": "Type RESET to confirm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-3",
						variant: "danger",
						disabled: phrase !== "RESET",
						onClick: () => {
							resetDesk();
							setPhrase("");
							flashMsg("Opening records restored.");
						},
						children: "Restore"
					})
				]
			})
		]
	});
}
var SplitComponent = SettingsView;
//#endregion
export { SplitComponent as component };
