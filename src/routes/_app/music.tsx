import { createFileRoute } from "@tanstack/react-router";
import { MusicView } from "@/components/camos/views/music";

export const Route = createFileRoute("/_app/music")({
  head: () => ({ meta: [{ title: "Cam Leinad · CamOS" }] }),
  component: MusicView,
});
