import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Search } from "lucide-react";

import { AppShell } from "@/components/AppShell";
import { ProjectCard } from "@/components/ProjectCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROJECT_TYPE_LABEL, type ProjectType } from "@/lib/types";
import { useProjects } from "@/lib/use-projects";
import { downloadProject } from "@/lib/download";

export const Route = createFileRoute("/creations")({
  validateSearch: (search: Record<string, unknown>) => ({
    project: typeof search["project"] === "string" ? (search["project"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "My Creations — Nexora" },
      {
        name: "description",
        content: "Browse, search, rename, duplicate and download every Minecraft creation you made in Nexora.",
      },
      { property: "og:title", content: "My Creations — Nexora" },
      { property: "og:description", content: "All of your Nexora Minecraft projects in one place." },
    ],
  }),
  component: CreationsPage,
});

function CreationsPage() {
  const { projects, isLoading, remove, rename, duplicate, favorite, signedIn } = useProjects();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<ProjectType | "all">("all");
  const [sort, setSort] = useState<"recent" | "oldest" | "name">("recent");

  const visible = useMemo(() => {
    let list = projects.filter(
      (p) =>
        (type === "all" || p.type === type) &&
        p.name.toLowerCase().includes(query.trim().toLowerCase()),
    );
    list = [...list].sort((a, b) => {
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "oldest") return a.updatedAt.localeCompare(b.updatedAt);
      return b.updatedAt.localeCompare(a.updatedAt);
    });
    return list;
  }, [projects, query, type, sort]);

  return (
    <AppShell>
      <header className="mb-5">
        <h1 className="font-display text-2xl font-bold">My Creations</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {signedIn
            ? "Saved to your Nexora account and available on every device."
            : "These projects are stored in this browser. Sign in to sync them to your account."}
        </p>
      </header>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your projects…"
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as ProjectType | "all")}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            {(Object.keys(PROJECT_TYPE_LABEL) as ProjectType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {PROJECT_TYPE_LABEL[t]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={(v) => setSort(v as typeof sort)}>
          <SelectTrigger className="w-[170px]">
            <SelectValue placeholder="Sort" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Recently modified</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="name">Name (A–Z)</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nothing here yet. Create something with any Nexora tool and it will show up automatically.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visible.map((p) => (
            <ProjectCard
              key={p.id}
              record={p}
              onRename={(id, name) => {
                rename.mutate({ id, name });
                toast.success("Project renamed");
              }}
              onDelete={(id) => {
                remove.mutate(id);
                toast.success("Project deleted");
              }}
              onDuplicate={(id) => {
                duplicate.mutate(id);
                toast.success("Project duplicated");
              }}
              onFavorite={(id, value) => favorite.mutate({ id, value })}
              onDownload={(record) => downloadProject(record)}
            />
          ))}
        </div>
      )}
    </AppShell>
  );
}
