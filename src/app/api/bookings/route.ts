import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// Protected GET: Admin/Moderator can view all bookings, Employee can ONLY view their assigned bookings
export const GET = withAuthErrorHandling(async (req: Request) => {
  const user = await requireEmployee(req);
  const isEmployee = user.role?.toUpperCase() === "EMPLOYEE";

  const bookings = await prisma.booking.findMany({
    where: isEmployee
      ? { assignedStaff: user.name }
      : undefined,
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bookings, { headers: NO_CACHE });
});

// Public POST: Customers and visitors submit booking requests
export async function POST(req: Request) {
  try {
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

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: `📅 নতুন সার্ভিস বুকিং: ${clientName}`,
        message: `${clientName} (${service}) সার্ভিসের জন্য বুকিং দিয়েছেন। যোগাযোগ: ${phone || clientEmail}`,
        type: "REQUEST",
        link: "/admin",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
