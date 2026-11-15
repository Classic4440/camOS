import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { F as useWarnUnsaved, P as useDesk, S as kampalaToday, T as parseAmount, a as Input, c as Panel, d as Textarea, g as formatDay, i as Field, k as royaltyTotals, l as Select, m as cn, o as Page, r as Empty, t as Button, v as formatMoney } from "./ui-CJBsTUw5.mjs";
import { a as RELEASE_STAGES, o as RELEASE_STAGE_LABEL } from "./types-BoxosEJd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/music-DC0is0Hl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MusicView() {
	const releases = useDesk((state) => state.releases);
	const settings = useDesk((state) => state.settings);
	useDesk((state) => state.sessions);
	useDesk((state) => state.royalties);
	const composer = useDesk((state) => state.composer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const openComposer = useDesk((state) => state.openComposer);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const [currentId, setCurrentId] = (0, import_react.useState)(releases[0]?.id ?? "");
	const [stageFilter, setStageFilter] = (0, import_react.useState)("all");
	const [dirty, setDirty] = (0, import_react.useState)(false);
	const [pendingId, setPendingId] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (focusId && releases.some((release) => release.id === focusId)) {
			setCurrentId(focusId);
			setFocus(null);
		}
	}, [
		focusId,
		releases,
		setFocus
	]);
	(0, import_react.useEffect)(() => {
		if (currentId && releases.some((release) => release.id === currentId)) return;
		setCurrentId(releases[0]?.id ?? "");
	}, [releases, currentId]);
	const counts = Object.fromEntries(RELEASE_STAGES.map((stage) => [stage, releases.filter((release) => release.stage === stage).length]));
	const shown = releases.filter((release) => stageFilter === "all" || release.stage === stageFilter);
	const current = releases.find((release) => release.id === currentId) ?? null;
	function askSelect(id) {
		if (id === currentId) return;
		if (dirty) {
			setPendingId(id);
			return;
		}
		setCurrentId(id);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, {
		mark: "brass",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-xs font-semibold uppercase tracking-widest text-faint",
						children: ["CAM · ", settings.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-3xl font-medium leading-tight",
						children: settings.artist
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 max-w-xl text-sm text-muted",
						children: [
							settings.genres.join(" · "),
							". ",
							settings.daw,
							"."
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => openComposer("release"),
					children: "New release"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				"aria-label": "Cam Leinad sections",
				className: "mb-4 flex gap-1 overflow-x-auto border-b border-line",
				children: [
					["#catalog", "Catalog"],
					["#sessions", "Sessions"],
					["#royalties", "Royalties"]
				].map(([href, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href,
					className: "inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted hover:text-ink",
					children: label
				}, href))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageFilter, {
				current: stageFilter,
				counts,
				onPick: setStageFilter
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: "catalog",
				className: "grid scroll-mt-4 gap-8 lg:grid-cols-12",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7",
					children: [shown.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "Nothing in this stage.",
						body: "Clear the stage filter or add a release."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "grid gap-4 sm:grid-cols-2",
						children: shown.map((release) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sleeve, {
							release,
							active: currentId === release.id,
							onSelect: () => askSelect(release.id)
						}) }, release.id))
					}), pendingId ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-rust",
						role: "alert",
						children: [
							"Lyrics are unsaved.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "font-semibold underline",
								onClick: () => setPendingId(null),
								children: "Stay"
							})
						]
					}) : null]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "lg:col-span-5",
					children: current ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Liner, {
						releaseId: current.id,
						onDirty: setDirty,
						discardTo: pendingId,
						onDiscard: () => {
							if (pendingId) setCurrentId(pendingId);
							setPendingId(null);
							setDirty(false);
						}
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
						title: "The catalog is empty.",
						body: "CAM-001 should live here once you add it. Start with the title you are actually finishing."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sessions, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Royalties, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReleasePanel, {
				open: composer === "release",
				onClose: closeComposer
			})
		]
	});
}
function StageFilter({ current, counts, onPick }) {
	const stages = [{
		id: "all",
		label: "All"
	}, ...RELEASE_STAGES.map((id) => ({
		id,
		label: RELEASE_STAGE_LABEL[id]
	}))];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-5 flex gap-1 overflow-x-auto",
		role: "tablist",
		"aria-label": "Release stage",
		children: stages.map((stage) => {
			const active = current === stage.id;
			const count = stage.id === "all" ? null : counts[stage.id] ?? 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				role: "tab",
				"aria-selected": active,
				onClick: () => onPick(stage.id),
				className: cn("inline-flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm", active ? "bg-ink text-paper" : "text-muted hover:text-ink"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-semibold",
					children: stage.label
				}), count !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums",
					children: count
				}) : null]
			}, stage.id);
		})
	});
}
function Sleeve({ release, active, onSelect }) {
	const album = release.kind === "album";
	const ep = release.kind === "ep";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: onSelect,
		className: cn("relative flex aspect-square w-full flex-col justify-between overflow-hidden p-4 text-left", album ? "bg-catalog pl-6 text-catalog-ink" : "border border-ink bg-elevated text-ink", ep && "pt-6", active && "outline outline-2 outline-brass"),
		children: [
			album ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-y-0 left-0 w-2 bg-sleeve",
				"aria-hidden": true
			}) : null,
			ep ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute inset-x-0 top-0 h-2 bg-catalog",
				"aria-hidden": true
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: cn("flex items-center justify-between text-xs font-semibold uppercase tracking-widest", album ? "text-catalog-ink" : "text-muted"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "CAM" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: album ? "text-sleeve" : void 0,
					children: release.catalog
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "block font-display text-2xl leading-tight",
				children: release.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: cn("mt-2 block text-xs uppercase tracking-widest", album ? "text-catalog-ink" : "text-faint"),
				children: release.kind
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-end justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("text-sm tabular-nums", album ? "text-catalog-ink" : "text-muted"),
					children: [
						release.tracks.length,
						" ",
						release.tracks.length === 1 ? "track" : "tracks"
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide", album ? "border-sleeve text-sleeve" : "border-line text-muted"),
					children: RELEASE_STAGE_LABEL[release.stage]
				})]
			})
		]
	});
}
function Liner({ releaseId, onDirty, discardTo, onDiscard }) {
	const release = useDesk((state) => state.releases.find((item) => item.id === releaseId));
	const updateRelease = useDesk((state) => state.updateRelease);
	const removeRelease = useDesk((state) => state.removeRelease);
	const addTrack = useDesk((state) => state.addTrack);
	const updateTrack = useDesk((state) => state.updateTrack);
	const removeTrack = useDesk((state) => state.removeTrack);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [lyrics, setLyrics] = (0, import_react.useState)(release?.lyrics ?? "");
	const [track, setTrack] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	const dirty = lyrics !== (release?.lyrics ?? "");
	useWarnUnsaved(dirty);
	(0, import_react.useEffect)(() => onDirty(dirty), [dirty, onDirty]);
	(0, import_react.useEffect)(() => setLyrics(release?.lyrics ?? ""), [release?.id, release?.lyrics]);
	if (!release) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "border border-line bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-line px-4 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-brass",
					children: release.catalog
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl leading-tight",
					children: release.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 text-sm text-muted",
					children: [
						release.kind,
						" · ",
						release.distribution || "Distribution not set",
						release.date ? ` · ${formatDay(release.date)}` : ""
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4 px-4 py-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stage",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: release.stage,
						onChange: (event) => updateRelease(release.id, { stage: event.target.value }),
						children: RELEASE_STAGES.map((stage) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: stage,
							children: RELEASE_STAGE_LABEL[stage]
						}, stage))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: release.notes,
						onChange: (event) => updateRelease(release.id, { notes: event.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "text-sm font-semibold",
						children: "Tracklist"
					}),
					release.tracks.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted",
						children: "No tracks yet. Do not invent titles — add the ones that exist."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-2 divide-y divide-line border-y border-line",
						children: release.tracks.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "grid gap-2 py-3 sm:grid-cols-[1.5rem_1fr_5rem_auto]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums text-faint",
									children: index + 1
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"aria-label": "Track title",
									value: item.title,
									onChange: (event) => updateTrack(release.id, item.id, { title: event.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									"aria-label": "Duration",
									placeholder: "3:12",
									value: item.duration,
									onChange: (event) => updateTrack(release.id, item.id, { duration: event.target.value })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									onClick: () => removeTrack(release.id, item.id),
									children: "Remove"
								})
							]
						}, item.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: track,
							placeholder: "Track title",
							"aria-label": "New track title",
							onChange: (event) => setTrack(event.target.value)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => {
								if (track.trim().length < 1) return;
								addTrack(release.id, track.trim());
								setTrack("");
								flashMsg("Track added.");
							},
							children: "Add"
						})]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Lyrics",
					hint: dirty ? "Unsaved changes." : "Saved on this device.",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						className: "min-h-48 font-display text-base",
						value: lyrics,
						onChange: (event) => setLyrics(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "primary",
							onClick: () => {
								if (lyrics.length > 2e4) {
									setError("Lyrics are too long for one release note.");
									return;
								}
								updateRelease(release.id, { lyrics });
								setError("");
								flashMsg("Lyrics saved.");
							},
							children: "Save lyrics"
						}),
						discardTo ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: onDiscard,
							children: "Discard and switch"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "danger",
							onClick: () => {
								removeRelease(release.id);
								flashMsg("Release removed.");
							},
							children: "Delete release"
						})
					]
				})
			]
		})]
	});
}
function Sessions() {
	const sessions = useDesk((state) => state.sessions);
	const releases = useDesk((state) => state.releases);
	const addSession = useDesk((state) => state.addSession);
	const removeSession = useDesk((state) => state.removeSession);
	const [date, setDate] = (0, import_react.useState)(kampalaToday());
	const [hours, setHours] = (0, import_react.useState)("2");
	const [focus, setFocus] = (0, import_react.useState)("");
	const [releaseId, setReleaseId] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "sessions",
		className: "mt-12 scroll-mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Session log"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 mb-4 text-sm text-muted",
				children: "Hours in FL Studio, tied to a release when you know which one."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 md:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Date",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							type: "date",
							value: date,
							onChange: (event) => setDate(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Hours",
						error,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: hours,
							inputMode: "decimal",
							onChange: (event) => setHours(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Focus",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: focus,
							onChange: (event) => setFocus(event.target.value),
							placeholder: "Drums, vocal, mix"
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Release",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: releaseId,
							onChange: (event) => setReleaseId(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "None"
							}), releases.map((release) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: release.id,
								children: release.catalog
							}, release.id))]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: () => {
					const value = parseAmount(hours);
					if (value === null || value <= 0 || value > 24) {
						setError("Hours should be between 0 and 24.");
						return;
					}
					addSession({
						date,
						hours: value,
						focus: focus.trim(),
						releaseId: releaseId || null
					});
					setFocus("");
					setError("");
				},
				children: "Log session"
			}),
			sessions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-y border-line",
				children: sessions.map((session) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-h-12 items-center justify-between gap-3 py-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums",
							children: formatDay(session.date)
						}),
						" · ",
						session.hours,
						"h · ",
						session.focus || "Untitled session"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => removeSession(session.id),
						children: "Remove"
					})]
				}, session.id))
			}) : null
		]
	});
}
function Royalties() {
	const royalties = useDesk((state) => state.royalties);
	const addRoyalty = useDesk((state) => state.addRoyalty);
	const removeRoyalty = useDesk((state) => state.removeRoyalty);
	const totals = royaltyTotals(royalties);
	const [period, setPeriod] = (0, import_react.useState)("");
	const [source, setSource] = (0, import_react.useState)("RouteNote");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [currency, setCurrency] = (0, import_react.useState)("USD");
	const [certainty, setCertainty] = (0, import_react.useState)("projected");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		id: "royalties",
		className: "mt-12 scroll-mt-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl",
				children: "Royalties"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-2xl text-sm text-muted",
				children: "Received and estimated stay apart. These figures are not copied into the finance ledger until you enter them there yourself."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-t border-ink pt-2 text-sm",
					children: [
						"USD received ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 font-display text-2xl tabular-nums",
							children: formatMoney(totals.USD.received, "USD")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-muted",
							children: ["Estimated ", formatMoney(totals.USD.estimated, "USD")]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "border-t border-line pt-2 text-sm",
					children: [
						"UGX received ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 font-display text-2xl tabular-nums",
							children: formatMoney(totals.UGX.received, "UGX")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "mt-1 block text-muted",
							children: ["Estimated ", formatMoney(totals.UGX.estimated, "UGX")]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 grid gap-3 md:grid-cols-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Period",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: period,
							placeholder: "2026-11",
							onChange: (event) => setPeriod(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Source",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: source,
							onChange: (event) => setSource(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount",
						error,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: amount,
							inputMode: "decimal",
							onChange: (event) => setAmount(event.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Currency",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: currency,
							onChange: (event) => setCurrency(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "USD",
								children: "USD"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "UGX",
								children: "UGX"
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Status",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: certainty,
							onChange: (event) => setCertainty(event.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "projected",
								children: "Estimated"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "actual",
								children: "Received"
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: () => {
					const value = parseAmount(amount);
					if (value === null || period.trim().length < 4 || source.trim().length < 2) {
						setError("Need a period, a source, and a real amount.");
						return;
					}
					addRoyalty({
						period: period.trim(),
						source: source.trim(),
						amount: value,
						currency,
						certainty
					});
					setAmount("");
					setError("");
				},
				children: "Add royalty"
			}),
			royalties.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 divide-y divide-line border-y border-line text-sm",
				children: royalties.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex min-h-12 items-center justify-between gap-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						row.period,
						" · ",
						row.source,
						" · ",
						formatMoney(row.amount, row.currency),
						" · ",
						row.certainty === "actual" ? "Received" : "Estimated"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => removeRoyalty(row.id),
						children: "Remove"
					})]
				}, row.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted",
				children: "No royalty rows yet. Leave this empty rather than guessing a payout."
			})
		]
	});
}
function ReleasePanel({ open, onClose }) {
	const addRelease = useDesk((state) => state.addRelease);
	const settings = useDesk((state) => state.settings);
	const [title, setTitle] = (0, import_react.useState)("");
	const [kind, setKind] = (0, import_react.useState)("single");
	const [stage, setStage] = (0, import_react.useState)("writing");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New release",
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
					label: "Kind",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: kind,
						onChange: (event) => setKind(event.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "single",
								children: "Single"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "ep",
								children: "EP"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "album",
								children: "Album"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stage",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: stage,
						onChange: (event) => setStage(event.target.value),
						children: RELEASE_STAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: RELEASE_STAGE_LABEL[item]
						}, item))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						if (title.trim().length < 2) {
							setError("The release needs a title.");
							return;
						}
						addRelease({
							title: title.trim(),
							kind,
							stage,
							date: null,
							genres: settings.genres,
							distribution: "",
							lyrics: "",
							notes: ""
						});
						setTitle("");
						setError("");
						onClose();
					},
					children: "Add to catalog"
				})
			]
		})
	});
}
var SplitComponent = MusicView;
//#endregion
export { SplitComponent as component };
