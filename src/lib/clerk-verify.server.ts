import { createRemoteJWKSet, jwtVerify } from "jose";

/**
 * Derives the Clerk Frontend API domain from the publishable key
 * (`pk_test_<base64 domain>`), then verifies session JWTs against Clerk's
 * public JWKS. No secret material is needed in the browser; CLERK_SECRET_KEY
 * stays server-side and is only required for Clerk Backend API calls.
 */
function clerkDomain(): string {
  const pk =
    process.env["CLERK_PUBLISHABLE_KEY"] ?? process.env["VITE_CLERK_PUBLISHABLE_KEY"] ?? "";
  const encoded = pk.replace(/^pk_(test|live)_/, "");
  if (!encoded) throw new Error("CLERK_PUBLISHABLE_KEY is not configured");
  let decoded = "";
  try {
    decoded = atob(encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), "="));
  } catch {
    throw new Error("CLERK_PUBLISHABLE_KEY is malformed");
  }
  return decoded.replace(/\$$/, "");
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function getJwks() {
  if (!jwks) {
    jwks = createRemoteJWKSet(new URL(`https://${clerkDomain()}/.well-known/jwks.json`));
  }
  return jwks;
}

/** Returns the Clerk user id for a valid session token, or throws. */
export async function verifyClerkToken(token: string | undefined | null): Promise<string> {
  if (!token) throw new Error("Unauthorized");
  const { payload } = await jwtVerify(token, getJwks(), {
    issuer: `https://${clerkDomain()}`,
  });
  const sub = payload.sub;
  if (!sub) throw new Error("Unauthorized");
  return sub;
}
