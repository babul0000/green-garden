import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const assignments = await prisma.projectAssignment.findMany({
      include: {
        employee: {
          select: { id: true, name: true, employeeId: true, designation: true, department: true },
        },
        project: {
          select: { id: true, name: true, location: true, status: true, progress: true },
        },
      },
      orderBy: { assignedDate: "desc" },
    });

    return NextResponse.json(assignments);
  } catch (error: any) {
    console.error("Error fetching project assignments:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { projectId, employeeId, roleOnTask, assignedDate, notes } = body;

    if (!projectId || !employeeId) {
      return NextResponse.json(
        { error: "Project ID and Employee ID are required." },
        { status: 400 }
      );
    }

    const targetDate = assignedDate ? new Date(assignedDate) : new Date();
    const dayStart = new Date(targetDate);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(targetDate);
    dayEnd.setHours(23, 59, 59, 999);

    // SCHEDULE CONFLICT CHECK:
    // Check if the same employee is already assigned to a DIFFERENT project on the same date with status 'ASSIGNED' or 'WORKING'
    const existingConflict = await prisma.projectAssignment.findFirst({
      where: {
        employeeId,
        projectId: { not: projectId },
        assignedDate: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: { in: ["ASSIGNED", "WORKING"] },
      },
      include: {
        project: { select: { name: true, location: true } },
        employee: { select: { name: true } },
      },
    });

    if (existingConflict) {
      // Create Schedule Conflict Alert Notification in PostgreSQL
      const conflictMsg = `⚠️ Schedule Conflict Alert: ${existingConflict.employee.name} ইতিমধ্যে "${existingConflict.project.name}" (${existingConflict.project.location})-এ একই দিনে অ্যাসাইন করা আছে!`;

      await prisma.notification.create({
        data: {
          title: "Schedule Conflict Alert (শিডিউল কনফ্লিক্ট)",
          message: conflictMsg,
          type: "SCHEDULE_CONFLICT",
          link: "/admin",
        },
      });

      return NextResponse.json(
        {
          conflict: true,
          error: conflictMsg,
          conflictingAssignment: existingConflict,
        },
        { status: 409 } // 409 Conflict
      );
    }

    // No conflict: create the assignment
    const assignment = await prisma.projectAssignment.create({
      data: {
        projectId,
        employeeId,
        roleOnTask: roleOnTask || "Site Specialist",
        assignedDate: targetDate,
        status: "ASSIGNED",
        notes,
      },
      include: {
        project: { select: { name: true, location: true } },
        employee: { select: { name: true } },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Employee successfully assigned to project.",
      assignment,
    });
  } catch (error: any) {
    console.error("Error creating project assignment:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
