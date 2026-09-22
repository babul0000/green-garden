import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const employeeId = searchParams.get("employeeId");

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendances = await prisma.attendance.findMany({
      where: employeeId ? { employeeId } : undefined,
      include: {
        employee: {
          select: { name: true, employeeId: true, designation: true },
        },
      },
      orderBy: { date: "desc" },
      take: 100,
    });

    // Calculate metrics
    const totalRecords = attendances.length || 1;
    const presentCount = attendances.filter((a) => a.status === "PRESENT").length;
    const absentCount = attendances.filter((a) => a.status === "ABSENT").length;
    const lateCount = attendances.filter((a) => a.status === "LATE").length;
    const leaveCount = attendances.filter((a) => a.status === "LEAVE").length;
    const attendancePercentage = ((presentCount / totalRecords) * 100).toFixed(1);

    return NextResponse.json({
      attendances,
      summary: {
        total: totalRecords,
        present: presentCount,
        absent: absentCount,
        late: lateCount,
        leave: leaveCount,
        attendancePercentage: `${attendancePercentage}%`,
      },
    });
  } catch (error: any) {
    console.error("Error fetching attendance:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { employeeId, action, notes } = body; // action: 'CHECK_IN' | 'CHECK_OUT'

    if (!employeeId || !action) {
      return NextResponse.json(
        { error: "Employee ID and action (CHECK_IN / CHECK_OUT) are required." },
        { status: 400 }
      );
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Look for today's record
    let record = await prisma.attendance.findFirst({
      where: {
        employeeId,
        date: { gte: today },
      },
    });

    const now = new Date();

    if (action === "CHECK_IN") {
      if (record && record.checkIn) {
        return NextResponse.json(
          { error: "Employee already checked in today." },
          { status: 400 }
        );
      }

      // Check if late (e.g. after 09:30 AM)
      const isLate = now.getHours() > 9 || (now.getHours() === 9 && now.getMinutes() > 30);
      const status = isLate ? "LATE" : "PRESENT";

      if (record) {
        record = await prisma.attendance.update({
          where: { id: record.id },
          data: { checkIn: now, status, notes: notes || record.notes },
        });
      } else {
        record = await prisma.attendance.create({
          data: {
            employeeId,
            date: now,
            checkIn: now,
            status,
            notes,
          },
        });
      }
    } else if (action === "CHECK_OUT") {
      if (!record) {
        record = await prisma.attendance.create({
          data: {
            employeeId,
            date: now,
            checkOut: now,
            status: "PRESENT",
            notes,
          },
        });
      } else {
        record = await prisma.attendance.update({
          where: { id: record.id },
          data: { checkOut: now, notes: notes || record.notes },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully recorded ${action}`,
      record,
    });
  } catch (error: any) {
    console.error("Error processing attendance:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
