/**
 * Nexora Projects registry.
 *
 * Add a new object to `nexoraProjects` and it automatically appears everywhere
 * in the app (dashboard "Explore" strip, /nexora-projects page, global search).
 * Nothing else needs to change.
 */
export interface NexoraProject {
  /** Stable id, used as a React key and in search results. */
  id: string;
  /** Display name, e.g. "Nexora AI". */
  name: string;
  /** One or two sentences describing the project. */
  description: string;
  /** Absolute URL — opened in a new tab. */
  url: string;
  /** Optional image URL used as the card cover. */
  image?: string;
  /** Optional short tag, e.g. "AI", "Tools". */
  tag?: string;
  /** Optional emoji/initials shown when no image is provided. */
  badge?: string;
}

export const nexoraProjects: NexoraProject[] = [
  {
    id: "nexora-ai",
    name: "Nexora AI",
    description:
      "Nexora's AI assistant — chat, brainstorm, write and get answers in a fast, clean interface built by the Nexora team.",
    url: "https://ai.nexoras.workers.dev/",
    tag: "AI",
    badge: "AI",
  },
];
