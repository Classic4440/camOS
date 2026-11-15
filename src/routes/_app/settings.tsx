import { createFileRoute } from "@tanstack/react-router";
import { SettingsView } from "@/components/camos/views/settings";

export const Route = createFileRoute("/_app/settings")({
  head: () => ({ meta: [{ title: "Settings · CamOS" }] }),
  component: SettingsView,
});
