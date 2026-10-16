import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling, apiError } from "@/lib/apiAuth";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

interface RouteContext {
  params: Promise<{ id: string }> | { id: string };
}

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id) return apiError("User ID is required", 400);

  const body = await req.json();
  const { name, role, phone } = body;

  const dataToUpdate: any = {};
  if (name !== undefined) dataToUpdate.name = name;
  if (phone !== undefined) dataToUpdate.phone = phone;

  if (role) {
    const upperRole = String(role).toUpperCase();
    if (upperRole in Role) {
      dataToUpdate.role = upperRole as Role;
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id },
    data: dataToUpdate,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      phone: true,
      updatedAt: true,
    },
  });

  return NextResponse.json({ success: true, user: updatedUser }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  const admin = await requireAdmin(req);

  const url = new URL(req.url);
  const pathSegments = url.pathname.split("/");
  const id = pathSegments[pathSegments.length - 1];

  if (!id) return apiError("User ID is required", 400);

  // Prevent admin from deleting themselves
  if (admin.id === id) {
    return apiError("You cannot delete your own administrative account.", 400);
  }

  await prisma.user.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "User deleted successfully" }, { headers: NO_CACHE });
});
