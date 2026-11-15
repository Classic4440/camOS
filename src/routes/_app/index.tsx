import { createFileRoute } from "@tanstack/react-router";
import { HomeView } from "@/components/camos/views/home";

export const Route = createFileRoute("/_app/")({
  component: HomeView,
});
