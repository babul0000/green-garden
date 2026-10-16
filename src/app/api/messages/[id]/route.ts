import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export const DELETE = withAuthErrorHandling(async (
  req: Request,
  context?: { params?: Promise<{ id: string }> }
) => {
  await requireModerator(req);
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Message ID is required" }, { status: 400 });
  }

  await prisma.contactMessage.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Message deleted successfully" });
});
