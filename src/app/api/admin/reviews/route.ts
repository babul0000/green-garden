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
    include: {
      project: { select: { id: true, name: true, slug: true } },
    },
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
    featured: r.featured,
    adminReply: r.adminReply,
    photoUrl: r.photoUrl,
    projectId: r.projectId,
    project: r.project,
    createdAt: r.createdAt,
  }));

  return NextResponse.json(formatted, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const body = await req.json();

  // Bulk actions: { action: "approve" | "reject" | "delete", ids: string[] }
  if (body.action && Array.isArray(body.ids)) {
    const { action, ids } = body;
    if (action === "approve") {
      await prisma.review.updateMany({
        where: { id: { in: ids } },
        data: { status: "Approved" },
      });
      return NextResponse.json({ success: true, count: ids.length, message: "Reviews approved." });
    }
    if (action === "reject") {
      await prisma.review.updateMany({
        where: { id: { in: ids } },
        data: { status: "Rejected" },
      });
      return NextResponse.json({ success: true, count: ids.length, message: "Reviews rejected." });
    }
    if (action === "delete") {
      await prisma.review.deleteMany({
        where: { id: { in: ids } },
      });
      return NextResponse.json({ success: true, count: ids.length, message: "Reviews deleted." });
    }
  }

  const { name, rating, comment, text, service, status, location, featured, adminReply, photoUrl, projectId } = body;

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
      featured: Boolean(featured),
      adminReply: adminReply || null,
      photoUrl: photoUrl || null,
      projectId: projectId || null,
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
