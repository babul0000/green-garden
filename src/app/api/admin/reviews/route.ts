import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, withAuthErrorHandling, apiError } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" },
  });

  const formatted = reviews.map((r) => ({
    id: r.id,
    name: r.name,
    rating: r.rating,
    comment: r.text,
    text: r.text,
    service: r.service || "Landscape Design",
    location: r.location || "Dhaka",
    status: r.status,
    createdAt: r.createdAt,
  }));

  return NextResponse.json(formatted, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const body = await req.json();
  const { name, rating, comment, text, service, status, location } = body;

  const reviewText = text || comment;
  if (!name || !reviewText) {
    return apiError("Name and review comment are required", 400);
  }

  const newReview = await prisma.review.create({
    data: {
      name,
      rating: parseInt(String(rating), 10) || 5,
      text: reviewText,
      service: service || "General Services",
      location: location || "Dhaka",
      status: status || "Approved",
    },
  });

  return NextResponse.json(
    {
      success: true,
      id: newReview.id,
      review: {
        ...newReview,
        comment: newReview.text,
      },
    },
    { status: 201, headers: NO_CACHE }
  );
});
