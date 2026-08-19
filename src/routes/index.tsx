import { SignUpButton, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import {
  ArrowRight,
  Blocks,
  Boxes,
  Flag,
  Grid3x3,
  Plus,
  Shirt,
  Sparkles,
  Star,
  Terminal,
} from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { NexoraProjectsGrid } from "@/components/NexoraProjectsGrid";
import { ProjectThumb } from "@/components/ProjectCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/config/tools";
import { PROJECT_TYPE_LABEL } from "@/lib/types";
import { useProjects } from "@/lib/use-projects";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Nexora — Minecraft Creation Studio Dashboard" },
      {
        name: "description",
        content:
          "Your Nexora dashboard: continue editing skins, texture packs, commands, banners, builds and pixel art in one creator studio.",
      },
      { property: "og:title", content: "Nexora — Minecraft Creation Studio" },
      {
        property: "og:description",
        content: "Six pro Minecraft creation tools, one studio. Skins, texture packs, commands, banners, builds, pixel art.",
      },
    ],
  }),
  component: Dashboard,
});

const quickIcons = {
  skin: Shirt,
  "texture-pack": Boxes,
  command: Terminal,
  banner: Flag,
  build: Blocks,
  "pixel-art": Grid3x3,
} as const;

function Dashboard() {
  const { user } = useUser();
  const { projects, isLoading } = useProjects();
  const recent = projects.slice(0, 4);
  const favorites = projects.filter((p) => p.favorite).slice(0, 4);
  const firstName = user?.firstName ?? user?.username ?? "creator";

  return (
    <AppShell>
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-6 sm:p-8 animate-rise">
        <div className="pointer-events-none absolute inset-0 opacity-40 pixel-grid-bg" aria-hidden />
        <div className="relative">
          <SignedIn>
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <h1 className="mt-1 font-display text-3xl font-bold sm:text-4xl">
              {firstName} <span className="brand-gradient-text">👋</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Pick up where you left off, or start something new. Everything you make is saved to
              your Nexora account and synced across devices.
            </p>
          </SignedIn>
          <SignedOut>
            <Badge variant="secondary" className="mb-3">
              All-in-one Minecraft creation studio
            </Badge>
            <h1 className="font-display text-3xl font-bold sm:text-4xl">
              Build anything for Minecraft with <span className="brand-gradient-text">Nexora</span>
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Six pro-grade tools — skins, texture packs, commands, banners, builds and pixel art.
              Try them right now; create a free account to save your creations to the cloud.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <SignUpButton mode="modal">
                <Button>
                  Create free account <ArrowRight className="size-4" />
                </Button>
              </SignUpButton>
              <Button asChild variant="secondary">
                <Link to="/tools/skin">Try the Skin Editor</Link>
              </Button>
            </div>
          </SignedOut>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-lg font-semibold">Quick create</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => {
            const Icon = quickIcons[tool.id];
            return (
              <Link
                key={tool.id}
                to={tool.to}
                className="surface-card group flex items-start gap-3 p-4"
              >
                <span
                  className="grid size-10 shrink-0 place-items-center rounded-xl"
                  style={{ background: `color-mix(in oklab, var(--${tool.accent}) 22%, transparent)` }}
                >
                  <Icon className="size-5" style={{ color: `var(--${tool.accent})` }} />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1.5 font-display text-sm font-semibold">
                    New {tool.short}
                    <Plus className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {tool.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold">Continue editing</h2>
          <Button asChild variant="ghost" size="sm">
            <Link to="/creations">
              All creations <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        {isLoading ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-40 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : recent.length === 0 ? (
          <p className="mt-3 rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No projects yet — open any tool above and your work will appear here.
          </p>
        ) : (
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((p) => {
              const tool = tools.find((t) => t.id === p.type);
              return (
                <Link
                  key={p.id}
                  to={tool?.to ?? "/creations"}
                  search={{ project: p.id }}
                  className="surface-card overflow-hidden"
                >
                  <div className="checker-bg aspect-video border-b border-border">
                    <ProjectThumb record={p} />
                  </div>
                  <div className="p-3">
                    <p className="line-clamp-1 font-display text-sm font-semibold">{p.name}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {PROJECT_TYPE_LABEL[p.type]} ·{" "}
                      {formatDistanceToNow(new Date(p.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {favorites.length > 0 && (
        <section className="mt-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
            <Star className="size-4 fill-gold text-gold" /> Favorites
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {favorites.map((p) => {
              const tool = tools.find((t) => t.id === p.type);
              return (
                <Link
                  key={p.id}
                  to={tool?.to ?? "/creations"}
                  search={{ project: p.id }}
                  className="surface-card flex items-center gap-3 p-3"
                >
                  <span className="checker-bg size-12 shrink-0 overflow-hidden rounded-lg border border-border">
                    <ProjectThumb record={p} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-display text-sm font-semibold">{p.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {PROJECT_TYPE_LABEL[p.type]}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      <section className="mt-10">
        <div className="rounded-2xl border border-border bg-surface-2/60 p-5 sm:p-6">
          <div className="flex flex-wrap items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h2 className="font-display text-lg font-semibold">Check out other Nexora projects</h2>
            <Button asChild variant="ghost" size="sm" className="ml-auto">
              <Link to="/nexora-projects">
                See all <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
          <p className="mb-4 mt-1 text-sm text-muted-foreground">
            More tools built by the Nexora team.
          </p>
          <NexoraProjectsGrid />
        </div>
      </section>
    </AppShell>
  );
}
