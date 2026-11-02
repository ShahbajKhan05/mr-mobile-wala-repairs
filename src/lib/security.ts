import "server-only";

import { createHash, randomBytes } from "node:crypto";

export function generateCustomerAccessToken() {
  return randomBytes(32).toString("hex");
}

export function hashCustomerAccessToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}