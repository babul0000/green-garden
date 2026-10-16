import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee, requireModerator, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

export const PUT = withAuthErrorHandling(async (
  req: Request,
  context?: { params?: Promise<{ id: string }> }
) => {
  const user = await requireEmployee(req);
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  const role = user.role?.toUpperCase();
  const body = await req.json();

  // If Employee, verify they are assigned to this booking
  if (role === "EMPLOYEE") {
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing || existing.assignedStaff !== user.name) {
      return NextResponse.json(
        { error: "Access denied: you can only update bookings assigned to you." },
        { status: 403 }
      );
    }

    // Employees cannot reassign staff, only update progress status or notes
    const { status, notes } = body;
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });
    return NextResponse.json(updated);
  }

  // Admin or Moderator can update any fields
  const updated = await prisma.booking.update({
    where: { id },
    data: body,
  });

  return NextResponse.json(updated);
});

export const DELETE = withAuthErrorHandling(async (
  req: Request,
  context?: { params?: Promise<{ id: string }> }
) => {
  await requireModerator(req);
  const params = await context?.params;
  const id = params?.id;
  if (!id) {
    return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
  }

  await prisma.booking.delete({
    where: { id },
  });
  return NextResponse.json({ message: "Booking deleted successfully" });
});
