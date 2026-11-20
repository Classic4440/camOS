import { createFileRoute } from "@tanstack/react-router";
import { CodesView } from "@/components/camos/views/codes";

export const Route = createFileRoute("/_app/codes")({
  head: () => ({ meta: [{ title: "Codes · CamOS" }] }),
  component: CodesView,
});
