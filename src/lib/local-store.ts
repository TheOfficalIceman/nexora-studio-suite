import type { NexoraProjectRecord, ProjectType } from "./types";

const KEY = "nexora.local.projects.v1";

function read(): NexoraProjectRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as NexoraProjectRecord[]) : [];
  } catch {
    return [];
  }
}

function write(list: NexoraProjectRecord[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(list));
}

export const localProjects = {
  list(): NexoraProjectRecord[] {
    return read().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id: string) {
    return read().find((p) => p.id === id) ?? null;
  },
  save(input: {
    id?: string;
    name: string;
    type: ProjectType;
    data: unknown;
    thumbnail?: string | null;
  }): NexoraProjectRecord {
    const list = read();
    const now = new Date().toISOString();
    const existing = input.id ? list.find((p) => p.id === input.id) : undefined;
    const record: NexoraProjectRecord = existing
      ? {
          ...existing,
          name: input.name,
          data: input.data,
          thumbnail: input.thumbnail ?? existing.thumbnail,
          updatedAt: now,
        }
      : {
          id: input.id ?? `local_${crypto.randomUUID()}`,
          name: input.name,
          type: input.type,
          data: input.data,
          thumbnail: input.thumbnail ?? null,
          favorite: false,
          createdAt: now,
          updatedAt: now,
          local: true,
        };
    const next = existing
      ? list.map((p) => (p.id === record.id ? record : p))
      : [record, ...list];
    write(next);
    return record;
  },
  remove(id: string) {
    write(read().filter((p) => p.id !== id));
  },
  rename(id: string, name: string) {
    write(
      read().map((p) =>
        p.id === id ? { ...p, name, updatedAt: new Date().toISOString() } : p,
      ),
    );
  },
  toggleFavorite(id: string) {
    write(read().map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)));
  },
  duplicate(id: string) {
    const p = read().find((x) => x.id === id);
    if (!p) return null;
    return localProjects.save({
      name: `${p.name} copy`,
      type: p.type,
      data: p.data,
      thumbnail: p.thumbnail,
    });
  },
};
