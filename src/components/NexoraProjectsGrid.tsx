import { ArrowUpRight, ExternalLink } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nexoraProjects } from "@/config/nexora-projects";

export function NexoraProjectsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {nexoraProjects.map((project) => (
        <article key={project.id} className="surface-card flex flex-col gap-3 p-5">
          <div className="flex items-center gap-3">
            {project.image ? (
              <img
                src={project.image}
                alt={`${project.name} logo`}
                className="size-11 rounded-xl object-cover"
                loading="lazy"
              />
            ) : (
              <span
                className="grid size-11 shrink-0 place-items-center rounded-xl font-display text-sm font-bold text-background"
                style={{ background: "var(--gradient-brand)" }}
              >
                {project.badge ?? project.name.slice(0, 2)}
              </span>
            )}
            <div>
              <h3 className="font-display text-base font-semibold">{project.name}</h3>
              {project.tag && (
                <Badge variant="secondary" className="mt-0.5 text-[10px]">
                  {project.tag}
                </Badge>
              )}
            </div>
            <ExternalLink className="ml-auto size-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          <Button asChild className="mt-auto w-full">
            <a href={project.url} target="_blank" rel="noopener noreferrer">
              Open Project <ArrowUpRight className="size-4" />
            </a>
          </Button>
        </article>
      ))}
    </div>
  );
}
