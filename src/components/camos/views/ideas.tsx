import { useEffect, useState } from "react";
import { useDesk } from "@/lib/camos/store";
import type { IdeaStatus } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { Button, Empty, Field, Input, Page, PageHead, Panel, Textarea } from "@/components/camos/ui";

const STATUS: Record<IdeaStatus, string> = {
  raw: "Raw",
  testing: "Testing",
  committed: "Committed",
  shelved: "Shelved",
};

export function IdeasView() {
  const ideas = useDesk((state) => state.ideas);
  const updateIdea = useDesk((state) => state.updateIdea);
  const removeIdea = useDesk((state) => state.removeIdea);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const [filter, setFilter] = useState<IdeaStatus | "all">("all");

  useEffect(() => {
    if (focusId && ideas.some((idea) => idea.id === focusId)) setFocus(null);
  }, [focusId, ideas, setFocus]);

  const shown = ideas.filter((idea) => filter === "all" || idea.status === filter);

  return (
    <Page>
      <PageHead
        kicker="Records · Ideas"
        title="Score it before you love it."
        lede="Each sheet keeps a thesis, the risks, a score out of ten, and a status."
        actions={
          <Button variant="primary" onClick={() => openComposer("idea")}>
            New idea
          </Button>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {(["all", "raw", "testing", "committed", "shelved"] as const).map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={cn("min-h-11 border px-3 text-sm", filter === item ? "border-ink bg-ink text-paper" : "border-line")}
          >
            {item === "all" ? "All" : STATUS[item]}
          </button>
        ))}
      </div>
      {shown.length === 0 ? (
        <Empty title="No ideas on this desk." body="Write the thesis in one or two sentences. If you cannot name the risk, it is not ready to build." action={<Button onClick={() => openComposer("idea")}>Start a sheet</Button>} />
      ) : (
        <ul className="space-y-6">
          {shown.map((idea) => (
            <li key={idea.id} className="border border-line bg-elevated">
              <div className="flex items-start justify-between gap-3 border-b border-dashed border-line px-4 py-3">
                <h2 className="font-display text-2xl">{idea.title}</h2>
                <p className="font-display text-2xl tabular-nums">
                  {idea.score}
                  <span className="text-base text-muted"> / 10</span>
                </p>
              </div>
              <div className="space-y-3 px-4 py-4">
                <p className="text-sm leading-relaxed">{idea.thesis}</p>
                <Field label="Risks">
                  <Textarea value={idea.risks} onChange={(event) => updateIdea(idea.id, { risks: event.target.value })} />
                </Field>
                <Field label="Next physical step">
                  <Input value={idea.next} onChange={(event) => updateIdea(idea.id, { next: event.target.value })} />
                </Field>
                <div className="flex flex-wrap gap-1" role="group" aria-label="Score">
                  {Array.from({ length: 10 }, (_, index) => index + 1).map((score) => (
                    <button
                      key={score}
                      type="button"
                      aria-pressed={idea.score === score}
                      onClick={() => updateIdea(idea.id, { score })}
                      className={cn("inline-flex size-11 items-center justify-center border text-sm tabular-nums", idea.score === score ? "border-ink bg-ink text-paper" : "border-line")}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(STATUS) as IdeaStatus[]).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => updateIdea(idea.id, { status })}
                      className={cn("min-h-11 border px-3 text-sm", idea.status === status ? "border-brass text-brass" : "border-line text-muted")}
                    >
                      {STATUS[status]}
                    </button>
                  ))}
                  <Button variant="danger" onClick={() => removeIdea(idea.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <IdeaPanel open={composer === "idea"} onClose={closeComposer} />
    </Page>
  );
}

function IdeaPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addIdea = useDesk((state) => state.addIdea);
  const [title, setTitle] = useState("");
  const [thesis, setThesis] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel open={open} title="New idea" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title (required)" error={error}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Thesis">
          <Textarea value={thesis} onChange={(event) => setThesis(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            if (title.trim().length < 2) {
              setError("Name the idea.");
              return;
            }
            addIdea({ title: title.trim(), thesis: thesis.trim(), risks: "", next: "", score: 5, status: "raw" });
            setTitle("");
            setThesis("");
            setError("");
            onClose();
          }}
        >
          Open sheet
        </Button>
      </div>
    </Panel>
  );
}
