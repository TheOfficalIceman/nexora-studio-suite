import { getRequestHeader } from "@tanstack/react-start/server";

import { verifyClerkToken } from "./clerk-verify.server";
import type { NexoraProjectRecord, ProjectType } from "./types";

/** Verifies the Clerk session token on the incoming request. */
export async function requireUser() {
  const token = getRequestHeader("x-clerk-token");
  const userId = await verifyClerkToken(token);
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return { userId, db: supabaseAdmin };
}

type Row = {
  id: string;
  name: string;
  type: string;
  data: unknown;
  thumbnail: string | null;
  favorite: boolean;
  created_at: string;
  updated_at: string;
};

export function toRecord(row: Row): NexoraProjectRecord {
  return {
    id: row.id,
    name: row.name,
    type: row.type as ProjectType,
    data: row.data,
    thumbnail: row.thumbnail,
    favorite: row.favorite,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
