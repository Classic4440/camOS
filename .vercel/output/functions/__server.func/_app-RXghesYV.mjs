import { i as __toESM } from "./_runtime.mjs";
import { n as require_react } from "./_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "./_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, o as DialogTitle, r as DialogContent, t as Dialog } from "./_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Menu, i as Moon, n as Sun, r as Search, t as X } from "./_libs/lucide-react.mjs";
import { M as searchDesk, P as useDesk, _ as formatLongToday, a as Input, m as cn, t as Button } from "./_ssr/ui-CJBsTUw5.mjs";
import { b as Link, g as Outlet, p as useRouterState, x as useNavigate } from "./_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_app-RXghesYV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var PRIMARY = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/command",
		label: "Brief"
	},
	{
		href: "/personal",
		label: "Tasks"
	},
	{
		href: "/music",
		label: "Cam Leinad"
	},
	{
		href: "/brand",
		label: "Classic Brand"
	},
	{
		href: "/lab",
		label: "Lab"
	},
	{
		href: "/finance",
		label: "Ledger"
	}
];
var LIBRARY = [
	{
		href: "/trading",
		label: "Trading"
	},
	{
		href: "/learn",
		label: "Learning"
	},
	{
		href: "/vault",
		label: "Vault"
	},
	{
		href: "/ideas",
		label: "Ideas"
	},
	{
		href: "/marketing",
		label: "Marketing"
	},
	{
		href: "/analytics",
		label: "Analytics"
	},
	{
		href: "/settings",
		label: "Settings"
	}
];
var PLACES = [...PRIMARY, ...LIBRARY];
var DOCK = [
	{
		href: "/",
		label: "Home"
	},
	{
		href: "/music",
		label: "Music"
	},
	{
		href: "/brand",
		label: "Shop"
	},
	{
		href: "/lab",
		label: "Lab"
	}
];
var GO = {
	h: "/",
	c: "/command",
	p: "/personal",
	m: "/music",
	b: "/brand",
	l: "/lab",
	f: "/finance",
	t: "/trading",
	v: "/vault",
	s: "/settings"
};
function Shell({ children }) {
	const navigate = useNavigate();
	const pathname = useRouterState({ select: (state) => state.location.pathname });
	const theme = useDesk((state) => state.settings.theme);
	const setTheme = useDesk((state) => state.setTheme);
	const flash = useDesk((state) => state.flash);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [palette, setPalette] = (0, import_react.useState)(false);
	const [help, setHelp] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMenu(false);
	}, [pathname]);
	(0, import_react.useEffect)(() => {
		const apply = () => {
			const settings = useDesk.getState().settings;
			document.documentElement.setAttribute("data-theme", settings.theme);
			document.documentElement.setAttribute("data-density", settings.density);
			document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", settings.theme === "dark" ? "#141210" : "#f3efe6");
		};
		if (useDesk.persist.hasHydrated()) apply();
		const unsub = useDesk.persist.onFinishHydration(apply);
		useDesk.persist.rehydrate();
		return unsub;
	}, []);
	(0, import_react.useEffect)(() => {
		let armed = false;
		let timer = 0;
		function onKey(event) {
			if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				setPalette(true);
				return;
			}
			const target = event.target;
			if (!!target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT" || target.isContentEditable)) return;
			if (event.key === "/") {
				event.preventDefault();
				setPalette(true);
				return;
			}
			if (event.key === "?") {
				event.preventDefault();
				setHelp((open) => !open);
				return;
			}
			if (event.key === "g") {
				armed = true;
				window.clearTimeout(timer);
				timer = window.setTimeout(() => {
					armed = false;
				}, 800);
				return;
			}
			if (!armed) return;
			armed = false;
			const path = GO[event.key.toLowerCase()];
			if (!path) return;
			event.preventDefault();
			navigate({ to: path });
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [navigate]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-dvh flex-col bg-paper text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#desk",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-paper",
				children: "Skip to the desk"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "flex h-14 shrink-0 items-center gap-2 border-b border-line px-2 md:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-11 items-center justify-center md:hidden",
						"aria-label": "Open index",
						onClick: () => setMenu(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {
							className: "size-5",
							strokeWidth: 1.75
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "font-display text-xl leading-none tracking-tight",
						children: ["Cam", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-brass",
							children: "OS"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "hidden min-w-0 items-baseline gap-2 truncate text-sm text-muted sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": true,
							className: "text-faint",
							children: "/"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "truncate text-ink",
							children: placeFor(pathname)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "ml-auto hidden text-sm text-muted lg:block",
						children: formatLongToday()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-1 lg:ml-4",
						children: [
							flash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "hidden max-w-40 truncate text-sm text-moss xl:block",
								children: flash
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPalette(true),
								className: "inline-flex h-11 items-center gap-2 border border-line bg-elevated px-3 text-sm text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
										className: "size-4",
										strokeWidth: 1.75
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "Search"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("kbd", {
										className: "hidden border border-line px-1.5 py-0.5 text-xs text-faint md:inline",
										children: "⌘K"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "inline-flex size-11 items-center justify-center",
								"aria-label": theme === "dark" ? "Use the paper theme" : "Use the ink theme",
								onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
								children: theme === "dark" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sun, {
									className: "size-4",
									strokeWidth: 1.75
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Moon, {
									className: "size-4",
									strokeWidth: 1.75
								})
							})
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden w-56 shrink-0 flex-col overflow-y-auto border-r border-line md:flex",
					"aria-label": "Desk index",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Index, { pathname })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					id: "desk",
					className: "min-w-0 flex-1 overflow-y-auto pb-16 md:pb-0",
					children
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileDock, {
				pathname,
				onIndex: () => setMenu(true)
			}),
			menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MobileIndex, {
				pathname,
				onClose: () => setMenu(false)
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Palette, {
				open: palette,
				onClose: () => setPalette(false)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Help, {
				open: help,
				onClose: () => setHelp(false)
			})
		]
	});
}
function placeFor(pathname) {
	return PLACES.find((item) => item.href === "/" ? pathname === "/" : pathname === item.href || pathname.startsWith(`${item.href}/`))?.label ?? "CamOS";
}
function isCurrent(pathname, href) {
	return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}
function Index({ pathname, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-full flex-col py-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: PRIMARY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
				item,
				pathname,
				onNavigate
			}, item.href)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-4 pb-1 pt-6 text-xs font-semibold uppercase tracking-widest text-faint",
				children: "Library"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: LIBRARY.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavItem, {
				item,
				pathname,
				onNavigate,
				quiet: true
			}, item.href)) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-auto border-t border-line px-4 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-sm",
					children: "Cam Leinad"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted",
					children: "Classic Brand · Matugga"
				})]
			})
		]
	});
}
function NavItem({ item, pathname, onNavigate, quiet = false }) {
	const active = isCurrent(pathname, item.href);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: item.href,
		onClick: onNavigate,
		"aria-current": active ? "page" : void 0,
		className: cn("flex min-h-11 items-center border-l-2 px-4 text-sm", active ? "border-brass bg-surface font-semibold text-ink" : quiet ? "border-transparent text-muted hover:bg-surface hover:text-ink" : "border-transparent text-ink hover:bg-surface"),
		children: item.label
	}) });
}
function MobileDock({ pathname, onIndex }) {
	const inDock = DOCK.some((item) => isCurrent(pathname, item.href));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		className: "fixed inset-x-0 bottom-0 z-30 grid h-14 grid-cols-5 border-t border-line bg-paper md:hidden",
		"aria-label": "Workspaces",
		children: [DOCK.map((item) => {
			const active = isCurrent(pathname, item.href);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: item.href,
				"aria-current": active ? "page" : void 0,
				className: cn("flex items-center justify-center border-t-2 text-xs font-semibold", active ? "border-brass text-ink" : "border-transparent text-muted"),
				children: item.label
			}, item.href);
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: onIndex,
			className: cn("flex items-center justify-center border-t-2 text-xs font-semibold", inDock ? "border-transparent text-muted" : "border-brass text-ink"),
			children: "Index"
		})]
	});
}
function MobileIndex({ pathname, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "fixed inset-0 z-40 md:hidden",
		style: { background: "var(--scrim)" },
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "panel-in flex h-full w-full max-w-sm flex-col bg-paper",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex h-14 items-center justify-between border-b border-line px-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-2 font-display text-xl",
					children: ["Cam", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-brass",
						children: "OS"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "inline-flex size-11 items-center justify-center",
					"aria-label": "Close index",
					onClick: onClose,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Index, {
					pathname,
					onNavigate: onClose
				})
			})]
		})
	});
}
function Palette({ open, onClose }) {
	const navigate = useNavigate();
	const [query, setQuery] = (0, import_react.useState)("");
	const openComposer = useDesk((state) => state.openComposer);
	const setFocus = useDesk((state) => state.setFocus);
	const desk = useDesk();
	const hits = (0, import_react.useMemo)(() => query.trim() ? searchDesk(desk, query) : [], [desk, query]);
	(0, import_react.useEffect)(() => {
		if (!open) setQuery("");
	}, [open]);
	function go(hit) {
		setFocus(hit.focusId);
		navigate({ to: hit.href });
		onClose();
	}
	function create(kind, href) {
		openComposer(kind);
		navigate({ to: href });
		onClose();
	}
	const shownActions = [
		[
			"New task",
			"task",
			"/personal"
		],
		[
			"New decision",
			"decision",
			"/personal"
		],
		[
			"New release",
			"release",
			"/music"
		],
		[
			"New job",
			"order",
			"/brand"
		],
		[
			"New quote",
			"quote",
			"/brand"
		],
		[
			"New ledger entry",
			"txn",
			"/finance"
		],
		[
			"New trade",
			"trade",
			"/trading"
		],
		[
			"New note",
			"note",
			"/vault"
		],
		[
			"New idea",
			"idea",
			"/ideas"
		],
		[
			"New campaign",
			"campaign",
			"/marketing"
		]
	].filter((item) => item[0].toLowerCase().includes(query.trim().toLowerCase()));
	const places = PLACES.filter((item) => item.label.toLowerCase().includes(query.trim().toLowerCase()));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
			className: "fixed inset-0 z-50",
			style: { background: "var(--scrim)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "panel-in fixed inset-x-3 bottom-16 top-16 z-50 mx-auto flex max-w-xl flex-col overflow-hidden border border-line bg-elevated md:inset-x-auto md:w-full",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "sr-only",
					children: "Search the desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "border-b border-line p-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						autoFocus: true,
						value: query,
						onChange: (event) => setQuery(event.target.value),
						placeholder: "Search records, or jump",
						"aria-label": "Search records"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-h-0 flex-1 overflow-y-auto p-2",
					children: [
						query.trim() && hits.length === 0 && shownActions.length === 0 && places.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-2 py-6 text-sm text-muted",
							children: "Nothing on the desk matches that."
						}) : null,
						places.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
							label: "Go",
							children: places.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center px-2 text-left text-sm hover:bg-surface",
								onClick: () => {
									navigate({ to: item.href });
									onClose();
								},
								children: item.label
							}, item.href))
						}) : null,
						shownActions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
							label: "Create",
							children: shownActions.map(([label, kind, href]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-center px-2 text-left text-sm hover:bg-surface",
								onClick: () => create(kind, href),
								children: label
							}, label))
						}) : null,
						hits.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Group, {
							label: "Records",
							children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "flex min-h-11 w-full items-baseline gap-3 px-2 text-left hover:bg-surface",
								onClick: () => go(hit),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold uppercase tracking-widest text-faint",
									children: hit.kicker
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-sm",
									children: hit.title
								})]
							}, `${hit.href}-${hit.focusId}`))
						}) : null
					]
				})
			]
		})] })
	});
}
function Group({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-widest text-faint",
			children: label
		}), children]
	});
}
function Help({ open, onClose }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
			className: "fixed inset-0 z-50",
			style: { background: "var(--scrim)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "panel-in fixed inset-x-3 top-20 z-50 mx-auto max-w-md border border-line bg-elevated p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl",
					children: "Shortcuts"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					onClick: onClose,
					"aria-label": "Close shortcuts",
					children: "Close"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "divide-y divide-line border-t border-line text-sm",
				children: [
					["Ctrl or ⌘ K, or /", "Search and jump"],
					["?", "Show or hide these shortcuts"],
					["G then H", "Home"],
					["G then C", "Command"],
					["G then M", "Cam Leinad"],
					["G then B", "Classic Brand"],
					["G then L", "Lab"],
					["G then F", "Finance"],
					["G then T", "Trading"],
					["G then V", "Vault"],
					["G then S", "Settings"]
				].map(([key, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-4 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-muted",
						children: key
					})]
				}, key))
			})]
		})] })
	});
}
var SplitComponent = function AppLayout() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) });
};
//#endregion
export { SplitComponent as component };
