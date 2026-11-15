import { createFileRoute } from "@tanstack/react-router";
import { VaultView } from "@/components/camos/views/vault";

export const Route = createFileRoute("/_app/vault")({
  head: () => ({ meta: [{ title: "Vault · CamOS" }] }),
  component: VaultView,
});
