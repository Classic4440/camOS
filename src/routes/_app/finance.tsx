import { createFileRoute } from "@tanstack/react-router";
import { FinanceView } from "@/components/camos/views/finance";

export const Route = createFileRoute("/_app/finance")({
  head: () => ({ meta: [{ title: "Finance · CamOS" }] }),
  component: FinanceView,
});
