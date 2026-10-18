import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * GET /api/admin/activity-logs
 * Protected by requireAdmin.
 * Query Parameters:
 * - page: number (default 1)
 * - limit: number (default 25, max 100)
 * - search: string (matches summary, userName, entity, entityId)
 * - entity: string (filter by entity, e.g. Project, Service, User, Invoice)
 * - action: string (filter by action, e.g. CREATE, UPDATE, DELETE)
 * - userId: string (filter by actor)
 * - startDate: ISO string (createdAt >= startDate)
 * - endDate: ISO string (createdAt <= endDate)
 */
export async function GET(req: Request) {
  try {
    await requireAdmin(req);

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    const search = searchParams.get("search")?.trim();
    const entity = searchParams.get("entity")?.trim();
    const action = searchParams.get("action")?.trim();
    const userId = searchParams.get("userId")?.trim();
    const startDate = searchParams.get("startDate")?.trim();
    const endDate = searchParams.get("endDate")?.trim();

    const where: any = {};

    if (entity) {
      where.entity = entity;
    }

    if (action) {
      where.action = action;
    }

    if (userId) {
      where.userId = userId;
    }

    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(startDate);
      }
      if (endDate) {
        // Add 1 day if date is in YYYY-MM-DD to include the whole day
        const end = new Date(endDate);
        if (endDate.length === 10) {
          end.setHours(23, 59, 59, 999);
        }
        where.createdAt.lte = end;
      }
    }

    if (search) {
      where.OR = [
        { summary: { contains: search, mode: "insensitive" } },
        { userName: { contains: search, mode: "insensitive" } },
        { entity: { contains: search, mode: "insensitive" } },
        { entityId: { contains: search, mode: "insensitive" } },
      ];
    }

    const [total, logs] = await Promise.all([
      prisma.activityLog.count({ where }),
      prisma.activityLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return NextResponse.json(
      {
        logs,
        total,
        page,
        limit,
        totalPages,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    const status = error.status || 500;
    return NextResponse.json(
      { error: error?.message || "Failed to fetch activity logs" },
      { status, headers: NO_CACHE_HEADERS }
    );
  }
}
