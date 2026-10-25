import crypto from "crypto";

export const SESSION_COOKIE = "admin_session";

const ADMIN_USERNAME = process.env.ADMIN_USERNAME ?? "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET ?? ADMIN_PASSWORD;

const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 30;
export const SESSION_MAX_AGE_SECONDS = SESSION_MAX_AGE_MS / 1000;

export function checkCredentials(username: string, password: string): boolean {
  return (
    timingSafeEqual(username, ADMIN_USERNAME) &&
    timingSafeEqual(password, ADMIN_PASSWORD)
  );
}

function sign(value: string): string {
  return crypto.createHmac("sha256", SESSION_SECRET).update(value).digest("hex");
}

export function createSessionToken(): string {
  const expires = String(Date.now() + SESSION_MAX_AGE_MS);
  return `${expires}.${sign(expires)}`;
}

export function isValidSessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  if (!expires || !signature) return false;
  if (!timingSafeEqual(signature, sign(expires))) return false;
  const expiresAt = Number(expires);
  return Number.isFinite(expiresAt) && expiresAt > Date.now();
}

function timingSafeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}
