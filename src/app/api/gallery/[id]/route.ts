import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const PUT = withAuthErrorHandling(async (
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) => {
  await requireAdmin(req);

  const params = await context?.params;
  const id = params?.id as string;
  if (!id) return apiError("Gallery item ID is required", 400);

  const body = await req.json();
  const updated = await prisma.galleryItem.update({ where: { id }, data: body });
  return NextResponse.json(updated);
});

export const DELETE = withAuthErrorHandling(async (
  req: Request,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  context?: any
) => {
  await requireAdmin(req);

  const params = await context?.params;
  const id = params?.id as string;
  if (!id) return apiError("Gallery item ID is required", 400);

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ message: "Gallery item deleted successfully" });
});
