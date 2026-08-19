import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ExternalLink, Search, Wrench, FolderOpen } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { tools } from "@/config/tools";
import { nexoraProjects } from "@/config/nexora-projects";
import { useProjects } from "@/lib/use-projects";
import { PROJECT_TYPE_LABEL } from "@/lib/types";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { projects } = useProjects();
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (fn: () => void) => {
    onOpenChange(false);
    fn();
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search tools, your creations and Nexora projects…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Tools">
          {tools.map((t) => (
            <CommandItem
              key={t.id}
              value={`${t.name} ${t.keywords.join(" ")}`}
              onSelect={() => go(() => navigate({ to: t.to }))}
            >
              <Wrench className="size-4 text-primary" />
              {t.name}
            </CommandItem>
          ))}
        </CommandGroup>
        {projects.length > 0 && (
          <CommandGroup heading="My creations">
            {projects.slice(0, 30).map((p) => (
              <CommandItem
                key={p.id}
                value={`${p.name} ${PROJECT_TYPE_LABEL[p.type]}`}
                onSelect={() =>
                  go(() =>
                    navigate({
                      to: tools.find((t) => t.id === p.type)?.to ?? "/creations",
                      search: { project: p.id },
                    }),
                  )
                }
              >
                <FolderOpen className="size-4 text-gold" />
                <span>{p.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {PROJECT_TYPE_LABEL[p.type]}
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="Nexora Projects">
          {nexoraProjects.map((p) => (
            <CommandItem
              key={p.id}
              value={`${p.name} ${p.description}`}
              onSelect={() => go(() => window.open(p.url, "_blank", "noopener,noreferrer"))}
            >
              <ExternalLink className="size-4 text-lapis" />
              {p.name}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

export function SearchTrigger({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-full max-w-sm items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 text-sm text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
    >
      <Search className="size-4" />
      <span className="truncate">Search Nexora…</span>
      <kbd className="ml-auto hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
