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
    const emp = await prisma.employee.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { name: { equals: user.name, mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });

    const existing = await prisma.booking.findUnique({ where: { id } });
    const isAssigned =
      existing &&
      ((emp?.id && existing.assignedStaffId === emp.id) ||
        existing.assignedStaff === user.name);

    if (!isAssigned) {
      return NextResponse.json(
        { error: "Access denied: you can only update bookings assigned to you." },
        { status: 403 }
      );
    }

    // Employees cannot reassign staff, only update progress status
    const { status } = body;
    const updated = await prisma.booking.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
      },
    });
    return NextResponse.json(updated);
  }

  // Admin or Moderator can update any fields including staff assignment
  const updateData: any = { ...body };
  let staffMemberObj: any = null;

  if ("assignedStaffId" in body) {
    if (body.assignedStaffId) {
      const staffEmp = await prisma.employee.findUnique({
        where: { id: body.assignedStaffId },
        select: { id: true, name: true, designation: true, photo: true },
      });
      if (staffEmp) {
        updateData.assignedStaffId = staffEmp.id;
        updateData.assignedStaff = staffEmp.name;
        staffMemberObj = staffEmp;
      }
    } else {
      updateData.assignedStaffId = null;
      updateData.assignedStaff = "Unassigned";
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: updateData,
  });

  return NextResponse.json({
    ...updated,
    assignedStaffMember: staffMemberObj,
  });
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
