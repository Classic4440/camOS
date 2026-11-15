import { useEffect, useState } from "react";
import { isLate } from "@/lib/camos/calc";
import { formatDay } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { HOUSE_LABEL, type House, type Priority } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { Button, DataTable, Empty, Field, Input, Page, PageHead, Panel, Select, Stamp, Textarea } from "@/components/camos/ui";

const HOUSES = Object.keys(HOUSE_LABEL) as House[];

export function PersonalView() {
  const tasks = useDesk((state) => state.tasks);
  const decisions = useDesk((state) => state.decisions);
  const composer = useDesk((state) => state.composer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const openComposer = useDesk((state) => state.openComposer);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const updateTask = useDesk((state) => state.updateTask);
  const removeTasks = useDesk((state) => state.removeTasks);
  const completeTasks = useDesk((state) => state.completeTasks);
  const updateDecision = useDesk((state) => state.updateDecision);
  const removeDecision = useDesk((state) => state.removeDecision);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [house, setHouse] = useState<House | "all">("all");
  const [status, setStatus] = useState<"open" | "done" | "all">("open");
  const [selected, setSelected] = useState<string[]>([]);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!focusId || !tasks.some((task) => task.id === focusId)) return;
    setSelected([focusId]);
    setStatus("all");
    setFocus(null);
  }, [focusId, tasks, setFocus]);

  const rows = tasks.filter((task) => (house === "all" || task.house === house) && (status === "all" || (status === "done" ? task.done : !task.done)));

  return (
    <Page>
      <PageHead
        kicker="Desk · Personal"
        title="What is actually on you."
        lede="Open work is listed first. A decision stays in its own list, under the tasks."
        actions={
          <>
            <Button variant="primary" onClick={() => openComposer("task")}>
              New task
            </Button>
            <Button onClick={() => openComposer("decision")}>New decision</Button>
          </>
        }
      />
      <div className="mb-4 space-y-2">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Task status">
          <Filter label="Open" active={status === "open"} onClick={() => setStatus("open")} />
          <Filter label="Done" active={status === "done"} onClick={() => setStatus("done")} />
          <Filter label="All tasks" active={status === "all"} onClick={() => setStatus("all")} />
        </div>
        <div className="flex gap-2 overflow-x-auto" role="group" aria-label="House">
          <Filter label="All houses" active={house === "all"} onClick={() => setHouse("all")} />
          {HOUSES.map((item) => (
            <Filter key={item} label={HOUSE_LABEL[item]} active={house === item} onClick={() => setHouse(item)} />
          ))}
        </div>
      </div>
      {selected.length ? (
        <div className="mb-3 flex flex-wrap items-center gap-2 border border-line bg-surface px-3 py-2">
          <span className="text-sm tabular-nums">{selected.length} selected</span>
          <Button
            variant="ghost"
            onClick={() => {
              completeTasks(selected);
              setSelected([]);
              flashMsg("Marked done.");
            }}
          >
            Mark done
          </Button>
          {confirmDelete ? (
            <>
              <span className="text-sm text-rust">Delete these tasks?</span>
              <Button
                variant="danger"
                onClick={() => {
                  removeTasks(selected);
                  setSelected([]);
                  setConfirmDelete(false);
                  flashMsg("Tasks deleted.");
                }}
              >
                Delete
              </Button>
              <Button variant="ghost" onClick={() => setConfirmDelete(false)}>
                Keep
              </Button>
            </>
          ) : (
            <Button variant="danger" onClick={() => setConfirmDelete(true)}>
              Delete
            </Button>
          )}
        </div>
      ) : null}
      <DataTable
        rows={rows}
        selected={selected}
        onSelected={setSelected}
        selectable
        searchText={(task) => `${task.title} ${task.notes} ${task.house}`}
        empty={{ title: "No tasks in this cut.", body: "Add the next real obligation, or switch the filter." }}
        columns={[
          { id: "title", header: "Task", sortValue: (task) => task.title, cell: (task) => task.title },
          {
            id: "house",
            header: "House",
            optional: true,
            sortValue: (task) => task.house,
            cell: (task) => HOUSE_LABEL[task.house],
          },
          {
            id: "priority",
            header: "Priority",
            sortValue: (task) => task.priority,
            cell: (task) => <span className="uppercase tracking-wide">{task.priority}</span>,
          },
          {
            id: "due",
            header: "Due",
            align: "right",
            sortValue: (task) => task.due ?? "9999",
            cell: (task) => (
              <span className={isLate(task.due, task.done) ? "text-rust" : undefined}>
                {formatDay(task.due)}
                {task.done ? " · done" : ""}
              </span>
            ),
          },
          {
            id: "act",
            header: "",
            cell: (task) => (
              <button type="button" className="min-h-11 text-sm font-semibold text-accent" onClick={() => updateTask(task.id, { done: !task.done })}>
                {task.done ? "Reopen" : "Done"}
              </button>
            ),
          },
        ]}
      />

      <section className="mt-12">
        <h2 className="font-display text-2xl">Decisions</h2>
        <p className="mt-1 mb-4 max-w-2xl text-sm text-muted">Write the question, the context, and — when you choose — the choice. Deferred is allowed. Pretending it is settled is not.</p>
        {decisions.length === 0 ? (
          <Empty title="No open questions recorded." body="A decision record is useful when two houses are competing for the same afternoon." action={<Button onClick={() => openComposer("decision")}>Record a decision</Button>} />
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {decisions.map((decision) => (
              <li key={decision.id} className="py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <p className="max-w-2xl font-semibold">{decision.question}</p>
                  <Stamp tone={decision.status === "open" ? "brass" : decision.status === "made" ? "moss" : "neutral"}>{decision.status}</Stamp>
                </div>
                {decision.context ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{decision.context}</p> : null}
                <div className="mt-3 grid gap-3 md:grid-cols-[12rem_1fr_auto]">
                  <Select
                    aria-label="Decision status"
                    value={decision.status}
                    onChange={(event) => updateDecision(decision.id, { status: event.target.value as typeof decision.status })}
                  >
                    <option value="open">Open</option>
                    <option value="made">Made</option>
                    <option value="deferred">Deferred</option>
                  </Select>
                  <Input
                    aria-label="Choice"
                    value={decision.choice}
                    placeholder="The choice, if made"
                    onChange={(event) => updateDecision(decision.id, { choice: event.target.value })}
                  />
                  <Button variant="danger" onClick={() => removeDecision(decision.id)}>
                    Remove
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
      <TaskPanel open={composer === "task"} onClose={closeComposer} />
      <DecisionPanel open={composer === "decision"} onClose={closeComposer} />
    </Page>
  );
}

function Filter({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("min-h-11 shrink-0 border px-3 text-sm", active ? "border-ink bg-ink text-paper" : "border-line bg-elevated text-ink")}
    >
      {label}
    </button>
  );
}

function TaskPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addTask = useDesk((state) => state.addTask);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [house, setHouse] = useState<House>("personal");
  const [priority, setPriority] = useState<Priority>("next");
  const [due, setDue] = useState("");
  const [error, setError] = useState("");

  function save() {
    if (title.trim().length < 2) {
      setError("Give the task a real name.");
      return;
    }
    addTask({ title: title.trim(), notes: notes.trim(), house, priority, due: due || null });
    setTitle("");
    setNotes("");
    setDue("");
    setError("");
    flashMsg("Task saved on this device.");
    onClose();
  }

  return (
    <Panel open={open} title="New task" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title (required)" error={error}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Notes">
          <Textarea value={notes} onChange={(event) => setNotes(event.target.value)} />
        </Field>
        <Field label="House">
          <Select value={house} onChange={(event) => setHouse(event.target.value as House)}>
            {HOUSES.map((item) => (
              <option key={item} value={item}>
                {HOUSE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Priority">
          <Select value={priority} onChange={(event) => setPriority(event.target.value as Priority)}>
            <option value="now">Now</option>
            <option value="next">Next</option>
            <option value="later">Later</option>
          </Select>
        </Field>
        <Field label="Due" hint="Leave blank if it has no date.">
          <Input type="date" value={due} onChange={(event) => setDue(event.target.value)} />
        </Field>
        <Button variant="primary" onClick={save}>
          Save task
        </Button>
      </div>
    </Panel>
  );
}

function DecisionPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addDecision = useDesk((state) => state.addDecision);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [question, setQuestion] = useState("");
  const [context, setContext] = useState("");
  const [house, setHouse] = useState<House>("personal");
  const [error, setError] = useState("");

  function save() {
    if (question.trim().length < 8) {
      setError("Write the question in a full sentence.");
      return;
    }
    addDecision({ question: question.trim(), context: context.trim(), house, status: "open", choice: "" });
    setQuestion("");
    setContext("");
    setError("");
    flashMsg("Decision recorded.");
    onClose();
  }

  return (
    <Panel open={open} title="New decision" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Question (required)" error={error}>
          <Textarea value={question} onChange={(event) => setQuestion(event.target.value)} />
        </Field>
        <Field label="Context">
          <Textarea value={context} onChange={(event) => setContext(event.target.value)} />
        </Field>
        <Field label="House">
          <Select value={house} onChange={(event) => setHouse(event.target.value as House)}>
            {HOUSES.map((item) => (
              <option key={item} value={item}>
                {HOUSE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Button variant="primary" onClick={save}>
          Save decision
        </Button>
      </div>
    </Panel>
  );
}
