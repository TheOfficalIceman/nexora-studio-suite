export interface EditorPrefs {
  defaultVersion: string;
  autosave: boolean;
  showGrid: boolean;
  pixelSize: number;
}

const KEY = "nexora.prefs.v1";

export const defaultPrefs: EditorPrefs = {
  defaultVersion: "1.21",
  autosave: true,
  showGrid: true,
  pixelSize: 16,
};

export function loadPrefs(): EditorPrefs {
  if (typeof window === "undefined") return defaultPrefs;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultPrefs, ...(JSON.parse(raw) as Partial<EditorPrefs>) } : defaultPrefs;
  } catch {
    return defaultPrefs;
  }
}

export function savePrefs(prefs: EditorPrefs) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(prefs));
}
