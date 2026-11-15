import { useState } from "react";
import { buildSnapshot } from "@/lib/camos/calc";
import { formatTime, kampalaToday } from "@/lib/camos/format";
import { askDesk } from "@/lib/camos/ask";
import { useDesk } from "@/lib/camos/store";
import { Button, Page, PageHead, Textarea } from "@/components/camos/ui";

const PROMPTS = [
  "What should I finish before anything else, and what am I treating as urgent that is not?",
  "Is CAM-001 actually ready for RouteNote, or am I skipping a stage?",
  "Where can Classic Brand lose money if I trust the sample jobs?",
  "Which lab project is distracting me from the album and the shop?",
];

export function CommandView() {
  const settings = useDesk((state) => state.settings);
  const memos = useDesk((state) => state.memos);
  const addMemo = useDesk((state) => state.addMemo);
  const clearMemos = useDesk((state) => state.clearMemos);
  const noteAiUse = useDesk((state) => state.noteAiUse);
  const [prompt, setPrompt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
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
    const history = memos.slice(-6).map((memo) => ({ role: memo.role, content: memo.text }));
    addMemo({ role: "user", text: question });
    setPrompt("");
    try {
      const result = await askDesk({ data: { prompt: question, snapshot: buildSnapshot(useDesk.getState()), history } });
      if (!result.ok) {
        setError(result.error);
        return;
      }
      noteAiUse();
      addMemo({ role: "assistant", text: result.text });
    } catch (err) {
      setError(err instanceof Error ? err.message : "The brief failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Page>
      <PageHead
        kicker="Desk · Command"
        title="A brief, not a chat."
        lede="The brief reads a summary of this desk and the question you send. It does not open your site, bank, repositories, or FL Studio."
      />
      <div className="grid gap-10 lg:grid-cols-12">
        <aside className="lg:col-span-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Briefs today</p>
          <p className="mt-1 font-display text-4xl tabular-nums">
            {used}
            <span className="text-xl text-muted"> / {settings.aiLimit}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{left} remaining. Resets at midnight, Africa/Kampala. Each brief is capped.</p>
          <div className="mt-6 space-y-2">
            {PROMPTS.map((item) => (
              <button
                key={item}
                type="button"
                className="block w-full border-t border-line py-3 text-left text-sm hover:text-accent"
                onClick={() => setPrompt(item)}
              >
                {item}
              </button>
            ))}
          </div>
          <details className="mt-6 text-sm">
            <summary className="min-h-11 cursor-pointer font-semibold">What will be sent</summary>
            <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap border border-line bg-surface p-3 text-xs leading-relaxed text-muted">
              {snapshot}
            </pre>
          </details>
        </aside>
        <section className="lg:col-span-8">
          {memos.length === 0 ? (
            <p className="border-t border-line py-6 text-sm text-muted">
              No brief yet. Ask about the album, the shop, the lab, or the order of the day. Empty praise is a failed answer.
            </p>
          ) : (
            <ol className="border-t border-line">
              {memos.map((memo) => (
                <li key={memo.id} className="border-b border-line py-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-faint">
                    {memo.role === "user" ? settings.called : "Desk analyst"} · {formatTime(memo.at)}
                  </p>
                  <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">{memo.text}</p>
                </li>
              ))}
            </ol>
          )}
          {error ? (
            <p className="mt-4 text-sm text-rust" role="alert">
              {error}
            </p>
          ) : null}
          <div className="mt-4">
            <Textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Ask for a decision, not a compliment."
              aria-label="Question for the desk analyst"
              maxLength={4000}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button variant="primary" onClick={() => void send()} disabled={pending || left <= 0}>
                {pending ? "Writing the brief…" : "Send brief"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  clearMemos();
                  setError("");
                }}
                disabled={!memos.length || pending}
              >
                Clear correspondence
              </Button>
            </div>
          </div>
        </section>
      </div>
    </Page>
  );
}
