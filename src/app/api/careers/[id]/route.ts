import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export const PUT = withAuthErrorHandling(async (
  req: Request,
  context?: { params?: Promise<{ id: string }> }
) => {
  await requireAdmin(req);
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Application ID required" }, { status: 400 });
  }

  const body = await req.json();
  const updated = await prisma.careerApplication.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
});

export const DELETE = withAuthErrorHandling(async (
  req: Request,
  context?: { params?: Promise<{ id: string }> }
) => {
  await requireAdmin(req);
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Application ID required" }, { status: 400 });
  }

  await prisma.careerApplication.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Application deleted successfully" });
});
