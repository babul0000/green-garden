import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling, apiError } from "@/lib/apiAuth";
import { Role } from "@prisma/client";
import { logActivity } from "@/lib/activityLog";

export const dynamic = "force-dynamic";

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const PUT = withAuthErrorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const adminActor = await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { role } = body;

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!existingUser) {
      return apiError("User not found", 404);
    }

    let prismaRole: Role = Role.CLIENT;
    const upperRole = String(role || "CLIENT").toUpperCase();
    if (upperRole in Role) {
      prismaRole = upperRole as Role;
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: prismaRole },
      select: { id: true, name: true, email: true, role: true },
    });

    await logActivity({
      userId: adminActor.id,
      userName: adminActor.name,
      action: "UPDATE",
      entity: "User",
      entityId: updatedUser.id,
      summary: `ইউজার রোল পরিবর্তন করা হয়েছে: ${updatedUser.name} (${existingUser.role} ➔ ${updatedUser.role})`,
      details: { previousRole: existingUser.role, newRole: updatedUser.role },
    });

    return NextResponse.json({ success: true, user: updatedUser }, { headers: NO_CACHE });
  }
);

export const DELETE = withAuthErrorHandling(
  async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const adminActor = await requireAdmin(req);
    const { id } = await params;

    // Prevent deleting self
    if (adminActor.id === id) {
      return apiError("You cannot delete your own admin account", 400);
    }

    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!existingUser) {
      return apiError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id },
    });

    await logActivity({
      userId: adminActor.id,
      userName: adminActor.name,
      action: "DELETE",
      entity: "User",
      entityId: id,
      summary: `ইউজার অ্যাকাউন্ট মুছে ফেলা হয়েছে: ${existingUser.name} (${existingUser.email}, রোল: ${existingUser.role})`,
      details: { deletedEmail: existingUser.email, role: existingUser.role },
    });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { headers: NO_CACHE }
    );
  }
);
