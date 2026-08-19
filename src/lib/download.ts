import type { NexoraProjectRecord } from "./types";

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadDataUrl(dataUrl: string, filename: string) {
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = filename;
  a.click();
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "nexora";

/** Downloads the project: PNG when a preview exists, otherwise the raw .nexora JSON. */
export function downloadProject(record: NexoraProjectRecord) {
  if (record.thumbnail?.startsWith("data:image")) {
    downloadDataUrl(record.thumbnail, `${slug(record.name)}.png`);
    return;
  }
  const blob = new Blob(
    [JSON.stringify({ name: record.name, type: record.type, data: JSON.parse(record.data || "{}") }, null, 2)],
    { type: "application/json" },
  );
  downloadBlob(blob, `${slug(record.name)}.nexora.json`);
}
