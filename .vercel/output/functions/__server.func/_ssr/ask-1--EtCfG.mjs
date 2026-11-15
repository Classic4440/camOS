import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ask-1--EtCfG.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var hourWindow = [];
var SYSTEM = `You are the desk analyst inside CamOS, the private operating desk of Muwonge Daniel Mark.
He is called Daniel, works professionally as DanielMac, and records as Cam Leinad on the label CAM (Cam All May).
Classic Brand is his garment customization shop in Matugga, Uganda.

Rules:
- The DESK JSON is the only operational data you have. Confirmed identity fields are facts. Everything else is a record he entered, and sample jobs are illustrations.
- Never claim you opened a website, repository, bank, DAW, or file. You cannot.
- Separate facts, records, and assumptions. If you assume, say "Assumption:".
- Challenge weak plans. Name the risk and the missing fact.
- Do not invent revenue, stream counts, or customer names.
- Keep UGX and USD apart. Never blend them into one total.
- Write plain sentences. No emoji. No markdown headings. At most three short recommended actions, each on its own line starting with a dash.
- Be concise. Prefer a decision, the reason, and the next physical action.`;
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
function textFrom(content) {
	if (typeof content === "string") return content.trim();
	if (!Array.isArray(content)) return "";
	return content.map((part) => {
		if (typeof part === "string") return part;
		if (part && typeof part === "object" && "text" in part) return String(part.text);
		return "";
	}).join("").trim();
}
var askDesk_createServerFn_handler = createServerRpc({
	id: "72bd5bdd933b8d9af7f21a61c29c17c209fac4c4baeb0a9e47fc7cf0232b97b8",
	name: "askDesk",
	filename: "src/lib/camos/ask.ts"
}, (opts) => askDesk.__executeServer(opts));
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
}).handler(askDesk_createServerFn_handler, async ({ data }) => {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "The desk analyst is not available in this environment."
	};
	const now = Date.now();
	while (hourWindow.length && now - (hourWindow[0] ?? 0) > 36e5) hourWindow.shift();
	if (hourWindow.length >= 30) return {
		ok: false,
		error: "The hourly limit is reached. Wait before another brief."
	};
	hourWindow.push(now);
	try {
		const res = await fetch("https://api.x.ai/v1/chat/completions", {
			method: "POST",
			signal: AbortSignal.timeout(25e3),
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`
			},
			body: JSON.stringify({
				model: "grok-4.5",
				temperature: .3,
				max_tokens: 700,
				messages: [
					{
						role: "system",
						content: SYSTEM
					},
					...data.history,
					{
						role: "user",
						content: `DESK:\n${data.snapshot || "{}"}\n\nQUESTION:\n${data.prompt}`
					}
				]
			})
		});
		if (!res.ok) return {
			ok: false,
			error: `The analyst could not answer (${res.status}). Nothing was invented in its place.`
		};
		const text = textFrom((await res.json()).choices?.[0]?.message?.content);
		if (!text) return {
			ok: false,
			error: "The analyst returned an empty brief."
		};
		return {
			ok: true,
			text
		};
	} catch {
		return {
			ok: false,
			error: "The analyst did not respond in time. Try once more."
		};
	}
});
//#endregion
export { askDesk_createServerFn_handler };
