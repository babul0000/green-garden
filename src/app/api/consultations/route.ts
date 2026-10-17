import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, withAuthErrorHandling } from "@/lib/apiAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 10, windowMs: 10 * 60 * 1000, prefix: "consultations_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const {
      clientName,
      name,
      clientPhone,
      phone,
      serviceCategory,
      service,
      siteAddress,
      address,
      notes,
      message,
      budgetRange,
      userId,
    } = body;

    const actualName = clientName || name;
    const actualPhone = clientPhone || phone;
    const actualService = serviceCategory || service || "General Garden Consultation";
    const actualAddress = siteAddress || address || "Dhaka, Bangladesh";
    const actualNotes = notes || message || "";

    if (!actualName || !actualPhone) {
      return NextResponse.json(
        { error: "Name and Phone number are required." },
        { status: 400 }
      );
    }

    // Check if this is an Emergency Tree Doctor consultation
    if (
      actualService.toLowerCase().includes("tree") ||
      actualService.toLowerCase().includes("doctor")
    ) {
      const treeReq = await prisma.treeDoctorRequest.create({
        data: {
          clientName: actualName,
          clientPhone: actualPhone,
          location: actualAddress,
          treeName: actualNotes.includes("Tree/Plant:")
            ? actualNotes.split("Tree/Plant:")[1]?.split("\n")[0]?.trim() || "Urgent Tree Case"
            : "Emergency Patient Plant",
          problem: actualNotes || "Emergency Tree Doctor requested via consultation portal",
          preferredVisitTime: "IMMEDIATE EMERGENCY VISIT",
          isEmergency: true,
          status: "PENDING",
          userId: userId || null,
        },
      });

      await prisma.notification.create({
        data: {
          title: `🚨 জরুরি বৃক্ষ চিকিৎসা বুকিং: ${actualName}`,
          message: `${actualName} (${actualPhone}) - ${actualAddress} থেকে জরুরি ট্রি ডক্টর চেয়েছেন।`,
          type: "TREE_DOCTOR",
          link: "/admin",
        },
      });

      // Dispatch Email Notification
      try {
        const { sendTreeDoctorEmergencyAlert } = await import("@/lib/email");
        await sendTreeDoctorEmergencyAlert({
          clientName: actualName,
          clientPhone: actualPhone,
          clientLocation: actualAddress,
          problemDescription: actualNotes,
          urgencyLevel: "জরুরি কনসালটেশন (Immediate Urgent Care)",
        });
      } catch (err: any) {
        console.warn("Email alert error:", err?.message);
      }

      return NextResponse.json({
        success: true,
        message: "Emergency Tree Doctor request recorded successfully.",
        consultationId: treeReq.id,
        type: "tree_doctor",
      });
    }

    // Standard Garden & Landscaping Booking / Consultation
    const newBooking = await prisma.booking.create({
      data: {
        clientName: actualName,
        clientEmail: body.email || body.clientEmail || null,
        phone: actualPhone,
        address: actualAddress,
        service: actualService,
        budgetRange: budgetRange || "Negotiable",
        message: actualNotes,
        userId: userId || null,
        status: "Pending",
        paymentStatus: "unpaid",
      },
    });

    // Create Notification
    await prisma.notification.create({
      data: {
        title: `🌱 নতুন কনসালটেশন রিকোয়েস্ট: ${actualName}`,
        message: `${actualName} (${actualPhone}) - ${actualService} সার্ভিসের জন্য আলোচনা করতে চেয়েছেন।`,
        type: "REQUEST",
        link: "/admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Consultation request submitted successfully.",
      consultationId: newBooking.id,
      booking: newBooking,
    });
  } catch (error: any) {
    console.error("Error processing consultation:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(bookings, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
    },
  });
});
