import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      where: { status: "Approved" },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, rating, text, service, location, photoUrl, userId, projectId } = body;

    if (!name || !rating || !text) {
      return NextResponse.json(
        { error: "Name, rating (1-5), and review comment are required." },
        { status: 400 }
      );
    }

    const review = await prisma.review.create({
      data: {
        name,
        rating: parseInt(rating, 10) || 5,
        text,
        service: service || "Landscape Design",
        location: location || "Dhaka",
        photoUrl: photoUrl || null,
        userId: userId || null,
        projectId: projectId || null,
        status: "Approved", // Approved to showcase on website
      },
    });

    // Notify Admin of new review
    await prisma.notification.create({
      data: {
        title: `⭐ নতুন কাস্টমার রিভিউ: ${name} (${rating} Star)`,
        message: `গ্রাহক ${name} একটি ${rating}-স্টার রিভিউ সাবমিট করেছেন: "${text.slice(0, 80)}..."`,
        type: "PROJECT",
        link: "/admin",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted successfully!",
      review,
    });
  } catch (error: any) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
