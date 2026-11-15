import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { P as useDesk, S as kampalaToday, T as parseAmount, a as Input, c as Panel, d as Textarea, g as formatDay, h as customerBalance, i as Field, l as Select, m as cn, n as DataTable, o as Page, r as Empty, t as Button, u as Stamp, v as formatMoney, w as owed } from "./ui-CJBsTUw5.mjs";
import { i as ORDER_STAGE_LABEL, r as ORDER_STAGES } from "./types-BoxosEJd.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-QuCoDQyj.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function BrandView() {
	const settings = useDesk((state) => state.settings);
	const orders = useDesk((state) => state.orders);
	const customers = useDesk((state) => state.customers);
	const inventory = useDesk((state) => state.inventory);
	const quotes = useDesk((state) => state.quotes);
	const composer = useDesk((state) => state.composer);
	const openComposer = useDesk((state) => state.openComposer);
	const closeComposer = useDesk((state) => state.closeComposer);
	const focusId = useDesk((state) => state.focusId);
	const setFocus = useDesk((state) => state.setFocus);
	const updateOrder = useDesk((state) => state.updateOrder);
	const removeOrders = useDesk((state) => state.removeOrders);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [tab, setTab] = (0, import_react.useState)("queue");
	const [stage, setStage] = (0, import_react.useState)("all");
	const [activeId, setActiveId] = (0, import_react.useState)(orders[0]?.id ?? null);
	const [selected, setSelected] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (composer === "order" || composer === "quote") setTab(composer === "quote" ? "quotes" : "queue");
	}, [composer]);
	(0, import_react.useEffect)(() => {
		if (!focusId) return;
		if (orders.some((order) => order.id === focusId)) {
			setTab("queue");
			setActiveId(focusId);
			setFocus(null);
		} else if (customers.some((customer) => customer.id === focusId)) {
			setTab("customers");
			setFocus(null);
		}
	}, [
		focusId,
		orders,
		customers,
		setFocus
	]);
	const counts = Object.fromEntries(ORDER_STAGES.map((item) => [item, orders.filter((order) => order.stage === item).length]));
	const onBoard = orders.filter((order) => order.stage !== "delivered").length;
	const liveJobs = orders.filter((order) => !order.sample && order.stage !== "delivered").length;
	const sampleJobs = orders.filter((order) => order.sample && order.stage !== "delivered").length;
	const rows = orders.filter((order) => stage === "all" || order.stage === stage);
	const active = orders.find((order) => order.id === activeId) ?? null;
	const nameOf = (id) => customers.find((customer) => customer.id === id)?.name ?? "Unknown customer";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Page, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-6 grid gap-4 border-b-2 border-ink pb-4 md:grid-cols-[1fr_auto] md:items-end",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: "Production floor · Matugga"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-medium leading-tight",
					children: settings.shop
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-xl text-sm text-muted",
					children: [settings.shopLocation, ". Embroidery, heat transfer, jerseys, names and numbers."]
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-4xl tabular-nums leading-none",
						children: onBoard
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs font-semibold uppercase tracking-widest text-faint",
						children: sampleJobs ? `${liveJobs} live · ${sampleJobs} sample` : "Live jobs"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "primary",
						onClick: () => openComposer("order"),
						children: "New job"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => openComposer("quote"),
						children: "New quote"
					})
				]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
			"aria-label": "Classic Brand sections",
			className: "mb-6 flex gap-1 overflow-x-auto border-b border-line",
			children: [
				[
					"queue",
					"Queue",
					orders.filter((order) => order.stage !== "delivered").length
				],
				[
					"customers",
					"Customers",
					customers.length
				],
				[
					"stock",
					"Floor",
					inventory.length
				],
				[
					"quotes",
					"Quotes",
					quotes.length
				]
			].map(([id, label, count]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setTab(id),
				className: cn("inline-flex min-h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-semibold", tab === id ? "border-ink text-ink" : "border-transparent text-muted"),
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "tabular-nums text-faint",
					children: count
				})]
			}, id))
		}),
		tab === "queue" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-8 lg:grid-cols-12",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:col-span-7",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mb-4 flex overflow-x-auto border border-line",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "min-w-24 flex-1",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageButton, {
								label: "All",
								count: orders.length,
								active: stage === "all",
								onClick: () => setStage("all")
							})
						}), ORDER_STAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
							className: "min-w-24 flex-1 border-l border-line",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StageButton, {
								label: ORDER_STAGE_LABEL[item],
								count: counts[item] ?? 0,
								active: stage === item,
								onClick: () => setStage(item)
							})
						}, item))]
					}),
					selected.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap gap-2 border border-line bg-surface px-3 py-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "self-center text-sm tabular-nums",
								children: [selected.length, " selected"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								onClick: () => {
									for (const id of selected) updateOrder(id, { stage: "delivered" });
									setSelected([]);
									flashMsg("Marked delivered.");
								},
								children: "Mark delivered"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "danger",
								onClick: () => {
									removeOrders(selected);
									setSelected([]);
									flashMsg("Jobs removed.");
								},
								children: "Delete"
							})
						]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
						rows,
						selectable: true,
						selected,
						onSelected: setSelected,
						activeId,
						onRow: (order) => setActiveId(order.id),
						searchText: (order) => `${order.number} ${order.garment} ${order.spec} ${nameOf(order.customerId)}`,
						empty: {
							title: "No jobs in this stage.",
							body: "Add a live job, or clear the sample records from Settings."
						},
						columns: [
							{
								id: "number",
								header: "Job",
								sortValue: (order) => order.number,
								cell: (order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [order.number, order.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Sample" }) : null] })
							},
							{
								id: "garment",
								header: "Garment",
								optional: true,
								sortValue: (order) => order.garment,
								cell: (order) => order.garment
							},
							{
								id: "stage",
								header: "Stage",
								sortValue: (order) => order.stage,
								cell: (order) => ORDER_STAGE_LABEL[order.stage]
							},
							{
								id: "due",
								header: "Due",
								align: "right",
								sortValue: (order) => order.due ?? "9999",
								cell: (order) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: !order.sample && order.due && order.due < kampalaToday() && order.stage !== "delivered" ? "text-rust" : void 0,
									children: formatDay(order.due)
								})
							},
							{
								id: "owed",
								header: "Owed",
								align: "right",
								sortValue: (order) => owed(order),
								cell: (order) => formatMoney(owed(order), "UGX")
							}
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "lg:col-span-5",
				children: active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ticket, { orderId: active.id }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
					title: "No job selected.",
					body: "Choose a row to open its ticket."
				})
			})]
		}) : null,
		tab === "customers" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Customers, {}) : null,
		tab === "stock" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Floor, {
			inventory,
			services: settings.services,
			location: settings.shopLocation
		}) : null,
		tab === "quotes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Quotes, {}) : null,
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrderPanel, {
			open: composer === "order",
			onClose: closeComposer
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuotePanel, {
			open: composer === "quote",
			onClose: closeComposer
		})
	] });
}
function StageButton({ label, count, active, onClick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("flex min-h-16 w-full flex-col items-start px-3", active ? "bg-ink text-paper" : "bg-elevated"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-sm font-semibold",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs tabular-nums",
			children: count
		})]
	});
}
function Ticket({ orderId }) {
	const order = useDesk((state) => state.orders.find((item) => item.id === orderId));
	const customers = useDesk((state) => state.customers);
	const updateOrder = useDesk((state) => state.updateOrder);
	const removeOrders = useDesk((state) => state.removeOrders);
	const flashMsg = useDesk((state) => state.flashMsg);
	if (!order) return null;
	const customer = customers.find((item) => item.id === order.customerId);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "border border-line bg-elevated",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "border-b border-dashed border-line px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-semibold uppercase tracking-widest text-faint",
				children: "Classic Brand · Job ticket"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: order.number
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: customer?.name ?? "No customer"
				})] }), order.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					tone: "brass",
					children: "Sample"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
					tone: "moss",
					children: "Live"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3 px-4 py-4 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-semibold",
					children: order.garment
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: order.spec
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
					className: "grid grid-cols-2 gap-y-2 border-t border-line pt-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Quantity"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right tabular-nums",
							children: order.qty
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Price"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right tabular-nums",
							children: formatMoney(order.price, "UGX")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Paid"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right tabular-nums",
							children: formatMoney(order.paid, "UGX")
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-muted",
							children: "Owed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-right font-semibold tabular-nums",
							children: formatMoney(owed(order), "UGX")
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Stage",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: order.stage,
						onChange: (event) => updateOrder(order.id, { stage: event.target.value }),
						children: ORDER_STAGES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item,
							children: ORDER_STAGE_LABEL[item]
						}, item))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Quality notes",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: order.qc,
						onChange: (event) => updateOrder(order.id, { qc: event.target.value })
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Payment received (UGX)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						inputMode: "decimal",
						defaultValue: String(order.paid),
						onBlur: (event) => {
							const value = parseAmount(event.target.value);
							if (value === null) {
								flashMsg("Payment must be a number.");
								return;
							}
							updateOrder(order.id, { paid: value });
						}
					}, order.paid)
				}),
				order.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap gap-2 border-t border-dashed border-line pt-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => updateOrder(order.id, { sample: false }),
						children: "Keep as a real job"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "danger",
						onClick: () => removeOrders([order.id]),
						children: "Delete sample"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "danger",
					onClick: () => removeOrders([order.id]),
					children: "Delete job"
				})
			]
		})]
	});
}
function Customers() {
	const customers = useDesk((state) => state.customers);
	const orders = useDesk((state) => state.orders);
	const addCustomer = useDesk((state) => state.addCustomer);
	const removeCustomer = useDesk((state) => state.removeCustomer);
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTable, {
		rows: customers,
		searchText: (customer) => `${customer.name} ${customer.phone} ${customer.note}`,
		empty: {
			title: "No customers yet.",
			body: "Add a person when there is a real order. Do not invent one."
		},
		columns: [
			{
				id: "name",
				header: "Customer",
				sortValue: (customer) => customer.name,
				cell: (customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					customer.name,
					" ",
					customer.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Sample" }) : null
				] })
			},
			{
				id: "phone",
				header: "Phone",
				optional: true,
				cell: (customer) => customer.phone || "—"
			},
			{
				id: "balance",
				header: "Balance",
				align: "right",
				sortValue: (customer) => customerBalance(customer, orders),
				cell: (customer) => {
					const balance = customerBalance(customer, orders);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: balance > 0 ? "text-rust" : void 0,
						children: balance < 0 ? `Credit ${formatMoney(Math.abs(balance), "UGX")}` : formatMoney(balance, "UGX")
					});
				}
			},
			{
				id: "act",
				header: "",
				cell: (customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "min-h-11 text-sm text-rust",
					onClick: () => removeCustomer(customer.id),
					children: "Remove"
				})
			}
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "mt-6 grid gap-3 md:grid-cols-[1fr_1fr_auto]",
		onSubmit: (event) => {
			event.preventDefault();
			if (name.trim().length < 2) {
				setError("Enter the customer name.");
				return;
			}
			addCustomer({
				name: name.trim(),
				phone: phone.trim(),
				opening: 0,
				note: ""
			});
			setName("");
			setPhone("");
			setError("");
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Name (required)",
				error,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: name,
					onChange: (event) => setName(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: "Phone",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: phone,
					onChange: (event) => setPhone(event.target.value)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "self-end",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Add customer"
				})
			})
		]
	})] });
}
function Floor({ inventory, services, location }) {
	const adjustInventory = useDesk((state) => state.adjustInventory);
	const addInventory = useDesk((state) => state.addInventory);
	const removeInventory = useDesk((state) => state.removeInventory);
	const [name, setName] = (0, import_react.useState)("");
	const [reorder, setReorder] = (0, import_react.useState)("5");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-10 lg:grid-cols-12",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:col-span-7",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "Machines"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: location
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line border-y border-line",
					children: inventory.filter((item) => item.kind === "equipment").map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between gap-3 py-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold",
							children: item.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: item.note
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums text-sm",
							children: [item.onHand, " on floor"]
						})]
					}, item.id))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-8 font-display text-2xl",
					children: "Supplies"
				}),
				inventory.every((item) => item.kind !== "supply") ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "No thread, vinyl, or blank garments recorded yet. Add them when you count them."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 divide-y divide-line border-y border-line",
					children: inventory.filter((item) => item.kind === "supply").map((item) => {
						const low = item.onHand <= item.reorderAt;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center justify-between gap-3 py-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-semibold",
								children: [
									item.name,
									" ",
									low ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, {
										tone: "rust",
										children: "Reorder"
									}) : null
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted",
								children: ["Reorder at ", item.reorderAt]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => adjustInventory(item.id, item.onHand - 1),
										"aria-label": `Decrease ${item.name}`,
										children: "−"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-8 text-center tabular-nums",
										children: item.onHand
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => adjustInventory(item.id, item.onHand + 1),
										"aria-label": `Increase ${item.name}`,
										children: "+"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										onClick: () => removeInventory(item.id),
										children: "Remove"
									})
								]
							})]
						}, item.id);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-4 flex flex-wrap gap-2",
					onSubmit: (event) => {
						event.preventDefault();
						const at = Number(reorder);
						if (name.trim().length < 2 || !Number.isFinite(at)) return;
						addInventory({
							name: name.trim(),
							kind: "supply",
							onHand: 0,
							reorderAt: at,
							note: ""
						});
						setName("");
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "max-w-xs",
							value: name,
							placeholder: "Supply name",
							"aria-label": "Supply name",
							onChange: (event) => setName(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "w-28",
							value: reorder,
							"aria-label": "Reorder at",
							onChange: (event) => setReorder(event.target.value)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							children: "Add supply"
						})
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "lg:col-span-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "What the shop does"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 mb-3 text-sm text-muted",
					children: "Capabilities, not a price list. Prices belong on a quote."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-line border-y border-line",
					children: services.map((service) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "py-2 text-sm",
						children: service
					}, service))
				})
			]
		})]
	});
}
function Quotes() {
	const quotes = useDesk((state) => state.quotes);
	const customers = useDesk((state) => state.customers);
	const updateQuote = useDesk((state) => state.updateQuote);
	const removeQuote = useDesk((state) => state.removeQuote);
	const convertQuote = useDesk((state) => state.convertQuote);
	const nameOf = (id) => customers.find((customer) => customer.id === id)?.name ?? "Unknown";
	if (!quotes.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
		title: "No quotes.",
		body: "A quote is a price and a spec. It becomes a job only when you accept it."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "divide-y divide-line border-y border-line",
		children: quotes.map((quote) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "grid gap-3 py-4 md:grid-cols-[1fr_auto]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "font-semibold",
				children: [
					quote.summary,
					" ",
					quote.sample ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stamp, { children: "Sample" }) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					nameOf(quote.customerId),
					" · ",
					quote.spec || "No spec",
					" · ",
					formatMoney(quote.amount, "UGX")
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						"aria-label": "Quote status",
						value: quote.status,
						onChange: (event) => updateQuote(quote.id, { status: event.target.value }),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "draft",
								children: "Draft"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "sent",
								children: "Sent"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "accepted",
								children: "Accepted"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "declined",
								children: "Declined"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => convertQuote(quote.id),
						disabled: quote.status === "accepted",
						children: "Open as job"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => removeQuote(quote.id),
						children: "Remove"
					})
				]
			})]
		}, quote.id))
	});
}
function OrderPanel({ open, onClose }) {
	const customers = useDesk((state) => state.customers);
	const addCustomer = useDesk((state) => state.addCustomer);
	const addOrder = useDesk((state) => state.addOrder);
	const flashMsg = useDesk((state) => state.flashMsg);
	const [customerId, setCustomerId] = (0, import_react.useState)(customers.find((item) => !item.sample)?.id ?? "");
	const [newName, setNewName] = (0, import_react.useState)("");
	const [garment, setGarment] = (0, import_react.useState)("");
	const [spec, setSpec] = (0, import_react.useState)("");
	const [qty, setQty] = (0, import_react.useState)("1");
	const [price, setPrice] = (0, import_react.useState)("");
	const [due, setDue] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New job ticket",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Customer",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: customerId,
						onChange: (event) => setCustomerId(event.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "New customer, named below"
						}), customers.map((customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: customer.id,
							children: customer.name
						}, customer.id))]
					})
				}),
				!customerId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "New customer name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: newName,
						onChange: (event) => setNewName(event.target.value)
					})
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Garment (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: garment,
						onChange: (event) => setGarment(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Specification",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: spec,
						onChange: (event) => setSpec(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Quantity",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: qty,
						inputMode: "numeric",
						onChange: (event) => setQty(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Price (UGX)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: price,
						inputMode: "decimal",
						onChange: (event) => setPrice(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Due",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						type: "date",
						value: due,
						onChange: (event) => setDue(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					onClick: () => {
						const count = Number(qty);
						const amount = parseAmount(price);
						if (garment.trim().length < 2 || !Number.isInteger(count) || count < 1 || amount === null) {
							setError("Need a garment, a whole quantity, and a price.");
							return;
						}
						let id = customerId;
						if (!id) {
							if (newName.trim().length < 2) {
								setError("Name the customer.");
								return;
							}
							id = addCustomer({
								name: newName.trim(),
								phone: "",
								opening: 0,
								note: ""
							});
						}
						addOrder({
							customerId: id,
							garment: garment.trim(),
							spec: spec.trim(),
							qty: count,
							due: due || null,
							stage: "quote",
							price: amount,
							paid: 0,
							qc: "",
							notes: ""
						});
						setGarment("");
						setSpec("");
						setPrice("");
						setError("");
						flashMsg("Job opened.");
						onClose();
					},
					children: "Open job"
				})
			]
		})
	});
}
function QuotePanel({ open, onClose }) {
	const customers = useDesk((state) => state.customers);
	const addQuote = useDesk((state) => state.addQuote);
	const [customerId, setCustomerId] = (0, import_react.useState)(customers[0]?.id ?? "");
	const [summary, setSummary] = (0, import_react.useState)("");
	const [spec, setSpec] = (0, import_react.useState)("");
	const [amount, setAmount] = (0, import_react.useState)("");
	const [error, setError] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Panel, {
		open,
		title: "New quote",
		onClose,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Customer",
					error: !customers.length ? "Add a customer first." : void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: customerId,
						onChange: (event) => setCustomerId(event.target.value),
						children: customers.map((customer) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: customer.id,
							children: customer.name
						}, customer.id))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Summary (required)",
					error,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: summary,
						onChange: (event) => setSummary(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Spec",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: spec,
						onChange: (event) => setSpec(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Amount (UGX)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: amount,
						inputMode: "decimal",
						onChange: (event) => setAmount(event.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "primary",
					disabled: !customers.length,
					onClick: () => {
						const value = parseAmount(amount);
						if (summary.trim().length < 2 || value === null || !customerId) {
							setError("Need a summary and an amount.");
							return;
						}
						addQuote({
							customerId,
							summary: summary.trim(),
							spec: spec.trim(),
							amount: value,
							status: "draft"
						});
						setSummary("");
						setAmount("");
						setError("");
						onClose();
					},
					children: "Save quote"
				})
			]
		})
	});
}
var SplitComponent = BrandView;
//#endregion
export { SplitComponent as component };
