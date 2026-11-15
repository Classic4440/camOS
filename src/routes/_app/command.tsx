import { createFileRoute } from "@tanstack/react-router";
import { CommandView } from "@/components/camos/views/command";

export const Route = createFileRoute("/_app/command")({
  head: () => ({ meta: [{ title: "Command · CamOS" }] }),
  component: CommandView,
});
