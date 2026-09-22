import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      phone,
      email,
      spaceType,
      designStyle,
      features,
      sitePhotoUrl,
      approxArea,
      budgetRange,
      userId,
    } = body;

    if (!name || !phone || !spaceType) {
      return NextResponse.json(
        { error: "Name, phone number, and space type are required." },
        { status: 400 }
      );
    }

    // Generate random reference code
    const refCode = `ARG-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRequest = await prisma.designGardenRequest.create({
      data: {
        name,
        phone,
        email: email || null,
        spaceType,
        designStyle: designStyle || "Modern",
        features: Array.isArray(features) ? features : [],
        sitePhotoUrl: sitePhotoUrl || null,
        approxArea: approxArea ? `${approxArea} sq ft` : "Standard",
        budgetRange: budgetRange || "Not Specified",
        status: "NEW",
        userId: userId || null,
        adminNotes: `Submission Reference: ${refCode}`,
      },
    });

    // Also create an automated admin Notification in PostgreSQL
    await prisma.notification.create({
      data: {
        title: `নতুন গার্ডেন ডিজাইন রিকোয়েস্ট: ${name}`,
        message: `${name} (${phone}) ${spaceType} এর জন্য ${designStyle} স্টাইলে প্রজেক্ট রিকোয়েস্ট পাঠিয়েছেন। বাজেট: ${budgetRange}`,
        type: "REQUEST",
        link: "/admin",
      },
    });

    return NextResponse.json({
      success: true,
      referenceCode: refCode,
      request: newRequest,
    });
  } catch (error: any) {
    console.error("Error creating design garden request:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const requests = await prisma.designGardenRequest.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(requests);
  } catch (error: any) {
    console.error("Error fetching design requests:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
