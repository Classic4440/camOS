import { createFileRoute } from "@tanstack/react-router";
import { IdeasView } from "@/components/camos/views/ideas";

export const Route = createFileRoute("/_app/ideas")({
  head: () => ({ meta: [{ title: "Ideas · CamOS" }] }),
  component: IdeasView,
});
