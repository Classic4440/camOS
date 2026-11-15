import { useEffect, useState } from "react";
import { kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import type { ProjectStatus } from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { Button, Empty, Field, Input, Page, Select, Stamp, Textarea } from "@/components/camos/ui";

const STATUS: Record<ProjectStatus, string> = {
  recorded: "Recorded",
  active: "Active",
  paused: "Paused",
  shipped: "Shipped",
};

export function LabView() {
  const projects = useDesk((state) => state.projects);
  const bugs = useDesk((state) => state.bugs);
  const decisions = useDesk((state) => state.techDecisions);
  const deploys = useDesk((state) => state.deploys);
  const updateProject = useDesk((state) => state.updateProject);
  const updateBug = useDesk((state) => state.updateBug);
  const removeBug = useDesk((state) => state.removeBug);
  const addTechDecision = useDesk((state) => state.addTechDecision);
  const removeTechDecision = useDesk((state) => state.removeTechDecision);
  const addDeploy = useDesk((state) => state.addDeploy);
  const removeDeploy = useDesk((state) => state.removeDeploy);
  const addBug = useDesk((state) => state.addBug);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");
  const [currentId, setCurrentId] = useState(projects[0]?.id ?? "");
  const [bugTitle, setBugTitle] = useState("");
  const [decisionTitle, setDecisionTitle] = useState("");
  const [choice, setChoice] = useState("");
  const [deployNote, setDeployNote] = useState("");

  useEffect(() => {
    if (focusId && projects.some((project) => project.id === focusId)) {
      setCurrentId(focusId);
      setFocus(null);
    }
  }, [focusId, projects, setFocus]);

  const shown = projects.filter((project) => {
    const matches = `${project.name} ${project.summary} ${project.stack}`.toLowerCase().includes(query.trim().toLowerCase());
    return matches && (status === "all" || project.status === status);
  });
  const current = projects.find((project) => project.id === currentId) ?? shown[0] ?? null;

  return (
    <Page mark="dashed">
      <header className="mb-6 flex flex-col gap-3 border-b border-dashed border-line pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">Development lab</p>
          <h1 className="mt-1 font-display text-3xl font-medium leading-tight">Projects on record</h1>
          <p className="mt-2 text-sm text-muted">
            {projects.filter((project) => project.status === "active").length} active · {bugs.filter((bug) => bug.open).length} open defects
          </p>
        </div>
      </header>
      <div className="mb-4 flex flex-col gap-2 sm:flex-row">
        <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Filter projects" aria-label="Filter projects" className="sm:max-w-xs" />
        <Select aria-label="Status" value={status} className="sm:max-w-48" onChange={(event) => setStatus(event.target.value as ProjectStatus | "all")}>
          <option value="all">All statuses</option>
          {(Object.keys(STATUS) as ProjectStatus[]).map((item) => (
            <option key={item} value={item}>
              {STATUS[item]}
            </option>
          ))}
        </Select>
      </div>
      <div className="grid gap-8 lg:grid-cols-12">
        <ul className="border-t border-line lg:col-span-5">
          {shown.map((project) => (
            <li key={project.id} className="border-b border-line">
              <button
                type="button"
                onClick={() => setCurrentId(project.id)}
                className={cn("flex w-full min-h-14 flex-col items-start justify-center px-1 py-3 text-left", current?.id === project.id && "bg-surface")}
              >
                <span className="flex w-full items-baseline justify-between gap-3">
                  <span className="font-semibold">{project.name}</span>
                  <span className="shrink-0 text-xs font-semibold uppercase tracking-widest text-faint">{STATUS[project.status]}</span>
                </span>
                <span className="truncate text-sm text-muted">{project.stack}</span>
              </button>
            </li>
          ))}
          {shown.length === 0 ? <li className="py-6 text-sm text-muted">No project matches.</li> : null}
        </ul>
        <article className="lg:col-span-7">
          {current ? (
            <div className="space-y-5">
              <header>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl">{current.name}</h2>
                  <Stamp tone={current.status === "active" ? "brass" : "neutral"}>{STATUS[current.status]}</Stamp>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted">{current.summary}</p>
                {current.href ? (
                  <a className="mt-2 inline-block text-sm text-accent underline" href={current.href} target="_blank" rel="noreferrer">
                    {current.href}
                  </a>
                ) : null}
              </header>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Status">
                  <Select value={current.status} onChange={(event) => updateProject(current.id, { status: event.target.value as ProjectStatus })}>
                    {(Object.keys(STATUS) as ProjectStatus[]).map((item) => (
                      <option key={item} value={item}>
                        {STATUS[item]}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Stack">
                  <Input value={current.stack} onChange={(event) => updateProject(current.id, { stack: event.target.value })} />
                </Field>
              </div>
              <Field label="Working notes">
                <Textarea value={current.notes} onChange={(event) => updateProject(current.id, { notes: event.target.value })} />
              </Field>
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-faint">Defects</h3>
                {bugs.filter((bug) => bug.projectId === current.id).length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No defects filed.</p>
                ) : (
                  <ul className="mt-2 divide-y divide-line border-y border-line">
                    {bugs
                      .filter((bug) => bug.projectId === current.id)
                      .map((bug) => (
                        <li key={bug.id} className="flex items-center justify-between gap-3 py-2 text-sm">
                          <span className={bug.open ? "" : "text-muted line-through"}>
                            {bug.title} · {bug.severity}
                          </span>
                          <span className="flex gap-1">
                            <Button variant="ghost" onClick={() => updateBug(bug.id, { open: !bug.open })}>
                              {bug.open ? "Close" : "Reopen"}
                            </Button>
                            <Button variant="ghost" onClick={() => removeBug(bug.id)}>
                              Remove
                            </Button>
                          </span>
                        </li>
                      ))}
                  </ul>
                )}
                <div className="mt-2 flex gap-2">
                  <Input value={bugTitle} placeholder="What broke" aria-label="Defect" onChange={(event) => setBugTitle(event.target.value)} />
                  <Button
                    onClick={() => {
                      if (bugTitle.trim().length < 3) return;
                      addBug({ projectId: current.id, title: bugTitle.trim(), severity: "med" });
                      setBugTitle("");
                    }}
                  >
                    File
                  </Button>
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-faint">Decisions</h3>
                <ul className="mt-2 space-y-2">
                  {decisions
                    .filter((item) => item.projectId === current.id)
                    .map((item) => (
                      <li key={item.id} className="border-t border-line py-2 text-sm">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-muted">{item.choice}</p>
                        <button type="button" className="mt-1 text-rust" onClick={() => removeTechDecision(item.id)}>
                          Remove
                        </button>
                      </li>
                    ))}
                </ul>
                <div className="mt-2 grid gap-2">
                  <Input value={decisionTitle} placeholder="Decision" aria-label="Decision title" onChange={(event) => setDecisionTitle(event.target.value)} />
                  <Input value={choice} placeholder="What you chose, and why" aria-label="Decision choice" onChange={(event) => setChoice(event.target.value)} />
                  <Button
                    onClick={() => {
                      if (decisionTitle.trim().length < 3 || choice.trim().length < 3) return;
                      addTechDecision({ projectId: current.id, title: decisionTitle.trim(), choice: choice.trim(), date: kampalaToday() });
                      setDecisionTitle("");
                      setChoice("");
                    }}
                  >
                    Record decision
                  </Button>
                </div>
              </section>
              <section>
                <h3 className="text-sm font-semibold uppercase tracking-widest text-faint">Deploys</h3>
                {deploys.filter((item) => item.projectId === current.id).length === 0 ? (
                  <p className="mt-2 text-sm text-muted">No deploy has been logged. Add one only after it happens.</p>
                ) : null}
                <ul className="mt-2">
                  {deploys
                    .filter((item) => item.projectId === current.id)
                    .map((item) => (
                      <li key={item.id} className="flex items-center justify-between border-t border-line py-2 text-sm">
                        <span>
                          {item.at} · {item.env} · {item.note}
                        </span>
                        <Button variant="ghost" onClick={() => removeDeploy(item.id)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                </ul>
                <div className="mt-2 flex gap-2">
                  <Input value={deployNote} placeholder="What shipped" aria-label="Deploy note" onChange={(event) => setDeployNote(event.target.value)} />
                  <Button
                    onClick={() => {
                      if (deployNote.trim().length < 2) return;
                      addDeploy({ projectId: current.id, env: "production", at: kampalaToday(), note: deployNote.trim() });
                      setDeployNote("");
                    }}
                  >
                    Log deploy
                  </Button>
                </div>
              </section>
            </div>
          ) : (
            <Empty title="No project selected." body="The lab index is empty." />
          )}
        </article>
      </div>
    </Page>
  );
}
