import { createFileRoute } from "@tanstack/react-router";
import { LearnView } from "@/components/camos/views/learn";

export const Route = createFileRoute("/_app/learn")({
  head: () => ({ meta: [{ title: "Learning · CamOS" }] }),
  component: LearnView,
});
