export interface ProjectSearch {
  project?: string;
}

/** Shared `?project=<id>` search validation for every editor route. */
export function validateProjectSearch(search: Record<string, unknown>): ProjectSearch {
  const value = search["project"];
  return typeof value === "string" && value.length > 0 ? { project: value } : {};
}
