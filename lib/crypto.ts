import crypto from "crypto"

// Hash password using PBKDF2
export async function hashPassword(password: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(16).toString("hex")
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      const hash = salt + ":" + derivedKey.toString("hex")
      resolve(hash)
    })
  })
}

// Verify password against hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const [salt, key] = hash.split(":")
    crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
      if (err) reject(err)
      resolve(key === derivedKey.toString("hex"))
    })
  })
}

// Generate session token
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
