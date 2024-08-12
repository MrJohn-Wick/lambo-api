import { AccessToken } from "@prisma/client";
import { randomUUID } from "crypto";

export function isValidToken(token: AccessToken) {
  const now = new Date().getTime();
  const expiresAt = token.expiresAt.getTime();
  return now<expiresAt;
}

export function generateToken() {
  return randomUUID();
}

export function getOnetimeCode(): string {
  const high = 9999;
  const low = 1000;
  const code = Math.random() * (high - low) + low

  return Math.floor(code).toString();
}