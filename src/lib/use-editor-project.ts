import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "sonner";

import { useProjects } from "./use-projects";
import type { ProjectType } from "./types";

export type SaveStatus = "idle" | "dirty" | "saving" | "saved" | "error";

interface Options<T> {
  type: ProjectType;
  defaultName: string;
  /** Current serializable editor state. */
  state: T;
  /** Called once when an existing project is opened. */
  onLoad: (data: T) => void;
  /** Optional data-url thumbnail generator. */
  getThumbnail?: () => string | null;
  /** Autosave toggle (defaults to on). */
  autosave?: boolean;
}

/**
 * Shared project plumbing for every Nexora editor: opens ?project=<id>,
 * autosaves debounced changes and reports save status.
 */
export function useEditorProject<T>(opts: Options<T>) {
  const { projects, save, isLoading, signedIn } = useProjects();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { project?: string };
  const [projectId, setProjectId] = useState<string | undefined>(search.project);
  const [name, setName] = useState(opts.defaultName);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const loadedRef = useRef<string | null>(null);
  const firstStateRef = useRef(true);
  const autosave = opts.autosave !== false;

  // Open an existing project once its record is available.
  useEffect(() => {
    const id = search.project;
    if (!id || isLoading || loadedRef.current === id) return;
    const record = projects.find((p) => p.id === id);
    if (!record) return;
    loadedRef.current = id;
    setProjectId(id);
    setName(record.name);
    try {
      opts.onLoad(JSON.parse(record.data) as T);
    } catch {
      toast.error("This project's data could not be read.");
    }
    firstStateRef.current = true;
    setStatus("saved");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.project, isLoading, projects]);

  const persist = async (opts2?: { silent?: boolean }) => {
    setStatus("saving");
    try {
      const record = await save.mutateAsync({
        ...(projectId ? { id: projectId } : {}),
        name,
        type: opts.type,
        data: opts.state,
        thumbnail: opts.getThumbnail?.() ?? null,
      });
      if (record.id !== projectId) {
        setProjectId(record.id);
        loadedRef.current = record.id;
        void navigate({ to: ".", search: { project: record.id }, replace: true });
      }
      setStatus("saved");
      if (!opts2?.silent) toast.success(signedIn ? "Saved to your account" : "Saved to this browser");
      return record;
    } catch (err) {
      setStatus("error");
      toast.error(err instanceof Error ? err.message : "Could not save project");
      return null;
    }
  };

  // Debounced autosave.
  useEffect(() => {
    if (firstStateRef.current) {
      firstStateRef.current = false;
      return;
    }
    if (!autosave) {
      setStatus("dirty");
      return;
    }
    setStatus("dirty");
    const t = setTimeout(() => {
      void persist({ silent: true });
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(opts.state), name, autosave]);

  // Warn before losing unsaved work.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (status === "dirty" || status === "saving") e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [status]);

  return { projectId, name, setName, status, saveNow: persist, signedIn };
}
