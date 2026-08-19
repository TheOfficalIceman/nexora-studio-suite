import { Check, CloudUpload, Loader2, Save, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { SaveStatus } from "@/lib/use-editor-project";

export function SaveBar({
  name,
  setName,
  status,
  onSave,
  signedIn,
  children,
}: {
  name: string;
  setName: (v: string) => void;
  status: SaveStatus;
  onSave: () => void;
  signedIn: boolean;
  children?: React.ReactNode;
}) {
  const label: Record<SaveStatus, string> = {
    idle: signedIn ? "Not saved yet" : "Local project",
    dirty: "Unsaved changes",
    saving: "Saving…",
    saved: signedIn ? "Saved to your account" : "Saved in this browser",
    error: "Save failed",
  };

  const Icon =
    status === "saving"
      ? Loader2
      : status === "saved"
        ? Check
        : status === "error"
          ? TriangleAlert
          : CloudUpload;

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-surface p-3">
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="h-9 w-full max-w-xs font-display font-semibold"
        aria-label="Project name"
      />
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className={`size-3.5 ${status === "saving" ? "animate-spin" : ""}`} />
        {label[status]}
      </span>
      <div className="ml-auto flex flex-wrap items-center gap-2">
        {children}
        <Button size="sm" onClick={onSave} disabled={status === "saving"}>
          <Save className="size-4" /> Save
        </Button>
      </div>
    </div>
  );
}
