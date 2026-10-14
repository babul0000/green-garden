import { NextRequest } from "next/server";
import { verifyJwtToken, AUTH_COOKIE_NAME, type AuthUser } from "@/lib/auth";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * Get the currently authenticated user from request cookies.
 * Returns null if not authenticated.
 */
export async function getCurrentUser(req: NextRequest | Request): Promise<AuthUser | null> {
  try {
    let token: string | undefined;

    // NextRequest (middleware/route handlers)
    if (req instanceof NextRequest) {
      token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
    } else {
      // Standard Request — parse Cookie header
      const cookieHeader = req.headers.get("cookie") || "";
      const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${AUTH_COOKIE_NAME}=([^;]+)`));
      token = match?.[1];
    }

    if (!token) return null;
    return await verifyJwtToken(token);
  } catch {
    return null;
  }
}

/**
 * Require authentication. Returns user or throws a 401 Response.
 */
export async function requireAuth(req: NextRequest | Request): Promise<AuthUser> {
  const user = await getCurrentUser(req);
  if (!user) {
    throw Object.assign(new Error("Authentication required"), { status: 401 });
  }
  return user;
}

/**
 * Require ADMIN or EDITOR role.
 */
export async function requireAdmin(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "EDITOR") {
    throw Object.assign(new Error("Admin privileges required"), { status: 403 });
  }
  return user;
}

/**
 * Require ADMIN, EDITOR, or MODERATOR role.
 */
export async function requireModerator(req: NextRequest | Request): Promise<AuthUser> {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();
  if (role !== "ADMIN" && role !== "EDITOR" && role !== "MODERATOR") {
    throw Object.assign(new Error("Moderator privileges required"), { status: 403 });
  }
  return user;
}

/**
 * Check if user owns a resource or is admin.
 */
export function isOwnerOrAdmin(user: AuthUser, resourceUserId: string | null | undefined): boolean {
  if (!resourceUserId) return false;
  const role = user.role?.toUpperCase();
  if (role === "ADMIN" || role === "EDITOR") return true;
  return user.id === resourceUserId;
}

/**
 * Helper: return a sanitized error response.
 * In production, hides internal error details.
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
 * Usage: export const GET = withAuthErrorHandling(async (req) => { ... })
 */
export function withAuthErrorHandling(
  handler: (req: Request) => Promise<Response>
): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    try {
      return await handler(req);
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
  };
}
