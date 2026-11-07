import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, getCurrentUser, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

// Automatic Experience Calculator Helper
export function calculateExperience(joiningDate: Date | string): { years: number; months: number; text: string } {
  const start = new Date(joiningDate);
  const now = new Date();
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  if (months < 0) { years--; months += 12; }
  return { years, months, text: `${years} Years ${months} Months` };
}

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";
    const user = await getCurrentUser(req);
    const isAdmin = user?.role?.toUpperCase() === "ADMIN";

    if (!isAdmin) {
      const publicEmployees = await prisma.employee.findMany({
        where: isPublic ? { isPublicTeam: true, status: "ACTIVE" } : undefined,
        select: {
          id: true,
          employeeId: true,
          name: true,
          designation: true,
          department: true,
          responsibility: true,
          joiningDate: true,
          education: true,
          training: true,
          skills: true,
          photo: true,
          status: true,
          isPublicTeam: true,
        },
        orderBy: { employeeId: "asc" },
      });

      const enriched = publicEmployees.map((emp) => {
        const exp = calculateExperience(emp.joiningDate);
        return {
          ...emp,
          experience: exp.text,
        };
      });

      return NextResponse.json(enriched, { headers: NO_CACHE });
    }

    const employees = await prisma.employee.findMany({
      where: isPublic ? { isPublicTeam: true, status: "ACTIVE" } : undefined,
      include: {
        user: { select: { id: true, email: true, role: true, name: true } },
        attendances: { take: 5, orderBy: { date: "desc" } },
        projectAssignments: { include: { project: { select: { name: true, location: true, status: true } } } },
      },
      orderBy: { employeeId: "asc" },
    });

    const enriched = employees.map((emp) => {
      const exp = calculateExperience(emp.joiningDate);
      return {
        ...emp,
        role: emp.user?.role || "EMPLOYEE",
        calculatedExperience: exp.text,
        calculatedYears: exp.years,
        calculatedMonths: exp.months,
      };
    });

    return NextResponse.json(enriched, { headers: NO_CACHE });
  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === "development";
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: isDev ? msg : "Failed to fetch employees." }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const body = await req.json();
  const { employeeId, name, designation, department, responsibility, joiningDate, education,
    training, skills, salary, personalPhone, personalAddress, photo, internalNotes, status } = body;

  if (!employeeId || !name || !designation || !joiningDate) {
    return apiError("Employee ID, Name, Designation, and Joining Date are required.", 400);
  }

  const exp = calculateExperience(joiningDate);
  const employee = await prisma.employee.create({
    data: {
      employeeId, name, designation, department: department || "General Maintenance",
      responsibility: responsibility || null, joiningDate: new Date(joiningDate),
      experienceYears: exp.years, experienceMonths: exp.months,
      education: education || null, training: training || null,
      skills: Array.isArray(skills) ? skills : [],
      salary: salary ? parseFloat(String(salary)) : null,
      personalPhone: personalPhone || null, personalAddress: personalAddress || null,
      photo: photo || null, internalNotes: internalNotes || null,
      status: status || "ACTIVE",
    },
  });

  return NextResponse.json({ success: true, employee: { ...employee, calculatedExperience: exp.text } });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const body = await req.json();
  const {
    id,
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
  if (!id) return apiError("Employee ID is required", 400);

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

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  let id = searchParams.get("id");
  if (!id) {
    try {
      const body = await req.json();
      id = body?.id;
    } catch {}
  }
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
