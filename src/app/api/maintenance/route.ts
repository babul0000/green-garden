import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");
    const dateParam = searchParams.get("date");

    const schedules = await prisma.maintenanceSchedule.findMany({
      where: location ? { location: { contains: location, mode: "insensitive" } } : undefined,
      include: {
        assignedStaff: { select: { name: true, employeeId: true, designation: true } },
        project: { select: { name: true, location: true } },
      },
      orderBy: { scheduledDate: "asc" },
    });

    // SMART AREA-BASED PROXIMITY CLUSTERING SUGGESTIONS
    // If a date and location are passed, look for neighboring tasks to suggest clustering
    let proximitySuggestions: any[] = [];
    if (location && dateParam) {
      const targetDate = new Date(dateParam);
      const dayStart = new Date(targetDate);
      dayStart.setDate(dayStart.getDate() - 1);
      const dayEnd = new Date(targetDate);
      dayEnd.setDate(dayEnd.getDate() + 1);

      proximitySuggestions = await prisma.maintenanceSchedule.findMany({
        where: {
          location: { contains: location, mode: "insensitive" },
          scheduledDate: { gte: dayStart, lte: dayEnd },
        },
        include: {
          assignedStaff: { select: { name: true } },
          project: { select: { name: true } },
        },
      });
    }

    return NextResponse.json({
      schedules,
      proximitySuggestions,
    });
  } catch (error: any) {
    console.error("Error fetching maintenance schedules:", error);
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
      projectId,
      customerId,
      clientName,
      clientPhone,
      location,
      frequency, // WEEKLY, MONTHLY, REGULAR, ONE_TIME
      startDate,
      assignedStaffId,
      notes,
    } = body;

    if (!clientName || !location || !frequency) {
      return NextResponse.json(
        { error: "Client Name, Location, and Frequency are required." },
        { status: 400 }
      );
    }

    const baseDate = startDate ? new Date(startDate) : new Date();
    const createdSchedules = [];

    // AUTOMATIC SCHEDULE GENERATION (e.g. 5th Sep, 12th Sep, 19th Sep)
    let iterations = 1;
    let daysInterval = 30;

    if (frequency === "WEEKLY") {
      iterations = 4; // Generate next 4 weeks
      daysInterval = 7;
    } else if (frequency === "MONTHLY") {
      iterations = 3; // Generate next 3 months
      daysInterval = 30;
    } else if (frequency === "REGULAR") {
      iterations = 2;
      daysInterval = 14;
    }

    for (let i = 0; i < iterations; i++) {
      const scheduledDate = new Date(baseDate);
      scheduledDate.setDate(scheduledDate.getDate() + i * daysInterval);

      const schedule = await prisma.maintenanceSchedule.create({
        data: {
          projectId: projectId || null,
          customerId: customerId || null,
          clientName,
          clientPhone: clientPhone || null,
          location,
          frequency,
          scheduledDate,
          assignedStaffId: assignedStaffId || null,
          status: "SCHEDULED",
          notes: notes ? `${notes} (Visit ${i + 1}/${iterations})` : `Maintenance Visit ${i + 1}`,
        },
      });

      createdSchedules.push(schedule);
    }

    // Check for smart area proximity clustering with other jobs
    const nearbyJobs = await prisma.maintenanceSchedule.findMany({
      where: {
        location: { contains: location, mode: "insensitive" },
        id: { notIn: createdSchedules.map((s) => s.id) },
      },
      take: 3,
    });

    let smartAreaTip = null;
    if (nearbyJobs.length > 0) {
      smartAreaTip = `💡 Smart Area Suggestion: একই এলাকা (${location})-এ আরও ${nearbyJobs.length}টি মেইনটেন্যান্স শিডিউল রয়েছে।同一个 স্টাফকে একই দিনে পাঠালে যাতায়াত খরচ ও সময় সাশ্রয় হবে।`;
    }

    return NextResponse.json({
      success: true,
      message: `Successfully created ${createdSchedules.length} maintenance schedules.`,
      schedules: createdSchedules,
      smartAreaTip,
    });
  } catch (error: any) {
    console.error("Error creating maintenance schedule:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
