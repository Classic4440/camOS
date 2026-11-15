import { useEffect, useState } from "react";
import { royaltyTotals } from "@/lib/camos/calc";
import { formatDay, formatMoney, kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import {
  RELEASE_STAGE_LABEL,
  RELEASE_STAGES,
  type Certainty,
  type Currency,
  type ReleaseKind,
  type ReleaseStage,
} from "@/lib/camos/types";
import { cn } from "@/lib/utils";
import { Button, Empty, Field, Input, Page, Panel, Select, Textarea, parseAmount, useWarnUnsaved } from "@/components/camos/ui";

export function MusicView() {
  const releases = useDesk((state) => state.releases);
  const settings = useDesk((state) => state.settings);
  const sessions = useDesk((state) => state.sessions);
  const royalties = useDesk((state) => state.royalties);
  const composer = useDesk((state) => state.composer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const openComposer = useDesk((state) => state.openComposer);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const [currentId, setCurrentId] = useState(releases[0]?.id ?? "");
  const [stageFilter, setStageFilter] = useState<ReleaseStage | "all">("all");
  const [dirty, setDirty] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (focusId && releases.some((release) => release.id === focusId)) {
      setCurrentId(focusId);
      setFocus(null);
    }
  }, [focusId, releases, setFocus]);

  useEffect(() => {
    if (currentId && releases.some((release) => release.id === currentId)) return;
    setCurrentId(releases[0]?.id ?? "");
  }, [releases, currentId]);

  const counts = Object.fromEntries(RELEASE_STAGES.map((stage) => [stage, releases.filter((release) => release.stage === stage).length]));
  const shown = releases.filter((release) => stageFilter === "all" || release.stage === stageFilter);
  const current = releases.find((release) => release.id === currentId) ?? null;

  function askSelect(id: string) {
    if (id === currentId) return;
    if (dirty) {
      setPendingId(id);
      return;
    }
    setCurrentId(id);
  }

  return (
    <Page mark="brass">
      <header className="mb-6 grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-faint">CAM · {settings.label}</p>
          <h1 className="mt-1 font-display text-3xl font-medium leading-tight">{settings.artist}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted">
            {settings.genres.join(" · ")}. {settings.daw}.
          </p>
        </div>
        <Button variant="primary" onClick={() => openComposer("release")}>
          New release
        </Button>
      </header>
      <nav aria-label="Cam Leinad sections" className="mb-4 flex gap-1 overflow-x-auto border-b border-line">
        {[
          ["#catalog", "Catalog"],
          ["#sessions", "Sessions"],
          ["#royalties", "Royalties"],
        ].map(([href, label]) => (
          <a key={href} href={href} className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-muted hover:text-ink">
            {label}
          </a>
        ))}
      </nav>
      <StageFilter current={stageFilter} counts={counts} onPick={setStageFilter} />
      <div id="catalog" className="grid scroll-mt-4 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          {shown.length === 0 ? (
            <Empty title="Nothing in this stage." body="Clear the stage filter or add a release." />
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2">
              {shown.map((release) => (
                <li key={release.id}>
                  <Sleeve release={release} active={currentId === release.id} onSelect={() => askSelect(release.id)} />
                </li>
              ))}
            </ul>
          )}
          {pendingId ? (
            <p className="mt-4 text-sm text-rust" role="alert">
              Lyrics are unsaved.{" "}
              <button type="button" className="font-semibold underline" onClick={() => setPendingId(null)}>
                Stay
              </button>
            </p>
          ) : null}
        </div>
        <div className="lg:col-span-5">
          {current ? (
            <Liner
              releaseId={current.id}
              onDirty={setDirty}
              discardTo={pendingId}
              onDiscard={() => {
                if (pendingId) setCurrentId(pendingId);
                setPendingId(null);
                setDirty(false);
              }}
            />
          ) : (
            <Empty title="The catalog is empty." body="CAM-001 should live here once you add it. Start with the title you are actually finishing." />
          )}
        </div>
      </div>
      <Sessions />
      <Royalties />
      <ReleasePanel open={composer === "release"} onClose={closeComposer} />
    </Page>
  );
}

function StageFilter({
  current,
  counts,
  onPick,
}: {
  current: ReleaseStage | "all";
  counts: Record<string, number>;
  onPick: (stage: ReleaseStage | "all") => void;
}) {
  const stages = [{ id: "all" as const, label: "All" }, ...RELEASE_STAGES.map((id) => ({ id, label: RELEASE_STAGE_LABEL[id] }))];
  return (
    <div className="mb-5 flex gap-1 overflow-x-auto" role="tablist" aria-label="Release stage">
      {stages.map((stage) => {
        const active = current === stage.id;
        const count = stage.id === "all" ? null : (counts[stage.id] ?? 0);
        return (
          <button
            key={stage.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onPick(stage.id)}
            className={cn("inline-flex min-h-11 shrink-0 items-center gap-2 px-3 text-sm", active ? "bg-ink text-paper" : "text-muted hover:text-ink")}
          >
            <span className="font-semibold">{stage.label}</span>
            {count !== null ? <span className="tabular-nums">{count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

function Sleeve({
  release,
  active,
  onSelect,
}: {
  release: { catalog: string; title: string; kind: ReleaseKind; stage: ReleaseStage; tracks: unknown[] };
  active: boolean;
  onSelect: () => void;
}) {
  const album = release.kind === "album";
  const ep = release.kind === "ep";
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "relative flex aspect-square w-full flex-col justify-between overflow-hidden p-4 text-left",
        album ? "bg-catalog pl-6 text-catalog-ink" : "border border-ink bg-elevated text-ink",
        ep && "pt-6",
        active && "outline outline-2 outline-brass",
      )}
    >
      {album ? <span className="absolute inset-y-0 left-0 w-2 bg-sleeve" aria-hidden /> : null}
      {ep ? <span className="absolute inset-x-0 top-0 h-2 bg-catalog" aria-hidden /> : null}
      <span className={cn("flex items-center justify-between text-xs font-semibold uppercase tracking-widest", album ? "text-catalog-ink" : "text-muted")}>
        <span>CAM</span>
        <span className={album ? "text-sleeve" : undefined}>{release.catalog}</span>
      </span>
      <span>
        <span className="block font-display text-2xl leading-tight">{release.title}</span>
        <span className={cn("mt-2 block text-xs uppercase tracking-widest", album ? "text-catalog-ink" : "text-faint")}>{release.kind}</span>
      </span>
      <span className="flex items-end justify-between gap-2">
        <span className={cn("text-sm tabular-nums", album ? "text-catalog-ink" : "text-muted")}>
          {release.tracks.length} {release.tracks.length === 1 ? "track" : "tracks"}
        </span>
        <span className={cn("border px-1.5 py-0.5 text-xs font-semibold uppercase tracking-wide", album ? "border-sleeve text-sleeve" : "border-line text-muted")}>
          {RELEASE_STAGE_LABEL[release.stage]}
        </span>
      </span>
    </button>
  );
}

function Liner({
  releaseId,
  onDirty,
  discardTo,
  onDiscard,
}: {
  releaseId: string;
  onDirty: (dirty: boolean) => void;
  discardTo: string | null;
  onDiscard: () => void;
}) {
  const release = useDesk((state) => state.releases.find((item) => item.id === releaseId));
  const updateRelease = useDesk((state) => state.updateRelease);
  const removeRelease = useDesk((state) => state.removeRelease);
  const addTrack = useDesk((state) => state.addTrack);
  const updateTrack = useDesk((state) => state.updateTrack);
  const removeTrack = useDesk((state) => state.removeTrack);
  const flashMsg = useDesk((state) => state.flashMsg);
  const [lyrics, setLyrics] = useState(release?.lyrics ?? "");
  const [track, setTrack] = useState("");
  const [error, setError] = useState("");
  const dirty = lyrics !== (release?.lyrics ?? "");
  useWarnUnsaved(dirty);
  useEffect(() => onDirty(dirty), [dirty, onDirty]);
  useEffect(() => setLyrics(release?.lyrics ?? ""), [release?.id, release?.lyrics]);

  if (!release) return null;

  return (
    <article className="border border-line bg-elevated">
      <header className="border-b border-line px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-brass">{release.catalog}</p>
        <h2 className="font-display text-2xl leading-tight">{release.title}</h2>
        <p className="mt-1 text-sm text-muted">
          {release.kind} · {release.distribution || "Distribution not set"}
          {release.date ? ` · ${formatDay(release.date)}` : ""}
        </p>
      </header>
      <div className="space-y-4 px-4 py-4">
        <Field label="Stage">
          <Select value={release.stage} onChange={(event) => updateRelease(release.id, { stage: event.target.value as ReleaseStage })}>
            {RELEASE_STAGES.map((stage) => (
              <option key={stage} value={stage}>
                {RELEASE_STAGE_LABEL[stage]}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Notes">
          <Textarea value={release.notes} onChange={(event) => updateRelease(release.id, { notes: event.target.value })} />
        </Field>
        <div>
          <h3 className="text-sm font-semibold">Tracklist</h3>
          {release.tracks.length === 0 ? (
            <p className="mt-2 text-sm text-muted">No tracks yet. Do not invent titles — add the ones that exist.</p>
          ) : (
            <ul className="mt-2 divide-y divide-line border-y border-line">
              {release.tracks.map((item, index) => (
                <li key={item.id} className="grid gap-2 py-3 sm:grid-cols-[1.5rem_1fr_5rem_auto]">
                  <span className="tabular-nums text-faint">{index + 1}</span>
                  <Input aria-label="Track title" value={item.title} onChange={(event) => updateTrack(release.id, item.id, { title: event.target.value })} />
                  <Input aria-label="Duration" placeholder="3:12" value={item.duration} onChange={(event) => updateTrack(release.id, item.id, { duration: event.target.value })} />
                  <Button variant="ghost" onClick={() => removeTrack(release.id, item.id)}>
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-3 flex gap-2">
            <Input value={track} placeholder="Track title" aria-label="New track title" onChange={(event) => setTrack(event.target.value)} />
            <Button
              onClick={() => {
                if (track.trim().length < 1) return;
                addTrack(release.id, track.trim());
                setTrack("");
                flashMsg("Track added.");
              }}
            >
              Add
            </Button>
          </div>
        </div>
        <Field label="Lyrics" hint={dirty ? "Unsaved changes." : "Saved on this device."} error={error}>
          <Textarea className="min-h-48 font-display text-base" value={lyrics} onChange={(event) => setLyrics(event.target.value)} />
        </Field>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            onClick={() => {
              if (lyrics.length > 20000) {
                setError("Lyrics are too long for one release note.");
                return;
              }
              updateRelease(release.id, { lyrics });
              setError("");
              flashMsg("Lyrics saved.");
            }}
          >
            Save lyrics
          </Button>
          {discardTo ? (
            <Button variant="danger" onClick={onDiscard}>
              Discard and switch
            </Button>
          ) : null}
          <Button
            variant="danger"
            onClick={() => {
              removeRelease(release.id);
              flashMsg("Release removed.");
            }}
          >
            Delete release
          </Button>
        </div>
      </div>
    </article>
  );
}

function Sessions() {
  const sessions = useDesk((state) => state.sessions);
  const releases = useDesk((state) => state.releases);
  const addSession = useDesk((state) => state.addSession);
  const removeSession = useDesk((state) => state.removeSession);
  const [date, setDate] = useState(kampalaToday());
  const [hours, setHours] = useState("2");
  const [focus, setFocus] = useState("");
  const [releaseId, setReleaseId] = useState("");
  const [error, setError] = useState("");

  return (
    <section id="sessions" className="mt-12 scroll-mt-4">
      <h2 className="font-display text-2xl">Session log</h2>
      <p className="mt-1 mb-4 text-sm text-muted">Hours in FL Studio, tied to a release when you know which one.</p>
      <div className="grid gap-3 md:grid-cols-4">
        <Field label="Date">
          <Input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        </Field>
        <Field label="Hours" error={error}>
          <Input value={hours} inputMode="decimal" onChange={(event) => setHours(event.target.value)} />
        </Field>
        <Field label="Focus">
          <Input value={focus} onChange={(event) => setFocus(event.target.value)} placeholder="Drums, vocal, mix" />
        </Field>
        <Field label="Release">
          <Select value={releaseId} onChange={(event) => setReleaseId(event.target.value)}>
            <option value="">None</option>
            {releases.map((release) => (
              <option key={release.id} value={release.id}>
                {release.catalog}
              </option>
            ))}
          </Select>
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const value = parseAmount(hours);
          if (value === null || value <= 0 || value > 24) {
            setError("Hours should be between 0 and 24.");
            return;
          }
          addSession({ date, hours: value, focus: focus.trim(), releaseId: releaseId || null });
          setFocus("");
          setError("");
        }}
      >
        Log session
      </Button>
      {sessions.length ? (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {sessions.map((session) => (
            <li key={session.id} className="flex min-h-12 items-center justify-between gap-3 py-2 text-sm">
              <span>
                <span className="tabular-nums">{formatDay(session.date)}</span> · {session.hours}h · {session.focus || "Untitled session"}
              </span>
              <Button variant="ghost" onClick={() => removeSession(session.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function Royalties() {
  const royalties = useDesk((state) => state.royalties);
  const addRoyalty = useDesk((state) => state.addRoyalty);
  const removeRoyalty = useDesk((state) => state.removeRoyalty);
  const totals = royaltyTotals(royalties);
  const [period, setPeriod] = useState("");
  const [source, setSource] = useState("RouteNote");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<Currency>("USD");
  const [certainty, setCertainty] = useState<Certainty>("projected");
  const [error, setError] = useState("");

  return (
    <section id="royalties" className="mt-12 scroll-mt-4">
      <h2 className="font-display text-2xl">Royalties</h2>
      <p className="mt-1 max-w-2xl text-sm text-muted">
        Received and estimated stay apart. These figures are not copied into the finance ledger until you enter them there yourself.
      </p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <p className="border-t border-ink pt-2 text-sm">
          USD received <span className="ml-2 font-display text-2xl tabular-nums">{formatMoney(totals.USD.received, "USD")}</span>
          <span className="mt-1 block text-muted">Estimated {formatMoney(totals.USD.estimated, "USD")}</span>
        </p>
        <p className="border-t border-line pt-2 text-sm">
          UGX received <span className="ml-2 font-display text-2xl tabular-nums">{formatMoney(totals.UGX.received, "UGX")}</span>
          <span className="mt-1 block text-muted">Estimated {formatMoney(totals.UGX.estimated, "UGX")}</span>
        </p>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-5">
        <Field label="Period">
          <Input value={period} placeholder="2026-11" onChange={(event) => setPeriod(event.target.value)} />
        </Field>
        <Field label="Source">
          <Input value={source} onChange={(event) => setSource(event.target.value)} />
        </Field>
        <Field label="Amount" error={error}>
          <Input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value)} />
        </Field>
        <Field label="Currency">
          <Select value={currency} onChange={(event) => setCurrency(event.target.value as Currency)}>
            <option value="USD">USD</option>
            <option value="UGX">UGX</option>
          </Select>
        </Field>
        <Field label="Status">
          <Select value={certainty} onChange={(event) => setCertainty(event.target.value as Certainty)}>
            <option value="projected">Estimated</option>
            <option value="actual">Received</option>
          </Select>
        </Field>
      </div>
      <Button
        className="mt-3"
        onClick={() => {
          const value = parseAmount(amount);
          if (value === null || period.trim().length < 4 || source.trim().length < 2) {
            setError("Need a period, a source, and a real amount.");
            return;
          }
          addRoyalty({ period: period.trim(), source: source.trim(), amount: value, currency, certainty });
          setAmount("");
          setError("");
        }}
      >
        Add royalty
      </Button>
      {royalties.length ? (
        <ul className="mt-4 divide-y divide-line border-y border-line text-sm">
          {royalties.map((row) => (
            <li key={row.id} className="flex min-h-12 items-center justify-between gap-3 py-2">
              <span>
                {row.period} · {row.source} · {formatMoney(row.amount, row.currency)} · {row.certainty === "actual" ? "Received" : "Estimated"}
              </span>
              <Button variant="ghost" onClick={() => removeRoyalty(row.id)}>
                Remove
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-muted">No royalty rows yet. Leave this empty rather than guessing a payout.</p>
      )}
    </section>
  );
}

function ReleasePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addRelease = useDesk((state) => state.addRelease);
  const settings = useDesk((state) => state.settings);
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ReleaseKind>("single");
  const [stage, setStage] = useState<ReleaseStage>("writing");
  const [error, setError] = useState("");

  return (
    <Panel open={open} title="New release" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title (required)" error={error}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Kind">
          <Select value={kind} onChange={(event) => setKind(event.target.value as ReleaseKind)}>
            <option value="single">Single</option>
            <option value="ep">EP</option>
            <option value="album">Album</option>
          </Select>
        </Field>
        <Field label="Stage">
          <Select value={stage} onChange={(event) => setStage(event.target.value as ReleaseStage)}>
            {RELEASE_STAGES.map((item) => (
              <option key={item} value={item}>
                {RELEASE_STAGE_LABEL[item]}
              </option>
            ))}
          </Select>
        </Field>
        <Button
          variant="primary"
          onClick={() => {
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
              notes: "",
            });
            setTitle("");
            setError("");
            onClose();
          }}
        >
          Add to catalog
        </Button>
      </div>
    </Panel>
  );
}
