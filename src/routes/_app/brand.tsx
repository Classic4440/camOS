import { createFileRoute } from "@tanstack/react-router";
import { BrandView } from "@/components/camos/views/brand";

export const Route = createFileRoute("/_app/brand")({
  head: () => ({ meta: [{ title: "Classic Brand · CamOS" }] }),
  component: BrandView,
});
