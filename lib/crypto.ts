import { pbkdf2Sync, randomBytes } from "crypto";

// Hash password using PBKDF2
export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

// Verify password against hash
export function verifyPassword(
  password: string,
  hashedPassword: string
): boolean {
  const [salt, hash] = hashedPassword.split(":");
  const verifyHash = pbkdf2Sync(password, salt, 1000, 64, "sha512").toString(
    "hex"
  );
  return hash === verifyHash;
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString("hex");
}
