import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * GET /api/notifications
 * Returns authenticated user's notifications.
 * - Admins and staff see broadcast notifications (userId == null) + notifications targeted to them.
 * - Clients strictly see only notifications targeted to their user.id.
 */
export async function GET(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required to view notifications." },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const { searchParams } = new URL(req.url);
    const unreadOnly = searchParams.get("unreadOnly") === "true";
    const limitParam = parseInt(searchParams.get("limit") || "40", 10);
    const limit = isNaN(limitParam) ? 40 : Math.min(Math.max(limitParam, 1), 100);

    const role = (user.role || "").toUpperCase();
    const isStaff = ["ADMIN", "MODERATOR", "EMPLOYEE", "EDITOR"].includes(role);

    // Scope notifications based on user role
    const baseWhere = isStaff
      ? {
          OR: [{ userId: user.id }, { userId: null }],
        }
      : {
          userId: user.id,
        };

    const where = unreadOnly
      ? { ...baseWhere, isRead: false }
      : baseWhere;

    const [unreadCount, notifications] = await Promise.all([
      prisma.notification.count({
        where: {
          ...baseWhere,
          isRead: false,
        },
      }),
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
    ]);

    return NextResponse.json(
      {
        notifications,
        unreadCount,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Notifications GET error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to load notifications" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}

/**
 * PATCH /api/notifications
 * - Marks a single notification as read: { id: string, isRead?: boolean }
 * - Marks all notifications as read: { readAll: true } or { markAllRead: true }
 */
export async function PATCH(req: Request) {
  try {
    const user = await getCurrentUser(req);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401, headers: NO_CACHE_HEADERS }
      );
    }

    const body = await req.json();
    const { id, isRead, readAll, markAllRead } = body;

    const role = (user.role || "").toUpperCase();
    const isStaff = ["ADMIN", "MODERATOR", "EMPLOYEE", "EDITOR"].includes(role);

    // Handle Mark All As Read
    if (readAll || markAllRead) {
      const whereCondition = isStaff
        ? {
            OR: [{ userId: user.id }, { userId: null }],
            isRead: false,
          }
        : {
            userId: user.id,
            isRead: false,
          };

      const result = await prisma.notification.updateMany({
        where: whereCondition,
        data: { isRead: true },
      });

      return NextResponse.json(
        {
          success: true,
          updatedCount: result.count,
          message: "All notifications marked as read.",
        },
        { headers: NO_CACHE_HEADERS }
      );
    }

    // Handle single notification update
    if (!id) {
      return NextResponse.json(
        { error: "Notification ID is required when not marking all as read." },
        { status: 400, headers: NO_CACHE_HEADERS }
      );
    }

    const existing = await prisma.notification.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Notification not found." },
        { status: 404, headers: NO_CACHE_HEADERS }
      );
    }

    // Permission check: clients can only mark their own notifications
    if (!isStaff && existing.userId !== user.id) {
      return NextResponse.json(
        { error: "Access denied." },
        { status: 403, headers: NO_CACHE_HEADERS }
      );
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: {
        isRead: isRead !== undefined ? Boolean(isRead) : true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        notification: updated,
      },
      { headers: NO_CACHE_HEADERS }
    );
  } catch (error: any) {
    console.error("Notifications PATCH error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to update notification" },
      { status: 500, headers: NO_CACHE_HEADERS }
    );
  }
}
