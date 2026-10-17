import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 10, windowMs: 10 * 60 * 1000, prefix: "tree_doctor_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const {
      clientName,
      clientPhone,
      location,
      treeName,
      problem,
      treePhotoUrl,
      preferredVisitTime,
      isEmergency,
      userId,
    } = body;

    if (!clientName || !clientPhone || !treeName || !problem) {
      return NextResponse.json(
        { error: "Client Name, Phone, Tree Name, and Problem description are required." },
        { status: 400 }
      );
    }

    const request = await prisma.treeDoctorRequest.create({
      data: {
        clientName,
        clientPhone,
        location: location || "Dhaka",
        treeName,
        problem,
        treePhotoUrl: treePhotoUrl || null,
        preferredVisitTime: preferredVisitTime || "As soon as possible",
        isEmergency: Boolean(isEmergency),
        status: "PENDING",
        userId: userId || null,
      },
    });

    // Create an Admin Notification (distinguish emergency type and link to tree-doctor tab)
    const alertTitle = isEmergency
      ? `🚨 [ইমার্জেন্সি] জরুরি ট্রি ডক্টর রিকোয়েস্ট: ${treeName}`
      : `🩺 নতুন ট্রি ডক্টর বুকিং: ${treeName}`;

    await prisma.notification.create({
      data: {
        title: alertTitle,
        message: `${clientName} (${clientPhone}) - ${location} এ আক্রান্ত ${treeName} এর জন্য ${isEmergency ? "জরুরি চিকিৎসা" : "অ্যাপয়েন্টমেন্ট"} চেয়েছেন। সমস্যা: ${problem}`,
        type: isEmergency ? "TREE_DOCTOR_EMERGENCY" : "TREE_DOCTOR",
        link: "tree-doctor",
      },
    });

    // Notify Client if logged in
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: isEmergency ? "🚨 জরুরি ট্রি ডক্টর আবেদন গৃহীত" : "🩺 ট্রি ডক্টর অ্যাপয়েন্টমেন্ট আবেদন গৃহীত",
          message: `${treeName} এর জন্য আপনার অনুরোধটি নিবন্ধিত হয়েছে। আমাদের বিশেষ টিম দ্রুত যোগাযোগ করবে।`,
          type: isEmergency ? "TREE_DOCTOR_EMERGENCY" : "TREE_DOCTOR",
          link: "consultation",
        },
      });
    }

    // Send Real-time Email Alert via Gmail SMTP
    try {
      const { sendTreeDoctorEmergencyAlert } = await import("@/lib/email");
      await sendTreeDoctorEmergencyAlert({
        clientName,
        clientPhone,
        clientLocation: location || "ঢাকা",
        problemDescription: `গাছের প্রজাতি: ${treeName}। সমস্যা: ${problem}`,
        urgencyLevel: isEmergency ? "জরুরি ইমার্জেন্সি (Immediate Tree Doctor Needed)" : "সাধারণ রুটিন চেকআপ",
        preferredTime: preferredVisitTime,
      });
    } catch (mailErr: any) {
      console.warn("Failed to dispatch email alert for tree doctor:", mailErr?.message);
    }

    // Trigger WhatsApp Automated Notification
    try {
      const { sendWhatsAppEmergencyTreeDoctorAlert } = await import("@/services/whatsapp");
      await sendWhatsAppEmergencyTreeDoctorAlert({
        clientName,
        clientPhone,
        location: location || "ঢাকা",
        treeName,
        problem,
        doctorName: "ডাঃ মোঃ রাহিম (সিনিয়র ট্রি সার্জন)",
        doctorPhone: "01883012641",
      });
    } catch (waErr: any) {
      console.warn("Failed to dispatch WhatsApp alert for tree doctor:", waErr?.message);
    }

    return NextResponse.json({
      success: true,
      message: "Tree Doctor request registered successfully.",
      request,
    });
  } catch (error: any) {
    console.error("Error creating tree doctor request:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

import { requireAuth, requireModerator, requireAdmin, requireEmployee, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const GET = withAuthErrorHandling(async (req: Request) => {
  const user = await requireAuth(req);
  const role = user.role?.toUpperCase();

  const { searchParams } = new URL(req.url);
  const targetUserId = searchParams.get("userId");
  const status = searchParams.get("status");

  const whereClause: any = {};

  if (role === "ADMIN" || role === "MODERATOR" || role === "EMPLOYEE" || role === "EDITOR") {
    if (targetUserId) whereClause.userId = targetUserId;
  } else {
    // Regular clients can only access their own requests
    whereClause.OR = [
      { userId: user.id },
      ...(user.phone ? [{ clientPhone: user.phone }] : []),
    ];
  }

  if (status) {
    whereClause.status = status;
  }

  const requests = await prisma.treeDoctorRequest.findMany({
    where: whereClause,
    include: {
      assignedDoctor: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireEmployee(req);

  const body = await req.json();
  const { id, status, assignedDoctorId, diagnosis, treatment, doctorNotes, followUpDate } = body;

  if (!id) {
    return apiError("Tree Doctor Request ID is required", 400);
  }

  const updated = await prisma.treeDoctorRequest.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(assignedDoctorId !== undefined ? { assignedDoctorId: assignedDoctorId || null } : {}),
      ...(diagnosis !== undefined ? { diagnosis } : {}),
      ...(treatment !== undefined ? { treatment } : {}),
      ...(doctorNotes !== undefined ? { doctorNotes } : {}),
      ...(followUpDate ? { followUpDate: new Date(followUpDate) } : {}),
    },
    include: {
      assignedDoctor: true,
    },
  });

  return NextResponse.json({ success: true, request: updated });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return apiError("Request ID is required", 400);
  }

  await prisma.treeDoctorRequest.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Tree doctor request deleted successfully" });
});

