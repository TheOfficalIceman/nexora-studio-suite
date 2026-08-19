import { createFileRoute } from "@tanstack/react-router";

import { AppShell } from "@/components/AppShell";
import { NexoraProjectsGrid } from "@/components/NexoraProjectsGrid";

export const Route = createFileRoute("/nexora-projects")({
  head: () => ({
    meta: [
      { title: "Nexora Projects — Explore the Nexora suite" },
      {
        name: "description",
        content: "Every project built by the Nexora team, including Nexora AI. Open any project in a new tab.",
      },
      { property: "og:title", content: "Nexora Projects" },
      { property: "og:description", content: "Explore the other projects built by the Nexora team." },
    ],
  }),
  component: NexoraProjectsPage,
});

function NexoraProjectsPage() {
  return (
    <AppShell>
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold">Nexora Projects</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Other things we build at Nexora. Each opens in a new tab.
        </p>
      </header>
      <NexoraProjectsGrid />
    </AppShell>
  );
}
