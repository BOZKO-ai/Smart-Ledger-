import crypto from "crypto";
import Profile from "@/models/Profile";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
export const AUTH_COOKIE_NAME = "auth_token";

function base64UrlEncode(value: string | Buffer) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function base64UrlDecode(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  return Buffer.from(padded, "base64").toString("utf8");
}

export interface AuthTokenPayload {
  profileId: string;
  email: string;
  role: "owner" | "staff";
  exp?: number;
  iat?: number;
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hashed = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hashed}`;
}

export function verifyPassword(password: string, storedHash: string) {
  const [salt, key] = storedHash.split(":");
  if (!salt || !key) {
    return false;
  }

  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  if (key.length !== derived.length) {
    return false;
  }

  return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(derived, "hex"));
}

export function signToken(payload: Omit<AuthTokenPayload, "iat" | "exp">) {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const issuedAt = Math.floor(Date.now() / 1000);
  const expiresAt = issuedAt + 7 * 24 * 60 * 60;
  const body = base64UrlEncode(JSON.stringify({ ...payload, iat: issuedAt, exp: expiresAt }));
  const signature = base64UrlEncode(
    crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest()
  );
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string) {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const [header, body, signature] = parts;
  const expectedSignature = base64UrlEncode(
    crypto.createHmac("sha256", JWT_SECRET).update(`${header}.${body}`).digest()
  );

  if (signature.length !== expectedSignature.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const payload = JSON.parse(base64UrlDecode(body)) as AuthTokenPayload;
    if (typeof payload.exp !== "number" || Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getCookieValue(request: Request | { cookies: { get: (name: string) => { value: string } | undefined } }) {
  if (typeof request === "object" && "cookies" in request && request.cookies?.get) {
    return request.cookies.get(AUTH_COOKIE_NAME)?.value || null;
  }

  if (typeof request === "object" && "headers" in request && request.headers?.get) {
    const cookieHeader = request.headers.get("cookie");
    if (!cookieHeader) return null;
    const match = cookieHeader
      .split(";")
      .map((cookie) => cookie.trim())
      .find((cookie) => cookie.startsWith(`${AUTH_COOKIE_NAME}=`));
    return match ? match.split("=")[1] : null;
  }

  return null;
}

export async function getCurrentProfile(request: Request | { cookies: { get: (name: string) => { value: string } | undefined } }) {
  const token = getCookieValue(request);
  if (!token) {
    return null;
  }

  const payload = verifyToken(token);
  if (!payload?.profileId) {
    return null;
  }

  await dbConnect();
  const profile = await Profile.findOne({ authUserId: payload.profileId });
  return profile;
}
