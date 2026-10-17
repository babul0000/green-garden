import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireAdmin, apiError, withAuthErrorHandling, getCurrentUser } from "@/lib/apiAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

// Public: only approved reviews with public fields are visible
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const { isPaginated, page, limit, skip, q, status } = parsePaginationParams(req);

    const user = await getCurrentUser(req);
    const role = user?.role?.toUpperCase();
    const isStaff = role === "ADMIN" || role === "MODERATOR";

    const searchFilter = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { text: { contains: q, mode: "insensitive" as const } },
            { service: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    if (isStaff) {
      const where = {
        status: status && status !== "all" ? status : undefined,
        projectId: projectId || undefined,
        ...searchFilter,
      };

      const total = isPaginated ? await prisma.review.count({ where }) : 0;

      const reviews = await prisma.review.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: isPaginated ? skip : undefined,
        take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
      });

      return NextResponse.json(
        formatDataResponse(reviews, total, { isPaginated, page, limit }),
        { headers: NO_CACHE }
      );
    }

    // Public view: strictly only approved reviews with public select
    const where = {
      status: "Approved",
      projectId: projectId || undefined,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.review.count({ where }) : 0;

    const reviews = await prisma.review.findMany({
      where,
      select: {
        id: true,
        name: true,
        rating: true,
        text: true,
        service: true,
        location: true,
        photoUrl: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      skip: isPaginated ? skip : undefined,
      take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
    });

    return NextResponse.json(
      formatDataResponse(reviews, total, { isPaginated, page, limit }),
      { headers: NO_CACHE }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Public: anyone can submit a review — protected with IP rate limiting
export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 10 * 60 * 1000, prefix: "reviews_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const { name, rating, text, service, location, photoUrl, userId, projectId } = body;

    if (!name || !rating || !text) {
      return apiError("Name, rating (1-5), and review comment are required.", 400);
    }

    const ratingNum = parseInt(String(rating), 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return apiError("Rating must be between 1 and 5.", 400);
    }

    const review = await prisma.review.create({
      data: {
        name,
        rating: ratingNum,
        text,
        service: service || "Landscape Design",
        location: location || "Dhaka",
        photoUrl: photoUrl || null,
        userId: userId || null,
        projectId: projectId || null,
        status: "Pending",
      },
    });

    // Notify Admin (link to reviews tab)
    await prisma.notification.create({
      data: {
        title: `⭐ নতুন রিভিউ: ${name} (${ratingNum} Star)`,
        message: `${name} একটি ${ratingNum}-স্টার রিভিউ সাবমিট করেছেন: "${text.slice(0, 60)}..."`,
        type: "INFO",
        link: "reviews",
      },
    });

    // Notify Client if logged in
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: "আপনার রিভিউ গৃহীত হয়েছে",
          message: "আমাদের সেবা মূল্যায়নের জন্য ধন্যবাদ! অ্যাডমিন অনুমোদনের পর এটি ওয়েবসাইটে প্রদর্শিত হবে।",
          type: "INFO",
          link: "support",
        },
      });
    }

    return NextResponse.json(
      { success: true, message: "Review submitted! Awaiting admin approval.", review },
      { headers: NO_CACHE }
    );
  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === "development";
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { error: isDev ? msg : "Failed to submit review." },
      { status: 500 }
    );
  }
}

// Protected: only moderator/admin can update review status
export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const body = await req.json();
  const { id, status, name, rating, text, service, location, photoUrl } = body;
  if (!id) return apiError("Review ID is required.", 400);

  const updated = await prisma.review.update({
    where: { id },
    data: {
      status: status || undefined,
      name: name || undefined,
      rating: rating ? parseInt(String(rating), 10) : undefined,
      text: text || undefined,
      service: service !== undefined ? service : undefined,
      location: location !== undefined ? location : undefined,
      photoUrl: photoUrl !== undefined ? photoUrl : undefined,
    },
  });

  return NextResponse.json({ success: true, review: updated }, { headers: NO_CACHE });
});

// Protected: only admin can delete reviews
export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Review ID required", 400);

  await prisma.review.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Review deleted." }, { headers: NO_CACHE });
});
