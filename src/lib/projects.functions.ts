import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { NexoraProjectRecord } from "./types";

const projectTypes = z.enum([
  "skin",
  "texture-pack",
  "command",
  "banner",
  "build",
  "pixel-art",
]);

export const listProjects = createServerFn({ method: "POST" }).handler(
  async (): Promise<NexoraProjectRecord[]> => {
    const { requireUser, toRecord } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { data, error } = await db
      .from("projects")
      .select("id,name,type,data,thumbnail,favorite,created_at,updated_at")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(toRecord);
  },
);

export const getProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data: input }): Promise<NexoraProjectRecord | null> => {
    const { requireUser, toRecord } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { data, error } = await db
      .from("projects")
      .select("id,name,type,data,thumbnail,favorite,created_at,updated_at")
      .eq("user_id", userId)
      .eq("id", input.id)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? toRecord(data) : null;
  });

export const saveProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        id: z.string().uuid().optional(),
        name: z.string().min(1).max(120),
        type: projectTypes,
        data: z.unknown(),
        thumbnail: z.string().nullable().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data: input }): Promise<NexoraProjectRecord> => {
    const { requireUser, toRecord } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const payload = {
      user_id: userId,
      name: input.name,
      type: input.type,
      data: (input.data ?? {}) as never,
      thumbnail: input.thumbnail ?? null,
      updated_at: new Date().toISOString(),
    };
    if (input.id) {
      const { data, error } = await db
        .from("projects")
        .update(payload)
        .eq("id", input.id)
        .eq("user_id", userId)
        .select("id,name,type,data,thumbnail,favorite,created_at,updated_at")
        .single();
      if (error) throw new Error(error.message);
      return toRecord(data);
    }
    const { data, error } = await db
      .from("projects")
      .insert(payload)
      .select("id,name,type,data,thumbnail,favorite,created_at,updated_at")
      .single();
    if (error) throw new Error(error.message);
    return toRecord(data);
  });

export const renameProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string(), name: z.string().min(1).max(120) }).parse(input),
  )
  .handler(async ({ data: input }) => {
    const { requireUser } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { error } = await db
      .from("projects")
      .update({ name: input.name, updated_at: new Date().toISOString() })
      .eq("id", input.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const deleteProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data: input }) => {
    const { requireUser } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { error } = await db
      .from("projects")
      .delete()
      .eq("id", input.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const duplicateProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ data: input }): Promise<NexoraProjectRecord> => {
    const { requireUser, toRecord } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { data: src, error: readErr } = await db
      .from("projects")
      .select("name,type,data,thumbnail")
      .eq("id", input.id)
      .eq("user_id", userId)
      .single();
    if (readErr) throw new Error(readErr.message);
    const { data, error } = await db
      .from("projects")
      .insert({
        user_id: userId,
        name: `${src.name} copy`,
        type: src.type,
        data: src.data as never,
        thumbnail: src.thumbnail,
      })
      .select("id,name,type,data,thumbnail,favorite,created_at,updated_at")
      .single();
    if (error) throw new Error(error.message);
    return toRecord(data);
  });

export const toggleFavoriteProject = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string(), favorite: z.boolean() }).parse(input),
  )
  .handler(async ({ data: input }) => {
    const { requireUser } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { error } = await db
      .from("projects")
      .update({ favorite: input.favorite })
      .eq("id", input.id)
      .eq("user_id", userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getPreferences = createServerFn({ method: "POST" }).handler(async () => {
  const { requireUser } = await import("./auth.server");
  const { userId, db } = await requireUser();
  const { data } = await db
    .from("user_preferences")
    .select("favorite_tools,default_version,autosave,show_grid")
    .eq("user_id", userId)
    .maybeSingle();
  return (
    data ?? {
      favorite_tools: [] as string[],
      default_version: "1.21",
      autosave: true,
      show_grid: true,
    }
  );
});

export const savePreferences = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        favorite_tools: z.array(z.string()).optional(),
        default_version: z.string().optional(),
        autosave: z.boolean().optional(),
        show_grid: z.boolean().optional(),
      })
      .parse(input),
  )
  .handler(async ({ data: input }) => {
    const { requireUser } = await import("./auth.server");
    const { userId, db } = await requireUser();
    const { error } = await db
      .from("user_preferences")
      .upsert(
        { user_id: userId, ...input, updated_at: new Date().toISOString() },
        { onConflict: "user_id" },
      );
    if (error) throw new Error(error.message);
    return { ok: true };
  });
