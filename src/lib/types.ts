export type ProjectType =
  | "skin"
  | "texture-pack"
  | "command"
  | "banner"
  | "build"
  | "pixel-art";

export interface NexoraProjectRecord {
  id: string;
  name: string;
  type: ProjectType;
  /** Editor state, serialized as JSON. */
  data: string;
  thumbnail: string | null;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  /** true when the project only exists in this browser (signed-out user). */
  local?: boolean;
}

export const PROJECT_TYPE_LABEL: Record<ProjectType, string> = {
  skin: "Skin",
  "texture-pack": "Texture Pack",
  command: "Command",
  banner: "Banner",
  build: "Build",
  "pixel-art": "Pixel Art",
};
