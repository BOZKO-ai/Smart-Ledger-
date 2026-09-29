/**
 * Edge-compatible JWT helpers — NO mongoose/mongodb imports.
 * Used by middleware.ts which runs in Next.js Edge Runtime.
 */

export const AUTH_COOKIE_NAME = "auth_token";
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return atob(padded); // atob is available in Edge Runtime
}

export interface JwtPayload {
  profileId: string;
  email: string;
  role: "owner" | "staff";
  exp?: number;
  iat?: number;
}

async function hmacSign(message: string, secret: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  // Convert to base64url
  return btoa(String.fromCharCode(...new Uint8Array(sig)))
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

async function hmacVerify(message: string, signature: string, secret: string): Promise<boolean> {
  const expected = await hmacSign(message, secret);
  if (expected.length !== signature.length) return false;
  // Constant-time compare using XOR
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export async function verifyTokenEdge(token: string): Promise<JwtPayload | null> {
  if (!token) return null;

  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;

  const valid = await hmacVerify(`${header}.${body}`, signature, JWT_SECRET);
  if (!valid) return null;

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as JwtPayload;
    if (typeof payload.exp === "number" && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
