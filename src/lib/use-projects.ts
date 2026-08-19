import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import {
  deleteProject,
  duplicateProject,
  listProjects,
  renameProject,
  saveProject,
  toggleFavoriteProject,
} from "./projects.functions";
import { localProjects } from "./local-store";
import type { NexoraProjectRecord, ProjectType } from "./types";

export interface SaveInput {
  id?: string;
  name: string;
  type: ProjectType;
  data: unknown;
  thumbnail?: string | null;
}

/** Cloud-backed for signed-in users, browser-backed for guests. */
export function useProjects() {
  const { isSignedIn, isLoaded } = useAuth();
  const qc = useQueryClient();
  const signedIn = Boolean(isSignedIn);

  const query = useQuery({
    queryKey: ["projects", signedIn],
    enabled: isLoaded,
    queryFn: async (): Promise<NexoraProjectRecord[]> =>
      signedIn ? await listProjects() : localProjects.list(),
  });

  const invalidate = useCallback(() => {
    void qc.invalidateQueries({ queryKey: ["projects"] });
  }, [qc]);

  const save = useMutation({
    mutationFn: async (input: SaveInput): Promise<NexoraProjectRecord> => {
      const payload = {
        name: input.name,
        type: input.type,
        data: JSON.stringify(input.data ?? {}),
        thumbnail: input.thumbnail ?? null,
      };
      if (signedIn) {
        const isCloudId = input.id && !input.id.startsWith("local_");
        return await saveProject({
          data: isCloudId ? { id: input.id, ...payload } : payload,
        });
      }
      return localProjects.save(input.id ? { id: input.id, ...payload } : payload);
    },
    onSuccess: invalidate,
  });

  const remove = useMutation({
    mutationFn: async (id: string) => {
      if (signedIn && !id.startsWith("local_")) await deleteProject({ data: { id } });
      else localProjects.remove(id);
    },
    onSuccess: invalidate,
  });

  const rename = useMutation({
    mutationFn: async ({ id, name }: { id: string; name: string }) => {
      if (signedIn && !id.startsWith("local_")) await renameProject({ data: { id, name } });
      else localProjects.rename(id, name);
    },
    onSuccess: invalidate,
  });

  const duplicate = useMutation({
    mutationFn: async (id: string) => {
      if (signedIn && !id.startsWith("local_")) await duplicateProject({ data: { id } });
      else localProjects.duplicate(id);
    },
    onSuccess: invalidate,
  });

  const favorite = useMutation({
    mutationFn: async ({ id, value }: { id: string; value: boolean }) => {
      if (signedIn && !id.startsWith("local_"))
        await toggleFavoriteProject({ data: { id, favorite: value } });
      else localProjects.toggleFavorite(id);
    },
    onSuccess: invalidate,
  });

  return {
    projects: query.data ?? [],
    isLoading: query.isLoading || !isLoaded,
    signedIn,
    save,
    remove,
    rename,
    duplicate,
    favorite,
    refetch: query.refetch,
  };
}

export function parseProjectData<T>(record: NexoraProjectRecord | null | undefined, fallback: T): T {
  if (!record) return fallback;
  try {
    return JSON.parse(record.data) as T;
  } catch {
    return fallback;
  }
}
