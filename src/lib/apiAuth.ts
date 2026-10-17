import { NextRequest } from "next/server";
import { verifyJwtToken, AUTH_COOKIE_NAME, type AuthUser } from "@/lib/auth";
import { canAccessSection, canEnterAdmin, type AdminSection } from "@/lib/rbac";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * Get the currently authenticated user from request cookies or Authorization header.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(req: NextRequest | Request): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    // 1. Check Authorization Header (Bearer token)
    const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }

    // 2. Fallback to HTTP-only cookie if Authorization header is not present
    if (!token) {
      if (req instanceof NextRequest) {
        token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
      } else {
        const cookieHeader = req.headers.get("cookie") || "";
        const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
        token = match?.[1];
      }
    }

    if (!token) return null;
    return await verifyJwtToken(token);
  } catch {
    return null;
  }
}

/**
 * Require basic authentication. Returns user or throws a 401 Response.
 */
export async function requireAuth(req: NextRequest | Request): Promise<AuthUser> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { status: 401 });
  }
  return user;
}

/**
 * Require ADMIN role strictly (Used for Finance, Staff/Careers, User Roles, Master Settings, Security).
 */
export async function requireAdmin(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN") {
    throw Object.assign(new Error("Admin privileges required (Access Denied)"), { status: 403 });
  }
  return user;
}

/**
 * Require ADMIN or MODERATOR role (Used for Overview, Messages, Reviews Approval).
 */
export async function requireModerator(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "MODERATOR") {
    throw Object.assign(new Error("Moderator or Admin privileges required"), { status: 403 });
  }
  return user;
}

/**
 * Require ADMIN, MODERATOR, or EDITOR role (Used for Portfolio: Projects, Gallery, Blogs).
 */
export async function requireEditor(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "MODERATOR" && role !== "EDITOR") {
    throw Object.assign(new Error("Editor, Moderator, or Admin privileges required"), { status: 403 });
  }
  return user;
}

/**
 * Require ADMIN, MODERATOR, or EMPLOYEE role (Used for Operations: Services, Bookings, Tree Doctor, Maintenance).
 */
export async function requireEmployee(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "MODERATOR" && role !== "EMPLOYEE") {
    throw Object.assign(new Error("Employee or Admin privileges required"), { status: 403 });
  }
  return user;
}

/**
 * Require Section-Specific Access according to the RBAC table.
 */
export async function requireSectionAccess(req: NextRequest | Request, section: AdminSection): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!canAccessSection(user.role, section)) {
    throw Object.assign(
      new Error(`Access denied: role '${user.role}' cannot access section '${section}'`),
      { status: 403 }
    );
  }
  return user;
}

/**
 * Check if user is allowed to access any part of admin. Throws 403 if CLIENT.
 */
export async function requireAdminPortalAccess(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  if (!canEnterAdmin(user.role)) {
    throw Object.assign(
      new Error("Client role cannot access admin management APIs"),
      { status: 403 }
    );
  }
  return user;
}

/**
 * Check if user owns a resource or is admin.
 */
export function isOwnerOrAdmin(user: AuthUser, resourceUserId: string | null | undefined): boolean {
  if (!resourceUserId) return false;
  const role = user.role?.toUpperCase();
  if (role === "ADMIN") return true;
  return user.id === resourceUserId;
}

/**
 * Helper: return a sanitized error response.
 */
export function apiError(message: string, status: number = 500): Response {
  const isDev = process.env.NODE_ENV === "development";
  return Response.json(
    { error: isDev || status < 500 ? message : "An internal server error occurred." },
    { status, headers: NO_CACHE }
  );
}

/**
 * Wrap a route handler with auth error handling.
 */
export function withAuthErrorHandling<T extends (req: Request, ...args: any[]) => Promise<Response>>(
  handler: T
): T {
  return (async (req: Request, ...args: any[]): Promise<Response> => {
    try {
      return await handler(req, ...args);
    } catch (err: unknown) {
      if (err instanceof Error) {
        const status = (err as Error & { status?: number }).status;
        if (status === 401) return apiError(err.message, 401);
        if (status === 403) return apiError(err.message, 403);
      }
      console.error("[API Error]", err);
      const isDev = process.env.NODE_ENV === "development";
      return Response.json(
        { error: isDev && err instanceof Error ? err.message : "Internal server error" },
        { status: 500, headers: NO_CACHE }
      );
    }
  }) as T;
}
