import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const applications = await prisma.careerApplication.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(applications);
  } catch (error: any) {
    console.error("Error fetching careers:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, department, coverLetter, resumeUrl } = body;

    if (!name || !email || !phone || !department || !resumeUrl) {
      return NextResponse.json(
        { error: "Name, email, phone, department, and resume link are required." },
        { status: 400 }
      );
    }

    const application = await prisma.careerApplication.create({
      data: {
        name,
        email,
        phone,
        department,
        coverLetter: coverLetter || null,
        resumeUrl,
        status: "Pending",
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: `💼 নতুন চাকরি আবেদন: ${name}`,
        message: `${name} (${department}) পদের জন্য আবেদন করেছেন। মোবাইল: ${phone}`,
        type: "INFO",
        link: "/admin",
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
