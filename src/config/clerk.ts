/**
 * Clerk publishable key.
 *
 * Publishable keys are safe for the browser by design (Clerk ships them in
 * client bundles). We still read it from the environment first so it can be
 * swapped per deployment without touching source. The secret key
 * (CLERK_SECRET_KEY) is NEVER referenced in client code.
 */
const FALLBACK_PUBLISHABLE_KEY = "pk_test_Z29vZC1waG9lbml4LTM2NDcuY2xlcmsuYWNjb3VudHMuZGV2JA";

export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"] as string | undefined) ||
  FALLBACK_PUBLISHABLE_KEY;
