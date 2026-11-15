import { createFileRoute } from "@tanstack/react-router";
import { LabView } from "@/components/camos/views/lab";

export const Route = createFileRoute("/_app/lab")({
  head: () => ({ meta: [{ title: "Lab · CamOS" }] }),
  component: LabView,
});
