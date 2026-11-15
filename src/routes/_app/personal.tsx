import { createFileRoute } from "@tanstack/react-router";
import { PersonalView } from "@/components/camos/views/personal";

export const Route = createFileRoute("/_app/personal")({
  head: () => ({ meta: [{ title: "Personal · CamOS" }] }),
  component: PersonalView,
});
