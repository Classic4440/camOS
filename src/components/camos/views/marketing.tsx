import { useState } from "react";
import { formatDay } from "@/lib/camos/format";
import { useDesk } from "@/lib/camos/store";
import type { CampaignStatus } from "@/lib/camos/types";
import { Button, Empty, Field, Input, Page, PageHead, Panel, Select, Textarea } from "@/components/camos/ui";

export function MarketingView() {
  const campaigns = useDesk((state) => state.campaigns);
  const updateCampaign = useDesk((state) => state.updateCampaign);
  const removeCampaign = useDesk((state) => state.removeCampaign);
  const composer = useDesk((state) => state.composer);
  const openComposer = useDesk((state) => state.openComposer);
  const closeComposer = useDesk((state) => state.closeComposer);

  return (
    <Page>
      <PageHead
        kicker="Office · Marketing"
        title="Two audiences, two calendars."
        lede="Listeners and garment clients stay on separate calendars."
        actions={
          <Button variant="primary" onClick={() => openComposer("campaign")}>
            New campaign
          </Button>
        }
      />
      <div className="grid gap-10 lg:grid-cols-2">
        <Calendar title="Cam Leinad" rows={campaigns.filter((item) => item.house === "music")} onStatus={updateCampaign} onRemove={removeCampaign} />
        <Calendar title="Classic Brand" rows={campaigns.filter((item) => item.house === "brand")} onStatus={updateCampaign} onRemove={removeCampaign} />
      </div>
      <CampaignPanel open={composer === "campaign"} onClose={closeComposer} />
    </Page>
  );
}

function Calendar({
  title,
  rows,
  onStatus,
  onRemove,
}: {
  title: string;
  rows: { id: string; name: string; channel: string; start: string; end: string; status: CampaignStatus; note: string }[];
  onStatus: (id: string, patch: { status: CampaignStatus }) => void;
  onRemove: (id: string) => void;
}) {
  const ordered = [...rows].sort((a, b) => a.start.localeCompare(b.start));
  return (
    <section>
      <h2 className="border-t border-ink pt-3 font-display text-2xl">{title}</h2>
      {ordered.length === 0 ? (
        <Empty title="No campaign dated." body="Add one when there is a channel, a start, and an end. An undated wish is not a plan." />
      ) : (
        <ol className="mt-4 border-t border-line">
          {ordered.map((row) => (
            <li key={row.id} className="border-b border-line py-4">
              <p className="text-xs uppercase tracking-widest text-faint">
                {formatDay(row.start)} — {formatDay(row.end)}
              </p>
              <p className="mt-1 font-semibold">{row.name}</p>
              <p className="text-sm text-muted">
                {row.channel}
                {row.note ? ` · ${row.note}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Select aria-label="Campaign status" value={row.status} onChange={(event) => onStatus(row.id, { status: event.target.value as CampaignStatus })}>
                  <option value="planned">Planned</option>
                  <option value="live">Live</option>
                  <option value="done">Done</option>
                </Select>
                <Button variant="ghost" onClick={() => onRemove(row.id)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function CampaignPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const addCampaign = useDesk((state) => state.addCampaign);
  const [house, setHouse] = useState<"music" | "brand">("music");
  const [name, setName] = useState("");
  const [channel, setChannel] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  return (
    <Panel open={open} title="New campaign" onClose={onClose}>
      <div className="space-y-4">
        <Field label="House">
          <Select value={house} onChange={(event) => setHouse(event.target.value as "music" | "brand")}>
            <option value="music">Cam Leinad</option>
            <option value="brand">Classic Brand</option>
          </Select>
        </Field>
        <Field label="Name (required)" error={error}>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </Field>
        <Field label="Channel">
          <Input value={channel} onChange={(event) => setChannel(event.target.value)} placeholder="RouteNote, Instagram, shop front" />
        </Field>
        <Field label="Start">
          <Input type="date" value={start} onChange={(event) => setStart(event.target.value)} />
        </Field>
        <Field label="End">
          <Input type="date" value={end} onChange={(event) => setEnd(event.target.value)} />
        </Field>
        <Field label="Note">
          <Textarea value={note} onChange={(event) => setNote(event.target.value)} />
        </Field>
        <Button
          variant="primary"
          onClick={() => {
            if (name.trim().length < 2 || !start || !end || end < start) {
              setError("Name the campaign and give it a real date range.");
              return;
            }
            addCampaign({ house, name: name.trim(), channel: channel.trim(), start, end, status: "planned", note: note.trim() });
            setName("");
            setChannel("");
            setNote("");
            setError("");
            onClose();
          }}
        >
          Save campaign
        </Button>
      </div>
    </Panel>
  );
}
