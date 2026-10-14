import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

// Public: only approved reviews are visible
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = searchParams.get("limit");
    const projectId = searchParams.get("projectId");

    // Non-admins only see approved reviews
    const reviews = await prisma.review.findMany({
      where: {
        status: status && status !== "all" ? status : "Approved",
        projectId: projectId || undefined,
      },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(reviews, { headers: NO_CACHE });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// Public: anyone can submit a review — starts as Pending
export async function POST(req: Request) {
  try {
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

    await prisma.notification.create({
      data: {
        title: `⭐ নতুন রিভিউ: ${name} (${ratingNum} Star)`,
        message: `${name} একটি ${ratingNum}-স্টার রিভিউ সাবমিট করেছেন। অনুমোদনের জন্য অপেক্ষা করছে।`,
        type: "PROJECT",
        link: "/admin",
      },
    });

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
