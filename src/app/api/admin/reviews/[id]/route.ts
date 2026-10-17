import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireAdmin, withAuthErrorHandling, apiError } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id) return apiError("Review ID is required", 400);

  const body = await req.json();
  const { status, name, rating, comment, text, service, location, featured, adminReply, photoUrl, projectId } = body;

  const dataToUpdate: any = {};
  if (status !== undefined) dataToUpdate.status = status;
  if (name !== undefined) dataToUpdate.name = name;
  if (rating !== undefined) dataToUpdate.rating = parseInt(String(rating), 10);
  if (text !== undefined || comment !== undefined) dataToUpdate.text = text || comment;
  if (service !== undefined) dataToUpdate.service = service;
  if (location !== undefined) dataToUpdate.location = location;
  if (featured !== undefined) dataToUpdate.featured = Boolean(featured);
  if (adminReply !== undefined) dataToUpdate.adminReply = adminReply;
  if (photoUrl !== undefined) dataToUpdate.photoUrl = photoUrl;
  if (projectId !== undefined) dataToUpdate.projectId = projectId;

  const updated = await prisma.review.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json({ success: true, review: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id) return apiError("Review ID is required", 400);

  await prisma.review.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Review deleted successfully" }, { headers: NO_CACHE });
});
