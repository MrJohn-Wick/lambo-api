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