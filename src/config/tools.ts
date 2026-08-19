import type { ProjectType } from "@/lib/types";

export interface ToolDef {
  id: ProjectType;
  name: string;
  short: string;
  description: string;
  to: string;
  accent: string;
  keywords: string[];
}

export const tools: ToolDef[] = [
  {
    id: "skin",
    name: "Skin Editor",
    short: "Skin",
    description: "Paint Steve & Alex skins pixel by pixel with a live 3D preview.",
    to: "/tools/skin",
    accent: "grass",
    keywords: ["skin", "character", "steve", "alex", "player", "png"],
  },
  {
    id: "texture-pack",
    name: "Texture Pack Maker",
    short: "Texture Pack",
    description: "Build a resource pack, replace textures and export a ready .zip.",
    to: "/tools/texture-pack",
    accent: "copper",
    keywords: ["texture", "resource pack", "zip", "blocks", "items", "gui"],
  },
  {
    id: "command",
    name: "Command Generator",
    short: "Command",
    description: "Generate give, summon, execute and 11 more commands from forms.",
    to: "/tools/command",
    accent: "redstone",
    keywords: ["command", "give", "summon", "tp", "execute", "tellraw", "slash"],
  },
  {
    id: "banner",
    name: "Banner Creator",
    short: "Banner",
    description: "Layer patterns and dyes, then copy the exact /give command.",
    to: "/tools/banner",
    accent: "lapis",
    keywords: ["banner", "pattern", "flag", "loom", "dye"],
  },
  {
    id: "build",
    name: "Build Planner",
    short: "Build",
    description: "Plan builds layer by layer and get an exact material list.",
    to: "/tools/build",
    accent: "amethyst",
    keywords: ["build", "blueprint", "schematic", "materials", "layers", "grid"],
  },
  {
    id: "pixel-art",
    name: "Pixel Art Maker",
    short: "Pixel Art",
    description: "Draw pixel art with the Minecraft block palette and export PNG.",
    to: "/tools/pixel-art",
    accent: "gold",
    keywords: ["pixel", "art", "map art", "draw", "canvas", "png"],
  },
];

export const toolById = (id: string) => tools.find((t) => t.id === id);

export const MC_VERSIONS = [
  "1.21",
  "1.20",
  "1.19",
  "1.18",
  "1.17",
  "1.16",
  "1.12",
] as const;
