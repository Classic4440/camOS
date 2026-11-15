import { createFileRoute } from "@tanstack/react-router";
import { AnalyticsView } from "@/components/camos/views/analytics";

export const Route = createFileRoute("/_app/analytics")({
  head: () => ({ meta: [{ title: "Analytics · CamOS" }] }),
  component: AnalyticsView,
});
