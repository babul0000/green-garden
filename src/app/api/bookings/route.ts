import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee, withAuthErrorHandling } from "@/lib/apiAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

// Protected GET: Admin/Moderator can view all bookings, Employee can ONLY view their assigned bookings
export const GET = withAuthErrorHandling(async (req: Request) => {
  const user = await requireEmployee(req);
  const isEmployee = user.role?.toUpperCase() === "EMPLOYEE";

  const { isPaginated, page, limit, skip, q, status, searchParams } = parsePaginationParams(req);

  // If Employee, find their linked Employee ID
  let employeeId: string | undefined;
  if (isEmployee) {
    const emp = await prisma.employee.findFirst({
      where: {
        OR: [
          { userId: user.id },
          { name: { equals: user.name, mode: "insensitive" } },
        ],
      },
      select: { id: true },
    });
    employeeId = emp?.id;
  }

  const searchFilter = q
    ? {
        OR: [
          { clientName: { contains: q, mode: "insensitive" as const } },
          { clientEmail: { contains: q, mode: "insensitive" as const } },
          { phone: { contains: q, mode: "insensitive" as const } },
          { service: { contains: q, mode: "insensitive" as const } },
          { address: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const where = {
    ...(isEmployee
      ? {
          OR: [
            ...(employeeId ? [{ assignedStaffId: employeeId }] : []),
            { assignedStaff: user.name },
          ],
        }
      : {}),
    ...(status && status !== "all" ? { status } : {}),
    ...searchFilter,
  };

  const total = isPaginated ? await prisma.booking.count({ where }) : 0;

  const bookings = await prisma.booking.findMany({
    where,
    orderBy: { createdAt: "desc" },
    skip: isPaginated ? skip : undefined,
    take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
  });

  // Attach assigned staff details cleanly
  const staffIds = bookings
    .map((b: any) => b.assignedStaffId)
    .filter(Boolean) as string[];

  const staffMembers = staffIds.length > 0
    ? await prisma.employee.findMany({
        where: { id: { in: staffIds } },
        select: { id: true, name: true, designation: true, photo: true },
      })
    : [];
  const staffMap = new Map(staffMembers.map((s) => [s.id, s]));

  const enrichedBookings = bookings.map((b: any) => ({
    ...b,
    assignedStaffMember: b.assignedStaffId ? staffMap.get(b.assignedStaffId) || null : null,
  }));

  return NextResponse.json(
    formatDataResponse(enrichedBookings, total, { isPaginated, page, limit }),
    { headers: NO_CACHE }
  );
});

// Public POST: Customers and visitors submit booking requests
export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 10 * 60 * 1000, prefix: "bookings_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const { clientName, clientEmail, phone, address, service, budgetRange, message, userId } = body;

    if (!clientName || !clientEmail || !service) {
      return NextResponse.json(
        { error: "Client Name, Email, and Service are required." },
        { status: 400 }
      );
    }

    const booking = await prisma.booking.create({
      data: {
        clientName,
        clientEmail,
        phone: phone || null,
        address: address || null,
        service,
        budgetRange: budgetRange || null,
        message: message || null,
        userId: userId || null,
        status: "Pending",
        paymentStatus: "unpaid",
      },
    });

    // Notify Admin (link points to bookings tab)
    await prisma.notification.create({
      data: {
        title: `📅 নতুন সার্ভিস বুকিং: ${clientName}`,
        message: `${clientName} (${service}) সার্ভিসের জন্য বুকিং দিয়েছেন। যোগাযোগ: ${phone || clientEmail}`,
        type: "REQUEST",
        link: "bookings",
      },
    });

    // Notify Client if logged in
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: "সার্ভিস বুকিং আবেদন গৃহীত হয়েছে",
          message: `আপনার '${service}' সার্ভিসের বুকিং আবেদন গৃহীত হয়েছে। শীঘ্রই স্টুডিও প্রতিনিধি আপনার সাথে যোগাযোগ করবেন।`,
          type: "REQUEST",
          link: "projects",
        },
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
