import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Automatic Experience Calculator Helper
export function calculateExperience(joiningDate: Date | string): { years: number; months: number; text: string } {
  const start = new Date(joiningDate);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (months < 0) {
    years--;
    months += 12;
  }

  const text = `${years} Years ${months} Months`;
  return { years, months, text };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const isPublic = searchParams.get("public") === "true";

    const employees = await prisma.employee.findMany({
      where: isPublic ? { isPublicTeam: true, status: "ACTIVE" } : undefined,
      include: {
        attendances: {
          take: 5,
          orderBy: { date: "desc" },
        },
        projectAssignments: {
          include: {
            project: { select: { name: true, location: true, status: true } },
          },
        },
      },
      orderBy: { employeeId: "asc" },
    });

    // Automatically calculate experience for each employee
    const enriched = employees.map((emp) => {
      const exp = calculateExperience(emp.joiningDate);

      if (isPublic) {
        // Strip sensitive private fields for public consumption
        return {
          id: emp.id,
          employeeId: emp.employeeId,
          name: emp.name,
          designation: emp.designation,
          department: emp.department,
          responsibility: emp.responsibility,
          experience: exp.text,
          education: emp.education,
          training: emp.training,
          skills: emp.skills,
          photo: emp.photo,
        };
      }

      // Admin view includes sensitive fields and calculations
      return {
        ...emp,
        calculatedExperience: exp.text,
        calculatedYears: exp.years,
        calculatedMonths: exp.months,
      };
    });

    return NextResponse.json(enriched);
  } catch (error: any) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      employeeId,
      name,
      designation,
      department,
      responsibility,
      joiningDate,
      education,
      training,
      skills,
      salary,
      personalPhone,
      personalAddress,
      photo,
      internalNotes,
      status,
    } = body;

    if (!employeeId || !name || !designation || !joiningDate) {
      return NextResponse.json(
        { error: "Employee ID, Name, Designation, and Joining Date are required." },
        { status: 400 }
      );
    }

    const exp = calculateExperience(joiningDate);

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        name,
        designation,
        department: department || "General Maintenance",
        responsibility: responsibility || null,
        joiningDate: new Date(joiningDate),
        experienceYears: exp.years,
        experienceMonths: exp.months,
        education: education || null,
        training: training || null,
        skills: Array.isArray(skills) ? skills : [],
        salary: salary ? parseFloat(salary) : null,
        personalPhone: personalPhone || null,
        personalAddress: personalAddress || null,
        photo: photo || null,
        internalNotes: internalNotes || null,
        status: status || "ACTIVE",
      },
    });

    return NextResponse.json({
      success: true,
      employee: {
        ...employee,
        calculatedExperience: exp.text,
      },
    });
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, name, designation, department, status, salary, skills, personalPhone, personalAddress } = body;

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        ...(name ? { name } : {}),
        ...(designation ? { designation } : {}),
        ...(department ? { department } : {}),
        ...(status ? { status } : {}),
        ...(salary !== undefined ? { salary: parseFloat(salary) } : {}),
        ...(Array.isArray(skills) ? { skills } : {}),
        ...(personalPhone !== undefined ? { personalPhone } : {}),
        ...(personalAddress !== undefined ? { personalAddress } : {}),
      },
    });

    return NextResponse.json({ success: true, employee: updated });
  } catch (error: any) {
    console.error("Error updating employee:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Employee ID is required" }, { status: 400 });
    }

    await prisma.attendance.deleteMany({ where: { employeeId: id } });
    await prisma.projectAssignment.deleteMany({ where: { employeeId: id } });
    await prisma.employee.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

