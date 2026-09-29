import { createHmac, timingSafeEqual } from "crypto";

export const SESSION_COOKIE = "sayko_session";
const maxAge = 60 * 60 * 24 * 14;

function secret() {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 32) throw new Error("SESSION_SECRET deve ter pelo menos 32 caracteres.");
  return value;
}

export function createSessionToken() {
  const expiresAt = Date.now() + maxAge * 1000;
  const payload = `sayko:${expiresAt}`;
  const signature = createHmac("sha256", secret()).update(payload).digest("hex");
  return `${payload}:${signature}`;
}

export function isValidSessionToken(token?: string) {
  if (!token) return false;
  const [scope, expiresAt, signature] = token.split(":");
  if (scope !== "sayko" || !expiresAt || !signature || Number(expiresAt) < Date.now()) return false;
  const expected = createHmac("sha256", secret()).update(`${scope}:${expiresAt}`).digest("hex");
  return signature.length === expected.length && timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export const sessionMaxAge = maxAge;
