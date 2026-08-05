import jwt from "jsonwebtoken";
import argon2 from "argon2";

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_jwt_key_seminairepro_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

export interface TokenPayload {
  userId: string;
  email: string;
  globalRole: string;
  orgId?: string;
  orgRole?: string;
  hotelId?: string;
  hotelRole?: string;
}

/**
 * Hashes a plain text password using Argon2id (OWASP recommended).
 * @param password Plain text password
 */
export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

/**
 * Verifies a plain text password against an Argon2 hash.
 * @param hash Argon2 password hash
 * @param plain Plain text password
 */
export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch (err) {
    return false;
  }
}

/**
 * Generates a signed JWT Access Token.
 * @param payload Token Payload containing User and Tenant Context
 */
export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });
}

/**
 * Verifies and decodes a JWT token.
 * @param token JWT token string
 */
export function verifyToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as TokenPayload;
  } catch (err) {
    return null;
  }
}
