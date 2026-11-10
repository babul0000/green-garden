import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling, apiError } from "@/lib/apiAuth";
import { calculateExperience } from "../route";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = withAuthErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  if (!id) return apiError("Employee ID is required", 400);

  const employee = await prisma.employee.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, email: true, role: true, name: true } },
      attendances: { take: 10, orderBy: { date: "desc" } },
      projectAssignments: { include: { project: { select: { name: true, location: true, status: true } } } },
    },
  });

  if (!employee) return apiError("Employee not found", 404);

  const exp = calculateExperience(employee.joiningDate);
  return NextResponse.json({
    ...employee,
    role: employee.user?.role || "EMPLOYEE",
    calculatedExperience: exp.text,
  });
});

export const PUT = withAuthErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(req);
  const { id } = await params;
  if (!id) return apiError("Employee ID is required", 400);

  const body = await req.json();
  const {
    employeeId,
    name,
    designation,
    department,
    status,
    salary,
    skills,
    personalPhone,
    personalAddress,
    photo,
    joiningDate,
    responsibility,
    education,
    training,
    internalNotes,
    isPublicTeam,
    role,
  } = body;

  let expUpdate = {};
  if (joiningDate) {
    const exp = calculateExperience(joiningDate);
    expUpdate = {
      joiningDate: new Date(joiningDate),
      experienceYears: exp.years,
      experienceMonths: exp.months,
    };
  }

  const updated = await prisma.employee.update({
    where: { id },
    data: {
      ...(employeeId ? { employeeId } : {}),
      ...(name ? { name } : {}),
      ...(designation ? { designation } : {}),
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
      ...(salary !== undefined ? { salary: parseFloat(String(salary)) || 0 } : {}),
      ...(Array.isArray(skills) ? { skills } : {}),
      ...(personalPhone !== undefined ? { personalPhone } : {}),
      ...(personalAddress !== undefined ? { personalAddress } : {}),
      ...(photo !== undefined ? { photo } : {}),
      ...(responsibility !== undefined ? { responsibility } : {}),
      ...(education !== undefined ? { education } : {}),
      ...(training !== undefined ? { training } : {}),
      ...(internalNotes !== undefined ? { internalNotes } : {}),
      ...(isPublicTeam !== undefined ? { isPublicTeam: Boolean(isPublicTeam) } : {}),
      ...expUpdate,
    },
    include: {
      user: { select: { id: true, email: true, role: true } },
    },
  });

  if (role) {
    const targetRole = String(role).toUpperCase();
    if (["ADMIN", "MODERATOR", "EDITOR", "EMPLOYEE", "CLIENT"].includes(targetRole)) {
      if (updated.userId) {
        await prisma.user.update({
          where: { id: updated.userId },
          data: { role: targetRole as any },
        });
      } else if (updated.personalPhone) {
        const foundUser = await prisma.user.findFirst({
          where: { phone: updated.personalPhone },
        });
        if (foundUser) {
          await prisma.user.update({
            where: { id: foundUser.id },
            data: { role: targetRole as any },
          });
          await prisma.employee.update({
            where: { id },
            data: { userId: foundUser.id },
          });
        }
      }
    }
  }

  const exp = calculateExperience(updated.joiningDate);
  return NextResponse.json({
    success: true,
    employee: {
      ...updated,
      role: role || updated.user?.role || "EMPLOYEE",
      calculatedExperience: exp.text,
    },
  });
});

export const DELETE = withAuthErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(req);
  const { id } = await params;
  if (!id) return apiError("Employee ID is required", 400);

  await prisma.$transaction([
    prisma.attendance.deleteMany({ where: { employeeId: id } }),
    prisma.projectAssignment.deleteMany({ where: { employeeId: id } }),
    prisma.treeDoctorRequest.updateMany({ where: { assignedDoctorId: id }, data: { assignedDoctorId: null } }),
    prisma.maintenanceSchedule.updateMany({ where: { assignedStaffId: id }, data: { assignedStaffId: null } }),
    prisma.employee.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true, message: "কর্মী সফলভাবে মুছে ফেলা হয়েছে।" });
});

