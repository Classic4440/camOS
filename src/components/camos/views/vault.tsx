import { useEffect, useState } from "react";
import { wikiTitles } from "@/lib/camos/calc";
import { formatDay, kampalaToday } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import { cn } from "@/lib/utils";
import { Button, Empty, Field, Input, Page, PageHead, Panel, Textarea, useWarnUnsaved } from "@/components/camos/ui";

export function VaultView() {
  const notes = useDesk((state) => state.notes);
  const updateNote = useDesk((state) => state.updateNote);
  const removeNote = useDesk((state) => state.removeNote);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);
  const focusId = useDesk((state) => state.focusId);
  const setFocus = useDesk((state) => state.setFocus);
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");
  const [currentId, setCurrentId] = useState(notes[0]?.id ?? "");
  const [draft, setDraft] = useState("");
  const [title, setTitle] = useState("");
  const tags = ["all", ...new Set(notes.flatMap((note) => note.tags))];
  const shown = notes.filter((note) => {
    const text = `${note.title} ${note.body} ${note.tags.join(" ")}`.toLowerCase();
    return text.includes(query.trim().toLowerCase()) && (tag === "all" || note.tags.includes(tag));
  });
  const current = notes.find((note) => note.id === currentId) ?? null;
  const dirty = current ? draft !== current.body || title !== current.title : false;
  useWarnUnsaved(dirty);

  useEffect(() => {
    if (focusId && notes.some((note) => note.id === focusId)) {
      setCurrentId(focusId);
      setFocus(null);
    }
  }, [focusId, notes, setFocus]);

  useEffect(() => {
    if (!current) return;
    setDraft(current.body);
    setTitle(current.title);
  }, [current]);

  const links = current
    ? notes.filter((note) => note.id !== current.id && wikiTitles(current.body).some((item) => item.toLowerCase() === note.title.toLowerCase()))
    : [];
  const backlinks = current
    ? notes.filter((note) => note.id !== current.id && wikiTitles(note.body).some((item) => item.toLowerCase() === current.title.toLowerCase()))
    : [];

  return (
    <Page>
      <PageHead
        kicker="Records · Vault"
        title="Notes that point at each other."
        lede="Link notes with [[Title]]. Tag a page fact or idea so the two stay distinct."
        actions={
          <Button variant="primary" onClick={() => openComposer("note")}>
            New note
          </Button>
        }
      />
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search notes" aria-label="Search notes" />
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                className={cn("min-h-11 border px-3 text-sm", tag === item ? "border-ink bg-ink text-paper" : "border-line")}
              >
                {item}
              </button>
            ))}
          </div>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {shown.map((note) => (
              <li key={note.id}>
                <button type="button" className={cn("w-full py-3 text-left", currentId === note.id && "border-l-2 border-brass pl-3")} onClick={() => setCurrentId(note.id)}>
                  <span className="block font-semibold">{note.title}</span>
                  <span className="text-xs text-muted">{formatDay(note.updated)} · {note.tags.join(", ") || "untagged"}</span>
                </button>
              </li>
            ))}
          </ul>
          {shown.length === 0 ? <p className="mt-3 text-sm text-muted">No note matches.</p> : null}
        </div>
        <div className="lg:col-span-8">
          {current ? (
            <div>
              <Field label="Title">
                <Input value={title} onChange={(event) => setTitle(event.target.value)} />
              </Field>
              <Field label="Body" hint={dirty ? "Unsaved." : `Saved ${formatDay(current.updated)}.`}>
                <Textarea className="min-h-72" value={draft} onChange={(event) => setDraft(event.target.value)} />
              </Field>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    updateNote(current.id, { title: title.trim() || current.title, body: draft, updated: kampalaToday() });
                  }}
                >
                  Save note
                </Button>
                <Button variant="danger" onClick={() => removeNote(current.id)}>
                  Delete
                </Button>
              </div>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                <Connection title="Points to" notes={links} onOpen={setCurrentId} empty="No outgoing links." />
                <Connection title="Pointed from" notes={backlinks} onOpen={setCurrentId} empty="Nothing links here yet." />
              </div>
            </div>
          ) : (
            <Empty title="The vault is empty." body="Start with a fact you would be angry to lose." action={<Button onClick={() => openComposer("note")}>New note</Button>} />
          )}
        </div>
      </div>
      <NotePanel open={composer === "note"} onClose={closeComposer} />
    </Page>
  );
}

function Connection({
  title,
  notes,
  onOpen,
  empty,
}: {
  title: string;
  notes: { id: string; title: string }[];
  onOpen: (id: string) => void;
  empty: string;
}) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-faint">{title}</h2>
      {notes.length === 0 ? (
        <p className="mt-2 text-sm text-muted">{empty}</p>
      ) : (
        <ul className="mt-2 border-t border-line">
          {notes.map((note) => (
            <li key={note.id}>
              <button type="button" className="min-h-11 text-sm text-accent" onClick={() => onOpen(note.id)}>
                {note.title}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function NotePanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addNote = useDesk((state) => state.addNote);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel open={open} title="New note" onClose={onClose}>
      <div className="space-y-4">
        <Field label="Title (required)" error={error}>
          <Input value={title} onChange={(event) => setTitle(event.target.value)} />
        </Field>
        <Field label="Tags" hint="Comma separated. Use reading, confirmed, or shop.">
          <Input value={tags} onChange={(event) => setTags(event.target.value)} />
        </Field>
        <Field label="Body">
          <Textarea value={body} onChange={(event) => setBody(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            if (title.trim().length < 2) {
              setError("The note needs a title.");
              return;
            }
            addNote({
              title: title.trim(),
              body,
              tags: tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean),
            });
            setTitle("");
            setBody("");
            setTags("");
            setError("");
            onClose();
          }}
        >
          Save note
        </Button>
      </div>
    </Panel>
  );
}
