import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuthErrorHandling, requireAdminPortalAccess } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

/**
 * Lightweight Counts API for Admin Sidebar Badges
 * Returns pending/unread items across key models in a single fast Promise.all.
 */
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdminPortalAccess(req);

  const [
    unreadMessages,
    pendingReviews,
    pendingBookings,
    newDesignRequests,
    newCareerApps,
    pendingComments,
  ] = await Promise.all([
    prisma.contactMessage.count({ where: { isRead: false } }).catch(() => 0),
    prisma.review.count({ where: { status: "Pending" } }).catch(() => 0),
    prisma.booking.count({ where: { status: "Pending" } }).catch(() => 0),
    prisma.designGardenRequest.count({ where: { status: "NEW" } }).catch(() => 0),
    prisma.careerApplication.count({ where: { status: "Pending" } }).catch(() => 0),
    prisma.comment.count({ where: { approved: false } }).catch(() => 0),
  ]);

  return NextResponse.json(
    {
      unreadMessages,
      pendingReviews,
      pendingBookings,
      newDesignRequests,
      newCareerApps,
      pendingComments,
    },
    { headers: NO_CACHE }
  );
});
