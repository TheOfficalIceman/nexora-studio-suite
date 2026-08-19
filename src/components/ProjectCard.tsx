import { Link } from "@tanstack/react-router";
import { formatDistanceToNow } from "date-fns";
import { Copy, Download, MoreVertical, Pencil, Star, Trash2 } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { tools } from "@/config/tools";
import { PROJECT_TYPE_LABEL, type NexoraProjectRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProjectThumb({ record, className }: { record: NexoraProjectRecord; className?: string }) {
  if (record.thumbnail) {
    return (
      <img
        src={record.thumbnail}
        alt={`${record.name} preview`}
        loading="lazy"
        className={cn("size-full object-contain [image-rendering:pixelated]", className)}
      />
    );
  }
  return (
    <div className={cn("grid size-full place-items-center pixel-grid-bg", className)}>
      <span className="font-display text-sm text-muted-foreground">
        {PROJECT_TYPE_LABEL[record.type]}
      </span>
    </div>
  );
}

export function ProjectCard({
  record,
  onRename,
  onDelete,
  onDuplicate,
  onFavorite,
  onDownload,
}: {
  record: NexoraProjectRecord;
  onRename: (id: string, name: string) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onFavorite: (id: string, value: boolean) => void;
  onDownload: (record: NexoraProjectRecord) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(record.name);
  const tool = tools.find((t) => t.id === record.type);

  return (
    <div className="surface-card group flex flex-col overflow-hidden animate-rise">
      <Link
        to={tool?.to ?? "/creations"}
        search={{ project: record.id }}
        className="checker-bg block aspect-[4/3] w-full overflow-hidden border-b border-border"
      >
        <ProjectThumb record={record} className="transition-transform duration-300 group-hover:scale-105" />
      </Link>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-start gap-2">
          {editing ? (
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onBlur={() => {
                setEditing(false);
                if (draft.trim() && draft !== record.name) onRename(record.id, draft.trim());
              }}
              onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
              className="w-full rounded border border-input bg-background px-2 py-1 text-sm"
            />
          ) : (
            <p className="line-clamp-1 flex-1 font-display text-sm font-semibold">{record.name}</p>
          )}
          <button
            onClick={() => onFavorite(record.id, !record.favorite)}
            aria-label={record.favorite ? "Remove from favorites" : "Add to favorites"}
            className="text-muted-foreground transition-colors hover:text-gold"
          >
            <Star className={cn("size-4", record.favorite && "fill-gold text-gold")} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-muted-foreground hover:text-foreground" aria-label="Project actions">
                <MoreVertical className="size-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setEditing(true)}>
                <Pencil className="size-4" /> Rename
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(record.id)}>
                <Copy className="size-4" /> Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDownload(record)}>
                <Download className="size-4" /> Download
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => onDelete(record.id)}>
                <Trash2 className="size-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-auto flex items-center justify-between gap-2">
          <Badge variant="secondary" className="text-[10px]">
            {PROJECT_TYPE_LABEL[record.type]}
          </Badge>
          <span className="text-[11px] text-muted-foreground">
            {formatDistanceToNow(new Date(record.updatedAt), { addSuffix: true })}
          </span>
        </div>
        <Button asChild size="sm" variant="secondary" className="mt-1">
          <Link to={tool?.to ?? "/creations"} search={{ project: record.id }}>
            Continue editing
          </Link>
        </Button>
      </div>
    </div>
  );
}
