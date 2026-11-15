import { createFileRoute } from "@tanstack/react-router";
import { TradingView } from "@/components/camos/views/trading";

export const Route = createFileRoute("/_app/trading")({
  head: () => ({ meta: [{ title: "Trading · CamOS" }] }),
  component: TradingView,
});
