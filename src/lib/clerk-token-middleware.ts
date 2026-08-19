import { createMiddleware } from "@tanstack/react-start";

type ClerkGlobal = {
  session?: { getToken: () => Promise<string | null> };
};

/**
 * Attaches the current Clerk session token to every server-function call so
 * the server can verify the caller. The token is short lived and never stored.
 */
export const attachClerkAuth = createMiddleware({ type: "function" }).client(
  async ({ next }) => {
    let token: string | null = null;
    try {
      const clerk = (globalThis as { Clerk?: ClerkGlobal }).Clerk;
      token = (await clerk?.session?.getToken()) ?? null;
    } catch {
      token = null;
    }
    return next(token ? { headers: { "x-clerk-token": token } } : {});
  },
);
