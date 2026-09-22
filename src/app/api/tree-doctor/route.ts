import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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

    // Create an Admin Notification
    const alertTitle = isEmergency
      ? `🚨 জরুরি ট্রি ডক্টর রিকোয়েস্ট: ${treeName}`
      : `🩺 নতুন ট্রি ডক্টর বুকিং: ${treeName}`;

    await prisma.notification.create({
      data: {
        title: alertTitle,
        message: `${clientName} (${clientPhone}) - ${location} এ আক্রান্ত ${treeName} এর জন্য ডাক্তার চেয়েছেন। সমস্যা: ${problem}`,
        type: "TREE_DOCTOR",
        link: "/admin",
      },
    });

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

export async function GET() {
  try {
    const requests = await prisma.treeDoctorRequest.findMany({
      include: {
        assignedDoctor: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Error fetching tree doctor requests:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
