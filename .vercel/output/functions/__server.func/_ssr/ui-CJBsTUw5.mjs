import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { c as ArrowUp, l as ArrowDown, o as ChevronRight, s as ChevronLeft, t as X } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ui-CJBsTUw5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ZONE = "Africa/Kampala";
function kampalaToday() {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: ZONE,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
function kampalaShift(days) {
	const [y, m, d] = kampalaToday().split("-").map(Number);
	return new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + days)).toISOString().slice(0, 10);
}
function kampalaHour() {
	const h = new Intl.DateTimeFormat("en-GB", {
		hour: "2-digit",
		hourCycle: "h23",
		timeZone: ZONE
	}).format(/* @__PURE__ */ new Date());
	return Number(h);
}
function salutation(hour = kampalaHour()) {
	if (hour < 12) return "Good morning";
	if (hour < 17) return "Good afternoon";
	return "Good evening";
}
function formatLongToday() {
	return new Intl.DateTimeFormat("en-UG", {
		weekday: "long",
		day: "numeric",
		month: "long",
		timeZone: ZONE
	}).format(/* @__PURE__ */ new Date());
}
function formatDay(iso) {
	if (!iso) return "No date";
	const [y, m, d] = iso.split("-").map(Number);
	if (!y || !m || !d) return iso;
	const dt = new Date(Date.UTC(y, m - 1, d));
	return new Intl.DateTimeFormat("en-UG", {
		day: "numeric",
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}).format(dt);
}
function formatMonth(key) {
	const [y, m] = key.split("-").map(Number);
	if (!y || !m) return key;
	const dt = new Date(Date.UTC(y, m - 1, 1));
	return new Intl.DateTimeFormat("en-UG", {
		month: "short",
		year: "numeric",
		timeZone: "UTC"
	}).format(dt);
}
function formatTime(iso) {
	const dt = new Date(iso);
	if (Number.isNaN(dt.getTime())) return "";
	return new Intl.DateTimeFormat("en-UG", {
		hour: "2-digit",
		minute: "2-digit",
		timeZone: ZONE
	}).format(dt);
}
function formatMoney(amount, currency) {
	if (currency === "UGX") return new Intl.NumberFormat("en-UG", {
		style: "currency",
		currency: "UGX",
		maximumFractionDigits: 0
	}).format(amount);
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(amount);
}
function weekDates(anchor = kampalaToday()) {
	const [y, m, d] = anchor.split("-").map(Number);
	return Array.from({ length: 7 }, (_, i) => {
		return new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + i)).toISOString().slice(0, 10);
	});
}
function weekdayShort(iso) {
	const [y, m, d] = iso.split("-").map(Number);
	const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
	return new Intl.DateTimeFormat("en-UG", {
		weekday: "short",
		timeZone: "UTC"
	}).format(dt);
}
function isLate(due, done, today = kampalaToday()) {
	return Boolean(due && !done && due < today);
}
function owed(order) {
	return round2(order.price - order.paid);
}
function customerBalance(customer, orders) {
	const jobs = orders.filter((order) => order.customerId === customer.id);
	return round2(customer.opening + jobs.reduce((sum, order) => sum + owed(order), 0));
}
function cashPosition(txns, currency) {
	return round2(txns.filter((txn) => txn.currency === currency && txn.certainty === "actual").reduce((sum, txn) => sum + signed(txn), 0));
}
function projectedPosition(txns, currency) {
	return round2(txns.filter((txn) => txn.currency === currency && txn.certainty === "projected").reduce((sum, txn) => sum + signed(txn), 0));
}
function netsByMonth(txns, currency) {
	const map = /* @__PURE__ */ new Map();
	for (const txn of txns) {
		if (txn.currency !== currency) continue;
		const month = txn.date.slice(0, 7);
		const row = map.get(month) ?? {
			month,
			actual: 0,
			projected: 0
		};
		const value = signed(txn);
		if (txn.certainty === "actual") row.actual = round2(row.actual + value);
		else row.projected = round2(row.projected + value);
		map.set(month, row);
	}
	return [...map.values()].sort((a, b) => a.month.localeCompare(b.month));
}
function positionSize(account, riskPct, stop) {
	if (!(account > 0) || !(riskPct > 0) || !(stop > 0)) return null;
	if (riskPct > 100) return null;
	return round2(account * (riskPct / 100) / stop);
}
function tradePnl(trade) {
	if (trade.exit === null || !(trade.size > 0)) return null;
	return round2((trade.side === "long" ? trade.exit - trade.entry : trade.entry - trade.exit) * trade.size);
}
function royaltyTotals(rows) {
	const totals = {
		UGX: {
			received: 0,
			estimated: 0
		},
		USD: {
			received: 0,
			estimated: 0
		}
	};
	for (const row of rows) if (row.certainty === "actual") totals[row.currency].received = round2(totals[row.currency].received + row.amount);
	else totals[row.currency].estimated = round2(totals[row.currency].estimated + row.amount);
	return totals;
}
function openTasks(tasks) {
	return tasks.filter((task) => !task.done);
}
function sampleCount(data) {
	return data.orders.filter((item) => item.sample).length + data.quotes.filter((item) => item.sample).length + data.customers.filter((item) => item.sample).length;
}
function nextCode(existing, prefix, floor) {
	const nums = existing.map((value) => Number(value.replace(/^\D+/, ""))).filter((n) => Number.isFinite(n));
	const next = Math.max(floor, ...nums, floor) + (nums.length ? 1 : 0);
	const width = prefix === "CAM" ? 3 : 4;
	return `${prefix}-${String(nums.length ? next : floor).padStart(width, "0")}`;
}
function releaseFact(release) {
	const tracks = release.tracks.length;
	return `${release.catalog} · ${tracks} ${tracks === 1 ? "track" : "tracks"}`;
}
function wikiTitles(body) {
	return [...body.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => match[1]?.trim() ?? "").filter(Boolean);
}
function buildSnapshot(data) {
	const today = kampalaToday();
	const payload = {
		today,
		confirmed: {
			called: data.settings.called,
			legalName: data.settings.legalName,
			professional: data.settings.professional,
			artist: data.settings.artist,
			label: data.settings.label,
			website: data.settings.website,
			genres: data.settings.genres,
			daw: data.settings.daw,
			shop: data.settings.shop,
			shopLocation: data.settings.shopLocation,
			services: data.settings.services
		},
		focus: data.settings.focus,
		openTasks: openTasks(data.tasks).slice(0, 10).map((task) => ({
			title: task.title,
			house: task.house,
			due: task.due,
			priority: task.priority,
			late: isLate(task.due, task.done, today)
		})),
		openDecisions: data.decisions.filter((item) => item.status === "open").map((item) => item.question),
		releases: data.releases.map((release) => ({
			catalog: release.catalog,
			title: release.title,
			stage: release.stage,
			tracks: release.tracks.length,
			distribution: release.distribution
		})),
		orders: data.orders.map((order) => ({
			number: order.number,
			stage: order.stage,
			due: order.due,
			owed: owed(order),
			sample: Boolean(order.sample)
		})),
		cashActual: {
			UGX: cashPosition(data.txns, "UGX"),
			USD: cashPosition(data.txns, "USD")
		},
		cashProjected: {
			UGX: projectedPosition(data.txns, "UGX"),
			USD: projectedPosition(data.txns, "USD")
		},
		projects: data.projects.map((project) => ({
			name: project.name,
			status: project.status
		})),
		ideas: data.ideas.map((idea) => ({
			title: idea.title,
			status: idea.status,
			score: idea.score
		})),
		note: "Sample orders are illustrations, not confirmed jobs. Do not treat them as live revenue."
	};
	return JSON.stringify(payload).slice(0, 4e3);
}
function searchDesk(data, query) {
	const q = query.trim().toLowerCase();
	if (q.length < 1) return [];
	const hits = [];
	const push = (hit, hay) => {
		if (hay.toLowerCase().includes(q)) hits.push(hit);
	};
	for (const task of data.tasks) push({
		href: "/personal",
		kicker: "Task",
		title: task.title,
		focusId: task.id
	}, `${task.title} ${task.notes}`);
	for (const release of data.releases) push({
		href: "/music",
		kicker: "Release",
		title: release.title,
		focusId: release.id
	}, `${release.title} ${release.catalog} ${release.lyrics} ${release.tracks.map((track) => track.title).join(" ")}`);
	for (const order of data.orders) push({
		href: "/brand",
		kicker: "Job",
		title: `${order.number} ${order.garment}`,
		focusId: order.id
	}, `${order.number} ${order.garment} ${order.spec}`);
	for (const customer of data.customers) push({
		href: "/brand",
		kicker: "Customer",
		title: customer.name,
		focusId: customer.id
	}, `${customer.name} ${customer.phone}`);
	for (const project of data.projects) push({
		href: "/lab",
		kicker: "Project",
		title: project.name,
		focusId: project.id
	}, `${project.name} ${project.summary} ${project.notes}`);
	for (const note of data.notes) push({
		href: "/vault",
		kicker: "Note",
		title: note.title,
		focusId: note.id
	}, `${note.title} ${note.body} ${note.tags.join(" ")}`);
	for (const idea of data.ideas) push({
		href: "/ideas",
		kicker: "Idea",
		title: idea.title,
		focusId: idea.id
	}, `${idea.title} ${idea.thesis}`);
	for (const txn of data.txns) push({
		href: "/finance",
		kicker: "Ledger",
		title: txn.category,
		focusId: txn.id
	}, `${txn.category} ${txn.note}`);
	for (const campaign of data.campaigns) push({
		href: "/marketing",
		kicker: "Campaign",
		title: campaign.name,
		focusId: campaign.id
	}, `${campaign.name} ${campaign.channel}`);
	return hits.slice(0, 12);
}
function signed(txn) {
	return txn.kind === "in" ? txn.amount : -txn.amount;
}
function round2(n) {
	return Math.round(n * 100) / 100;
}
function seed() {
	const today = kampalaToday();
	return {
		settings: {
			theme: "dark",
			density: "regular",
			called: "Daniel",
			legalName: "Muwonge Daniel Mark",
			professional: "DanielMac",
			artist: "Cam Leinad",
			label: "CAM (Cam All May)",
			website: "https://camleinad.pages.dev",
			genres: [
				"Pop",
				"Easy Listening",
				"Emo Trap",
				"UK Rap"
			],
			daw: "FL Studio Producer Edition 21",
			shop: "Classic Brand",
			shopLocation: "Matugga Center, near Lwadda School, Uganda",
			services: [
				"Embroidery",
				"Heat-transfer printing",
				"Garment customization",
				"Jersey customization",
				"Logos and badges",
				"Names, numbers, and letters",
				"Clothing branding"
			],
			focus: "Finish the album record, then replace sample shop jobs with live ones.",
			homeOrder: [
				"sequence",
				"attention",
				"houses",
				"week",
				"books"
			],
			hiddenHome: [],
			aiDay: today,
			aiUsed: 0,
			aiLimit: 8
		},
		tasks: [
			{
				id: "task-tracklist",
				title: "Add the tracklist for RIDE OR DIE IS WHO WE ARE",
				notes: "Catalog CAM-001 has no tracks yet. Durations and writers belong on the release, not in a side note.",
				house: "music",
				priority: "now",
				due: kampalaShift(1),
				done: false
			},
			{
				id: "task-routenote",
				title: "Confirm the RouteNote stage for CAM-001",
				notes: "Artwork was being prepared for RouteNote. The stage is set to Distribution until you confirm it.",
				house: "music",
				priority: "now",
				due: today,
				done: false
			},
			{
				id: "task-samples",
				title: "Replace the sample Classic Brand jobs with live orders",
				notes: "Sample jobs keep the production board readable. They are not customers.",
				house: "brand",
				priority: "next",
				due: kampalaShift(3),
				done: false
			},
			{
				id: "task-ledger",
				title: "Enter this month's actual shop expenses",
				notes: "Keep UGX shop money separate from USD music money. Mark estimates as projected.",
				house: "finance",
				priority: "next",
				due: kampalaShift(5),
				done: false
			}
		],
		decisions: [],
		releases: [{
			id: "rel-rod",
			catalog: "CAM-001",
			title: "RIDE OR DIE IS WHO WE ARE",
			kind: "album",
			stage: "distribution",
			date: null,
			genres: [
				"Pop",
				"Easy Listening",
				"Emo Trap",
				"UK Rap"
			],
			distribution: "RouteNote",
			lyrics: "",
			notes: "Confirmed title. Artwork was being prepared for RouteNote. Genres listed here are the artist genres — change them if this release is narrower. Tracklist not yet entered.",
			tracks: []
		}],
		sessions: [],
		royalties: [],
		customers: [{
			id: "cus-sample",
			name: "Sample customer",
			phone: "",
			opening: 0,
			note: "Not a real client. Removed with sample records.",
			sample: true
		}],
		orders: [{
			id: "ord-1042",
			number: "CB-1042",
			customerId: "cus-sample",
			garment: "Football jerseys",
			spec: "Names, numbers, and a front badge",
			qty: 18,
			due: kampalaShift(1),
			stage: "production",
			price: 54e4,
			paid: 2e5,
			qc: "",
			notes: "Sample job. The figures are not a live order.",
			sample: true
		}, {
			id: "ord-1038",
			number: "CB-1038",
			customerId: "cus-sample",
			garment: "Polo shirts",
			spec: "Left-chest logo, heat transfer",
			qty: 10,
			due: kampalaShift(-1),
			stage: "qc",
			price: 25e4,
			paid: 25e4,
			qc: "Check logo placement against the approved artwork.",
			notes: "Sample job, marked late so the queue shows a date slip. Not a real deadline.",
			sample: true
		}],
		inventory: [
			{
				id: "inv-heat",
				name: "Heat press",
				kind: "equipment",
				onHand: 1,
				reorderAt: 0,
				note: "Confirmed equipment."
			},
			{
				id: "inv-bro",
				name: "Brother embroidery machine",
				kind: "equipment",
				onHand: 1,
				reorderAt: 0,
				note: "Confirmed equipment."
			},
			{
				id: "inv-pe",
				name: "Brother PE535",
				kind: "equipment",
				onHand: 1,
				reorderAt: 0,
				note: "Confirmed equipment."
			},
			{
				id: "inv-screen",
				name: "Screen-printing equipment",
				kind: "equipment",
				onHand: 1,
				reorderAt: 0,
				note: "Present. Model not recorded — edit this note when you know it."
			}
		],
		quotes: [{
			id: "quo-sample",
			customerId: "cus-sample",
			summary: "Badge set",
			spec: "24 embroidered badges",
			amount: 18e4,
			status: "draft",
			sample: true
		}],
		projects: [
			{
				id: "proj-cam",
				name: "CAM Artist Website",
				summary: "Public site for Cam Leinad.",
				stack: "Cloudflare Pages",
				status: "active",
				href: "https://camleinad.pages.dev",
				notes: ""
			},
			{
				id: "proj-lanes",
				name: "LANES",
				summary: "Creative audio studio for playlists and arrangement lanes.",
				stack: "React, Vite, TypeScript",
				status: "active",
				href: "",
				notes: ""
			},
			{
				id: "proj-notelab",
				name: "NoteLab",
				summary: "Audio analyzer for BPM and moving production visuals.",
				stack: "Web audio",
				status: "active",
				href: "",
				notes: ""
			},
			{
				id: "proj-yfit-ide",
				name: "YFitOps IDE",
				summary: "Editor project. Stack details are not confirmed — record them here.",
				stack: "Unrecorded",
				status: "recorded",
				href: "",
				notes: ""
			},
			{
				id: "proj-classic",
				name: "Classic Brand Website",
				summary: "Site for the garment shop. Not the same thing as this operating desk.",
				stack: "Unrecorded",
				status: "recorded",
				href: "",
				notes: ""
			},
			{
				id: "proj-socket",
				name: "SocketObit",
				summary: "Recorded project. Purpose is not filled in yet.",
				stack: "Unrecorded",
				status: "recorded",
				href: "",
				notes: ""
			},
			{
				id: "proj-yfit-os",
				name: "YFitOps OS",
				summary: "Recorded project. Distinct from CamOS.",
				stack: "Unrecorded",
				status: "recorded",
				href: "",
				notes: ""
			}
		],
		bugs: [],
		techDecisions: [],
		deploys: [],
		txns: [],
		trades: [],
		paths: [
			{
				id: "path-music",
				title: "Release operations",
				domain: "Metadata, masters, distribution, royalties",
				progress: 15,
				note: ""
			},
			{
				id: "path-shop",
				title: "Production floor",
				domain: "Quotes, garments, queues, quality",
				progress: 10,
				note: ""
			},
			{
				id: "path-code",
				title: "Software delivery",
				domain: "React, Vite, TypeScript, Cloudflare, GitHub",
				progress: 20,
				note: ""
			},
			{
				id: "path-money",
				title: "Actual versus projected",
				domain: "Separate currencies. Never blend estimates into cash.",
				progress: 0,
				note: ""
			}
		],
		exercises: [
			{
				id: "ex-royalty",
				prompt: "A royalty marked estimated should be treated as what?",
				choices: [
					"Cash already received",
					"A projection until it is marked received",
					"Automatic profit"
				],
				answer: 1,
				explanation: "Estimated royalties stay out of actual cash. Record them as received only when the money arrives.",
				picked: null
			},
			{
				id: "ex-balance",
				prompt: "On a Classic Brand job, the customer balance is what?",
				choices: [
					"The quoted price alone",
					"Price minus payments received, plus any opening balance",
					"Zero once production starts"
				],
				answer: 1,
				explanation: "Balance is what is still owed. An opening balance carries older debt or credit.",
				picked: null
			},
			{
				id: "ex-mix",
				prompt: "A release sitting in Mix means what?",
				choices: [
					"It is already on RouteNote",
					"It is still in production, before master and distribution",
					"It is a marketing campaign"
				],
				answer: 1,
				explanation: "Writing, production, mix, and master all happen before distribution. Do not announce a release that has not left the studio.",
				picked: null
			},
			{
				id: "ex-fx",
				prompt: "Adding a UGX shop receipt to a USD royalty in one total is what?",
				choices: [
					"Required for the monthly chart",
					"A currency error — the books stay separate",
					"Fine if both are income"
				],
				answer: 1,
				explanation: "CamOS will not sum shillings and dollars. Switch currency instead of inventing a blended number.",
				picked: null
			}
		],
		notes: [{
			id: "note-identity",
			title: "Who the desk is for",
			tags: ["confirmed"],
			updated: today,
			body: [
				"Legal name: Muwonge Daniel Mark.",
				"The desk calls him Daniel. Professionally DanielMac. Artistically Cam Leinad.",
				"Label: CAM (Cam All May).",
				"Artist site: https://camleinad.pages.dev",
				"Genres: Pop, Easy Listening, Emo Trap, UK Rap.",
				"Production: FL Studio Producer Edition 21.",
				"",
				"Classic Brand (also referred to as Classic Brands) works from Matugga Center, near Lwadda School, Uganda.",
				"",
				"Link another note by writing its title in double brackets, for example [[Machines at Classic Brand]]."
			].join("\n")
		}, {
			id: "note-machines",
			title: "Machines at Classic Brand",
			tags: ["confirmed", "shop"],
			updated: today,
			body: [
				"Confirmed on the floor:",
				"- Heat press",
				"- Brother embroidery machine",
				"- Brother PE535",
				"- Screen-printing equipment (model not recorded)",
				"",
				"Services: embroidery, heat-transfer printing, garment and jersey customization, logos, badges, names, numbers, letters, clothing branding.",
				"",
				"Prices are not stored as facts. They belong on a quote.",
				"",
				"See also [[Who the desk is for]]."
			].join("\n")
		}],
		ideas: [],
		campaigns: [],
		memos: []
	};
}
var DATA_KEYS = [
	"settings",
	"tasks",
	"decisions",
	"releases",
	"sessions",
	"royalties",
	"customers",
	"orders",
	"inventory",
	"quotes",
	"projects",
	"bugs",
	"techDecisions",
	"deploys",
	"txns",
	"trades",
	"paths",
	"exercises",
	"notes",
	"ideas",
	"campaigns",
	"memos"
];
var flashTimer;
function uid() {
	return crypto.randomUUID();
}
function replaceById(items, id, patch) {
	return items.map((item) => item.id === id ? {
		...item,
		...patch
	} : item);
}
var useDesk = create()(persist((set, get) => ({
	...seed(),
	flash: null,
	composer: null,
	focusId: null,
	setTheme: (theme) => {
		document.documentElement.setAttribute("data-theme", theme);
		set((state) => ({ settings: {
			...state.settings,
			theme
		} }));
	},
	setDensity: (density) => {
		document.documentElement.setAttribute("data-density", density);
		set((state) => ({ settings: {
			...state.settings,
			density
		} }));
	},
	patchSettings: (patch) => set((state) => ({ settings: {
		...state.settings,
		...patch
	} })),
	moveHome: (id, dir) => set((state) => {
		const order = [...state.settings.homeOrder];
		const index = order.indexOf(id);
		const next = index + dir;
		if (index < 0 || next < 0 || next >= order.length) return state;
		const [item] = order.splice(index, 1);
		if (!item) return state;
		order.splice(next, 0, item);
		return { settings: {
			...state.settings,
			homeOrder: order
		} };
	}),
	toggleHomeBlock: (id) => set((state) => {
		const hidden = state.settings.hiddenHome.includes(id) ? state.settings.hiddenHome.filter((item) => item !== id) : [...state.settings.hiddenHome, id];
		return { settings: {
			...state.settings,
			hiddenHome: hidden
		} };
	}),
	flashMsg: (message) => {
		set({ flash: message });
		clearTimeout(flashTimer);
		flashTimer = setTimeout(() => set({ flash: null }), 2600);
	},
	openComposer: (kind) => set({ composer: kind }),
	closeComposer: () => set({ composer: null }),
	setFocus: (id) => set({ focusId: id }),
	addTask: (task) => set((state) => ({
		tasks: [{
			...task,
			id: uid(),
			done: task.done ?? false
		}, ...state.tasks],
		composer: null
	})),
	updateTask: (id, patch) => set((state) => ({ tasks: replaceById(state.tasks, id, patch) })),
	removeTasks: (ids) => set((state) => ({ tasks: state.tasks.filter((task) => !ids.includes(task.id)) })),
	completeTasks: (ids) => set((state) => ({ tasks: state.tasks.map((task) => ids.includes(task.id) ? {
		...task,
		done: true
	} : task) })),
	addDecision: (decision) => set((state) => ({
		decisions: [{
			...decision,
			id: uid()
		}, ...state.decisions],
		composer: null
	})),
	updateDecision: (id, patch) => set((state) => ({ decisions: replaceById(state.decisions, id, patch) })),
	removeDecision: (id) => set((state) => ({ decisions: state.decisions.filter((item) => item.id !== id) })),
	addRelease: (release) => set((state) => ({
		releases: [{
			...release,
			id: uid(),
			catalog: nextCode(state.releases.map((item) => item.catalog), "CAM", 1),
			tracks: release.tracks ?? []
		}, ...state.releases],
		composer: null
	})),
	updateRelease: (id, patch) => set((state) => ({ releases: replaceById(state.releases, id, patch) })),
	removeRelease: (id) => set((state) => ({ releases: state.releases.filter((item) => item.id !== id) })),
	addTrack: (releaseId, title) => set((state) => ({ releases: state.releases.map((release) => release.id === releaseId ? {
		...release,
		tracks: [...release.tracks, {
			id: uid(),
			title,
			duration: "",
			writers: state.settings.artist,
			status: "draft"
		}]
	} : release) })),
	updateTrack: (releaseId, trackId, patch) => set((state) => ({ releases: state.releases.map((release) => release.id === releaseId ? {
		...release,
		tracks: replaceById(release.tracks, trackId, patch)
	} : release) })),
	removeTrack: (releaseId, trackId) => set((state) => ({ releases: state.releases.map((release) => release.id === releaseId ? {
		...release,
		tracks: release.tracks.filter((track) => track.id !== trackId)
	} : release) })),
	addSession: (session) => set((state) => ({ sessions: [{
		...session,
		id: uid()
	}, ...state.sessions] })),
	removeSession: (id) => set((state) => ({ sessions: state.sessions.filter((item) => item.id !== id) })),
	addRoyalty: (row) => set((state) => ({ royalties: [{
		...row,
		id: uid()
	}, ...state.royalties] })),
	removeRoyalty: (id) => set((state) => ({ royalties: state.royalties.filter((item) => item.id !== id) })),
	addCustomer: (customer) => {
		const id = uid();
		set((state) => ({ customers: [{
			...customer,
			id
		}, ...state.customers] }));
		return id;
	},
	updateCustomer: (id, patch) => set((state) => ({ customers: replaceById(state.customers, id, patch) })),
	removeCustomer: (id) => {
		if (get().orders.some((order) => order.customerId === id) || get().quotes.some((quote) => quote.customerId === id)) {
			get().flashMsg("This customer still has jobs or quotes.");
			return;
		}
		set((state) => ({ customers: state.customers.filter((item) => item.id !== id) }));
	},
	addOrder: (order) => set((state) => ({
		orders: [{
			...order,
			id: uid(),
			number: nextCode(state.orders.map((item) => item.number), "CB", 1001)
		}, ...state.orders],
		composer: null
	})),
	updateOrder: (id, patch) => set((state) => ({ orders: replaceById(state.orders, id, patch) })),
	removeOrders: (ids) => set((state) => ({ orders: state.orders.filter((order) => !ids.includes(order.id)) })),
	addInventory: (item) => set((state) => ({ inventory: [...state.inventory, {
		...item,
		id: uid()
	}] })),
	adjustInventory: (id, onHand) => set((state) => ({ inventory: state.inventory.map((item) => item.id === id ? {
		...item,
		onHand: Math.max(0, Math.round(onHand))
	} : item) })),
	removeInventory: (id) => set((state) => ({ inventory: state.inventory.filter((item) => item.id !== id) })),
	addQuote: (quote) => set((state) => ({
		quotes: [{
			...quote,
			id: uid()
		}, ...state.quotes],
		composer: null
	})),
	updateQuote: (id, patch) => set((state) => ({ quotes: replaceById(state.quotes, id, patch) })),
	removeQuote: (id) => set((state) => ({ quotes: state.quotes.filter((item) => item.id !== id) })),
	convertQuote: (id) => {
		const quote = get().quotes.find((item) => item.id === id);
		if (!quote) return;
		get().addOrder({
			customerId: quote.customerId,
			garment: quote.summary,
			spec: quote.spec,
			qty: 1,
			due: null,
			stage: "approved",
			price: quote.amount,
			paid: 0,
			qc: "",
			notes: "Opened from a quote.",
			sample: quote.sample
		});
		get().updateQuote(id, { status: "accepted" });
		get().flashMsg("Quote accepted and opened as a job.");
	},
	updateProject: (id, patch) => set((state) => ({ projects: replaceById(state.projects, id, patch) })),
	addBug: (bug) => set((state) => ({
		bugs: [{
			...bug,
			id: uid(),
			open: true
		}, ...state.bugs],
		composer: null
	})),
	updateBug: (id, patch) => set((state) => ({ bugs: replaceById(state.bugs, id, patch) })),
	removeBug: (id) => set((state) => ({ bugs: state.bugs.filter((item) => item.id !== id) })),
	addTechDecision: (row) => set((state) => ({ techDecisions: [{
		...row,
		id: uid()
	}, ...state.techDecisions] })),
	removeTechDecision: (id) => set((state) => ({ techDecisions: state.techDecisions.filter((item) => item.id !== id) })),
	addDeploy: (row) => set((state) => ({ deploys: [{
		...row,
		id: uid()
	}, ...state.deploys] })),
	removeDeploy: (id) => set((state) => ({ deploys: state.deploys.filter((item) => item.id !== id) })),
	addTxn: (txn) => set((state) => ({
		txns: [{
			...txn,
			id: uid()
		}, ...state.txns],
		composer: null
	})),
	removeTxns: (ids) => set((state) => ({ txns: state.txns.filter((txn) => !ids.includes(txn.id)) })),
	addTrade: (trade) => set((state) => ({
		trades: [{
			...trade,
			id: uid()
		}, ...state.trades],
		composer: null
	})),
	removeTrade: (id) => set((state) => ({ trades: state.trades.filter((item) => item.id !== id) })),
	setPath: (id, patch) => set((state) => ({ paths: state.paths.map((path) => path.id === id ? {
		...path,
		...patch,
		progress: patch.progress === void 0 ? path.progress : Math.min(100, Math.max(0, Math.round(patch.progress)))
	} : path) })),
	answerExercise: (id, picked) => set((state) => ({ exercises: replaceById(state.exercises, id, { picked }) })),
	addNote: (note) => set((state) => ({
		notes: [{
			...note,
			id: uid(),
			updated: kampalaToday()
		}, ...state.notes],
		composer: null
	})),
	updateNote: (id, patch) => set((state) => ({ notes: replaceById(state.notes, id, {
		...patch,
		updated: kampalaToday()
	}) })),
	removeNote: (id) => set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),
	addIdea: (idea) => set((state) => ({
		ideas: [{
			...idea,
			id: uid()
		}, ...state.ideas],
		composer: null
	})),
	updateIdea: (id, patch) => set((state) => ({ ideas: replaceById(state.ideas, id, patch) })),
	removeIdea: (id) => set((state) => ({ ideas: state.ideas.filter((idea) => idea.id !== id) })),
	addCampaign: (campaign) => set((state) => ({
		campaigns: [{
			...campaign,
			id: uid()
		}, ...state.campaigns],
		composer: null
	})),
	updateCampaign: (id, patch) => set((state) => ({ campaigns: replaceById(state.campaigns, id, patch) })),
	removeCampaign: (id) => set((state) => ({ campaigns: state.campaigns.filter((item) => item.id !== id) })),
	addMemo: (memo) => set((state) => ({ memos: [...state.memos, {
		...memo,
		id: uid(),
		at: memo.at ?? (/* @__PURE__ */ new Date()).toISOString()
	}] })),
	clearMemos: () => set({ memos: [] }),
	canAsk: () => get().aiRemaining() > 0,
	noteAiUse: () => set((state) => {
		const today = kampalaToday();
		const used = state.settings.aiDay === today ? state.settings.aiUsed : 0;
		return { settings: {
			...state.settings,
			aiDay: today,
			aiUsed: used + 1
		} };
	}),
	aiRemaining: () => {
		const settings = get().settings;
		const used = settings.aiDay === kampalaToday() ? settings.aiUsed : 0;
		return Math.max(0, settings.aiLimit - used);
	},
	clearSamples: () => set((state) => {
		const orders = state.orders.filter((item) => !item.sample);
		const quotes = state.quotes.filter((item) => !item.sample);
		const kept = /* @__PURE__ */ new Set([...orders.map((item) => item.customerId), ...quotes.map((item) => item.customerId)]);
		return {
			orders,
			quotes,
			customers: state.customers.filter((item) => !item.sample || kept.has(item.id)).map((item) => item.sample && kept.has(item.id) ? {
				...item,
				sample: false
			} : item),
			flash: "Sample shop records removed."
		};
	}),
	resetDesk: () => set({
		...seed(),
		flash: "Desk restored to the opening records.",
		composer: null,
		focusId: null
	})
}), {
	name: "camos-desk-v1",
	version: 1,
	skipHydration: true,
	partialize: (state) => {
		const data = {};
		for (const key of DATA_KEYS) data[key] = state[key];
		return data;
	},
	merge: (persisted, current) => {
		const incoming = persisted ?? {};
		return {
			...current,
			...incoming,
			settings: {
				...current.settings,
				...incoming.settings ?? {}
			}
		};
	}
}));
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function Page({ children, width = "desk", mark }) {
	const density = useDesk((state) => state.settings.density);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("mx-auto w-full", width === "read" ? "max-w-3xl" : "max-w-6xl", density === "compact" ? "px-3 py-4" : "px-4 py-6 md:px-8 md:py-8"),
		children: [
			mark === "brass" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-6 h-0.5 bg-brass" }) : null,
			mark === "double" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 space-y-1",
				"aria-hidden": true,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px bg-ink" })]
			}) : null,
			mark === "dashed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mb-6 border-t border-dashed border-ink" }) : null,
			children
		]
	});
}
function PageHead({ kicker, title, lede, actions }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "mb-8 flex flex-col gap-4 border-b border-line pb-6 md:flex-row md:items-end md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-widest text-faint",
					children: kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl font-medium leading-tight",
					children: title
				}),
				lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm leading-relaxed text-muted",
					children: lede
				}) : null
			]
		}), actions ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex shrink-0 flex-wrap gap-2",
			children: actions
		}) : null]
	});
}
function Button({ variant = "line", className, type = "button", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type,
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-sm px-3 text-sm font-semibold transition-opacity disabled:opacity-40", variant === "primary" && "bg-ink text-paper hover:opacity-90", variant === "line" && "border border-line bg-elevated text-ink hover:border-ink", variant === "ghost" && "bg-transparent text-ink hover:bg-surface", variant === "danger" && "border border-rust text-rust hover:bg-surface", className),
		...props
	});
}
function Field({ label, hint, error, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-1 block text-sm font-semibold",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-rust",
				role: "alert",
				children: error
			}) : hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mt-1 block text-sm text-muted",
				children: hint
			}) : null
		]
	});
}
var control = "min-h-11 w-full rounded-sm border border-line bg-paper px-3 text-sm text-ink placeholder:text-faint";
function Input(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		...props,
		className: cn(control, props.className)
	});
}
function Textarea(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		...props,
		className: cn(control, "min-h-28 py-2 leading-relaxed", props.className)
	});
}
function Select(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		...props,
		className: cn(control, props.className)
	});
}
function Stamp({ tone = "neutral", children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide", tone === "neutral" && "border-line text-muted", tone === "moss" && "border-moss text-moss", tone === "rust" && "border-rust text-rust", tone === "brass" && "border-brass text-brass", tone === "accent" && "border-accent text-accent"),
		children
	});
}
function Empty({ title, body, action }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-dashed border-line px-4 py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-prose text-sm leading-relaxed text-muted",
				children: body
			}),
			action ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: action
			}) : null
		]
	});
}
function Panel({ open, title, onClose, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open,
		onOpenChange: (next) => !next && onClose(),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
			className: "fixed inset-0 z-40",
			style: { background: "var(--scrim)" }
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
			className: "panel-in fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-line bg-elevated",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-line px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
					className: "font-display text-xl",
					children: title
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogClose, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "inline-flex size-11 items-center justify-center",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {
							className: "size-4",
							strokeWidth: 1.75
						})
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "min-h-0 flex-1 overflow-y-auto px-4 py-4",
				children
			})]
		})] })
	});
}
function DataTable({ rows, columns, searchText, pageSize = 8, selectable = false, selected = [], onSelected, onRow, activeId, empty }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [sort, setSort] = (0, import_react.useState)(null);
	const [page, setPage] = (0, import_react.useState)(0);
	const [hidden, setHidden] = (0, import_react.useState)([]);
	const visible = columns.filter((column) => !hidden.includes(column.id));
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		const next = q ? rows.filter((row) => searchText(row).toLowerCase().includes(q)) : rows;
		if (!sort) return next;
		const column = columns.find((item) => item.id === sort.id);
		if (!column?.sortValue) return next;
		const copy = [...next];
		copy.sort((a, b) => {
			const av = column.sortValue?.(a) ?? "";
			const bv = column.sortValue?.(b) ?? "";
			const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
			return sort.dir === "asc" ? cmp : -cmp;
		});
		return copy;
	}, [
		rows,
		query,
		sort,
		columns,
		searchText
	]);
	const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
	const safePage = Math.min(page, pages - 1);
	const slice = filtered.slice(safePage * pageSize, safePage * pageSize + pageSize);
	const allOnPage = slice.length > 0 && slice.every((row) => selected.includes(row.id));
	(0, import_react.useEffect)(() => {
		setPage(0);
	}, [query, rows.length]);
	function toggleSort(id) {
		if (!columns.find((item) => item.id === id)?.sortValue) return;
		setSort((current) => {
			if (current?.id !== id) return {
				id,
				dir: "asc"
			};
			if (current.dir === "asc") return {
				id,
				dir: "desc"
			};
			return null;
		});
	}
	function toggle(id) {
		if (!onSelected) return;
		onSelected(selected.includes(id) ? selected.filter((item) => item !== id) : [...selected, id]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				value: query,
				onChange: (event) => setQuery(event.target.value),
				placeholder: "Filter this list",
				"aria-label": "Filter this list",
				className: "sm:max-w-xs"
			}), columns.some((column) => column.optional) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("details", {
				className: "text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("summary", {
					className: "inline-flex min-h-11 cursor-pointer list-none items-center border border-line bg-elevated px-3 font-semibold",
					children: "Columns"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1 border border-line bg-elevated p-2",
					children: columns.filter((column) => column.optional).map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-11 items-center gap-2 px-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "tick",
							type: "checkbox",
							checked: !hidden.includes(column.id),
							onChange: () => setHidden((current) => current.includes(column.id) ? current.filter((id) => id !== column.id) : [...current, column.id])
						}), column.header]
					}, column.id))
				})]
			}) : null]
		}),
		slice.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Empty, {
			title: empty.title,
			body: query ? "Nothing matches that filter." : empty.body
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "divide-y divide-line border border-line md:hidden",
			children: slice.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
				className: cn("bg-elevated", activeId === row.id && "border-l-2 border-l-brass"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start",
					children: [selectable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						className: "inline-flex min-h-11 min-w-11 items-center justify-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "tick",
							type: "checkbox",
							checked: selected.includes(row.id),
							onChange: () => toggle(row.id),
							"aria-label": `Select ${visible[0] ? "row" : "row"}`
						})
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "min-w-0 flex-1 px-3 py-3 text-left",
						onClick: () => onRow?.(row),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "font-semibold",
							children: visible[0]?.cell(row)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
							className: "mt-2 space-y-1",
							children: visible.slice(1).map((column) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between gap-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
									className: "text-muted",
									children: column.header
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
									className: cn("text-right", column.align === "right" && "tabular-nums"),
									children: column.cell(row)
								})]
							}, column.id))
						})]
					})]
				})
			}, row.id))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "hidden overflow-x-auto border border-line md:block",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full border-collapse text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b border-line bg-surface text-left",
					children: [selectable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "w-12 px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "inline-flex min-h-11 min-w-11 items-center justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "tick",
								type: "checkbox",
								checked: allOnPage,
								onChange: () => {
									if (!onSelected) return;
									if (allOnPage) onSelected(selected.filter((id) => !slice.some((row) => row.id === id)));
									else onSelected([.../* @__PURE__ */ new Set([...selected, ...slice.map((row) => row.id)])]);
								},
								"aria-label": "Select rows on this page"
							})
						})
					}) : null, visible.map((column) => {
						const active = sort?.id === column.id;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							"aria-sort": active ? sort?.dir === "asc" ? "ascending" : "descending" : "none",
							className: cn("px-3 py-2 font-semibold", column.align === "right" && "text-right"),
							children: column.sortValue ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								className: "inline-flex min-h-11 items-center gap-1",
								onClick: () => toggleSort(column.id),
								children: [column.header, active ? sort?.dir === "asc" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUp, {
									className: "size-3.5",
									"aria-hidden": true
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowDown, {
									className: "size-3.5",
									"aria-hidden": true
								}) : null]
							}) : column.header
						}, column.id);
					})]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: slice.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					onClick: () => onRow?.(row),
					className: cn("border-b border-line last:border-b-0", onRow && "cursor-pointer", activeId === row.id ? "bg-surface" : "bg-elevated hover:bg-surface"),
					children: [selectable ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "inline-flex min-h-11 min-w-11 items-center justify-center",
							onClick: (event) => event.stopPropagation(),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "tick",
								type: "checkbox",
								checked: selected.includes(row.id),
								onChange: () => toggle(row.id),
								"aria-label": "Select row"
							})
						})
					}) : null, visible.map((column, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: cn("px-3 py-2 align-middle", column.align === "right" && "text-right tabular-nums", index === 0 && "font-semibold"),
						children: column.cell(row)
					}, column.id))]
				}, row.id)) })]
			})
		})] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-center justify-between text-sm text-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "tabular-nums",
				children: [
					filtered.length,
					" ",
					filtered.length === 1 ? "record" : "records"
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						"aria-label": "Previous page",
						disabled: safePage === 0,
						onClick: () => setPage(safePage - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "tabular-nums",
						children: [
							safePage + 1,
							" / ",
							pages
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						"aria-label": "Next page",
						disabled: safePage >= pages - 1,
						onClick: () => setPage(safePage + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
					})
				]
			})]
		})
	] });
}
function useWarnUnsaved(dirty) {
	(0, import_react.useEffect)(() => {
		if (!dirty) return;
		const onBefore = (event) => {
			event.preventDefault();
			event.returnValue = "";
		};
		window.addEventListener("beforeunload", onBefore);
		return () => window.removeEventListener("beforeunload", onBefore);
	}, [dirty]);
}
function parseAmount(value) {
	const number = Number(value.trim().replace(/,/g, ""));
	if (!Number.isFinite(number) || number < 0) return null;
	return Math.round(number * 100) / 100;
}
//#endregion
export { salutation as A, netsByMonth as C, projectedPosition as D, positionSize as E, useWarnUnsaved as F, weekDates as I, weekdayShort as L, searchDesk as M, tradePnl as N, releaseFact as O, useDesk as P, wikiTitles as R, kampalaToday as S, parseAmount as T, formatLongToday as _, Input as a, formatTime as b, Panel as c, Textarea as d, buildSnapshot as f, formatDay as g, customerBalance as h, Field as i, sampleCount as j, royaltyTotals as k, Select as l, cn as m, DataTable as n, Page as o, cashPosition as p, Empty as r, PageHead as s, Button as t, Stamp as u, formatMoney as v, owed as w, isLate as x, formatMonth as y };
