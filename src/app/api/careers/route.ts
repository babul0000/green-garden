import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, withAuthErrorHandling } from "@/lib/apiAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

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

// Public: job candidates submit their applications (rate limited)
export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 15 * 60 * 1000, prefix: "careers_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

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

    // Notify Admin (link to careers tab)
    await prisma.notification.create({
      data: {
        title: `💼 নতুন চাকরির আবেদন (CV): ${name}`,
        message: `${name} (${department}) পদের জন্য আবেদন ও সিভি জমা দিয়েছেন। মোবাইল: ${phone}`,
        type: "INFO",
        link: "careers",
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
