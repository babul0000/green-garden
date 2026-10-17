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
        attendances: { take: 5, orderBy: { date: "desc" } },
        projectAssignments: { include: { project: { select: { name: true, location: true, status: true } } } },
      },
      orderBy: { employeeId: "asc" },
    });

    const enriched = employees.map((emp) => {
      const exp = calculateExperience(emp.joiningDate);
      return { ...emp, calculatedExperience: exp.text, calculatedYears: exp.years, calculatedMonths: exp.months };
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
  const { id, name, designation, department, status, salary, skills, personalPhone, personalAddress } = body;
  if (!id) return apiError("Employee ID is required", 400);

  const updated = await prisma.employee.update({
    where: { id },
    data: {
      ...(name ? { name } : {}),
      ...(designation ? { designation } : {}),
      ...(department ? { department } : {}),
      ...(status ? { status } : {}),
      ...(salary !== undefined ? { salary: parseFloat(String(salary)) } : {}),
      ...(Array.isArray(skills) ? { skills } : {}),
      ...(personalPhone !== undefined ? { personalPhone } : {}),
      ...(personalAddress !== undefined ? { personalAddress } : {}),
    },
  });

  return NextResponse.json({ success: true, employee: updated });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Employee ID is required", 400);

  await prisma.$transaction([
    prisma.attendance.deleteMany({ where: { employeeId: id } }),
    prisma.projectAssignment.deleteMany({ where: { employeeId: id } }),
    prisma.employee.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true });
});
