import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Admin only: view all submitted career applications
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const applications = await prisma.careerApplication.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(applications, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
});

// Public: job candidates submit their applications
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
