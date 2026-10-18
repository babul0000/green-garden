import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";

export type UserRole = "CLIENT" | "ADMIN" | "EMPLOYEE" | "EDITOR" | "MODERATOR" | "client" | "admin" | "employee" | "editor" | "moderator";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  avatar?: string | null;
  tokenVersion?: number;
}

export const AUTH_COOKIE_NAME = "gg_auth_token";

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim().length === 0) {
    throw new Error(
      "FATAL SECURITY ERROR: JWT_SECRET environment variable is missing or empty. A secure JWT secret must be defined in .env"
    );
  }
  return new TextEncoder().encode(secret);
}

/**
 * Hash a plain-text password using bcrypt with 10 salt rounds
 */
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

/**
 * Compare plain text password against stored bcrypt hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

/**
 * Sign an industry-standard JWT token using jose (Edge and Node.js compatible)
 */
export async function signJwtToken(payload: AuthUser): Promise<string> {
  return await new SignJWT({
    ...payload,
    tokenVersion: typeof payload.tokenVersion === "number" ? payload.tokenVersion : 0,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 days expiration
    .sign(getJwtSecret());
}

/**
 * Verify and decode JWT token (Edge and Node.js compatible)
 */
export async function verifyJwtToken(token: string): Promise<AuthUser | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
      role: (payload.role as UserRole) || "CLIENT",
      phone: payload.phone as string | undefined,
      avatar: payload.avatar as string | undefined,
      tokenVersion: typeof payload.tokenVersion === "number" ? (payload.tokenVersion as number) : 0,
    };
  } catch {
    return null;
  }
}
