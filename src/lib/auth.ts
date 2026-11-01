import "server-only";

import { createHmac, timingSafeEqual } from "crypto";

const SESSION_DURATION = 60 * 60 * 24 * 7; // 7 days

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be configured with at least 32 characters.",
    );
  }

  return secret;
}

function sign(value: string) {
  return createHmac("sha256", getSecret())
    .update(value)
    .digest("base64url");
}

function safeCompare(a: string, b: string) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);

  return (
    bufferA.length === bufferB.length &&
    timingSafeEqual(bufferA, bufferB)
  );
}

export function verifyAdminCredentials(
  username: string,
  password: string,
) {
  const savedUsername = process.env.ADMIN_USERNAME;
  const savedPassword = process.env.ADMIN_PASSWORD;

  if (!savedUsername || !savedPassword) {
    throw new Error("Admin credentials are not configured.");
  }

  return (
    safeCompare(username, savedUsername) &&
    safeCompare(password, savedPassword)
  );
}

export function createAdminSession() {
  const payload = Buffer.from(
    JSON.stringify({
      role: "admin",
      expiresAt: Date.now() + SESSION_DURATION * 1000,
    }),
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function verifyAdminSession(token?: string) {
  if (!token) return false;

  try {
    const [payload, signature] = token.split(".");

    if (!payload || !signature) return false;

    if (!safeCompare(signature, sign(payload))) return false;

    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    return (
      session.role === "admin" &&
      typeof session.expiresAt === "number" &&
      session.expiresAt > Date.now()
    );
  } catch {
    return false;
  }
}

export const ADMIN_SESSION_COOKIE = "mr_admin_session";
export const ADMIN_SESSION_MAX_AGE = SESSION_DURATION;