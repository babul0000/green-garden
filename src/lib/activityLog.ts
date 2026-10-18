import { prisma } from "@/lib/prisma";

export interface LogActivityParams {
  userId?: string | null;
  userName?: string | null;
  action: "CREATE" | "UPDATE" | "DELETE" | "STATUS_CHANGE" | "LOGIN" | "EXPORT" | string;
  entity: "Project" | "Service" | "Booking" | "Invoice" | "User" | "Settings" | "DigitalServiceCard" | "Review" | "Blog" | "Inventory" | string;
  entityId?: string | null;
  summary: string;
  details?: Record<string, any> | null;
}

// Sensitive keys to omit from activity log details
const SENSITIVE_KEYS = new Set([
  "password",
  "passwordhash",
  "token",
  "secret",
  "jwt_secret",
  "cron_secret",
  "cardnumber",
  "cvv",
  "pin",
  "refreshtoken",
]);

function sanitizeDetails(data: any): any {
  if (!data || typeof data !== "object") return data;
  if (Array.isArray(data)) {
    return data.map(sanitizeDetails);
  }

  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (SENSITIVE_KEYS.has(key.toLowerCase())) {
      cleaned[key] = "[REDACTED]";
    } else if (value && typeof value === "object") {
      cleaned[key] = sanitizeDetails(value);
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

/**
 * Record an administrative activity log in PostgreSQL
 */
export async function logActivity(params: LogActivityParams) {
  try {
    const sanitized = params.details ? sanitizeDetails(params.details) : undefined;
    return await prisma.activityLog.create({
      data: {
        userId: params.userId || null,
        userName: params.userName || "System",
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        summary: params.summary,
        details: sanitized ?? undefined,
      },
    });
  } catch (error) {
    // Non-blocking error: do not crash caller if logging fails
    console.error("Failed to write activity log:", error);
    return null;
  }
}
