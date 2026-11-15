import { createServerFn } from "@tanstack/react-start";

type HistoryItem = { role: "user" | "assistant"; content: string };

const hourWindow: number[] = [];

const SYSTEM = `You are the desk analyst inside CamOS, the private operating desk of Muwonge Daniel Mark.
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

function asHistory(value: unknown): HistoryItem[] {
  if (!Array.isArray(value)) return [];
  const items: HistoryItem[] = [];
  for (const entry of value.slice(-6)) {
    if (!entry || typeof entry !== "object") continue;
    const role = (entry as { role?: unknown }).role;
    const content = (entry as { content?: unknown }).content;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") continue;
    const text = content.trim().slice(0, 1800);
    if (text) items.push({ role, content: text });
  }
  return items;
}

function textFrom(content: unknown): string {
  if (typeof content === "string") return content.trim();
  if (!Array.isArray(content)) return "";
  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object" && "text" in part) return String((part as { text: unknown }).text);
      return "";
    })
    .join("")
    .trim();
}

export const askDesk = createServerFn({ method: "POST" })
  .validator((input: unknown) => {
    if (!input || typeof input !== "object") throw new Error("Invalid request");
    const raw = input as { prompt?: unknown; snapshot?: unknown; history?: unknown };
    const prompt = typeof raw.prompt === "string" ? raw.prompt.trim() : "";
    if (prompt.length < 2) throw new Error("Write a question first.");
    if (prompt.length > 4000) throw new Error("That question is too long for one brief.");
    const snapshot = typeof raw.snapshot === "string" ? raw.snapshot.slice(0, 4000) : "";
    return { prompt, snapshot, history: asHistory(raw.history) };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) return { ok: false as const, error: "The desk analyst is not available in this environment." };

    const now = Date.now();
    while (hourWindow.length && now - (hourWindow[0] ?? 0) > 60 * 60 * 1000) hourWindow.shift();
    if (hourWindow.length >= 30) {
      return { ok: false as const, error: "The hourly limit is reached. Wait before another brief." };
    }
    hourWindow.push(now);

    try {
      const res = await fetch("https://api.x.ai/v1/chat/completions", {
        method: "POST",
        signal: AbortSignal.timeout(25000),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "grok-4.5",
          temperature: 0.3,
          max_tokens: 700,
          messages: [
            { role: "system", content: SYSTEM },
            ...data.history,
            {
              role: "user",
              content: `DESK:\n${data.snapshot || "{}"}\n\nQUESTION:\n${data.prompt}`,
            },
          ],
        }),
      });
      if (!res.ok) {
        return { ok: false as const, error: `The analyst could not answer (${res.status}). Nothing was invented in its place.` };
      }
      const body = (await res.json()) as { choices?: { message?: { content?: unknown } }[] };
      const text = textFrom(body.choices?.[0]?.message?.content);
      if (!text) return { ok: false as const, error: "The analyst returned an empty brief." };
      return { ok: true as const, text };
    } catch {
      return { ok: false as const, error: "The analyst did not respond in time. Try once more." };
    }
  });
