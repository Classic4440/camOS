import { createFileRoute } from "@tanstack/react-router";
import { MarketingView } from "@/components/camos/views/marketing";

export const Route = createFileRoute("/_app/marketing")({
  head: () => ({ meta: [{ title: "Marketing · CamOS" }] }),
  component: MarketingView,
});
