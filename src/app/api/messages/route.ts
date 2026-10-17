import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, apiError, withAuthErrorHandling } from "@/lib/apiAuth";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);
  const messages = await prisma.contactMessage.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(messages, {
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
});

export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 10 * 60 * 1000, prefix: "messages_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    const effectiveEmail = email || (phone ? `${phone.replace(/[^0-9]/g, "")}@client.greengarden` : "anonymous@client.greengarden");

    if (!name || (!email && !phone) || !message) {
      return NextResponse.json(
        { error: "Name, contact information (phone or email), and message are required." },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email: effectiveEmail,
        phone: phone || null,
        subject: subject || "General Inquiry",
        message,
      },
    });

    // Notify Admin in DB (link to messages tab)
    await prisma.notification.create({
      data: {
        title: `📩 নতুন কন্টাক্ট মেসেজ: ${name}`,
        message: `${name} (${phone || effectiveEmail}) একটি বার্তা পাঠিয়েছেন: "${message.slice(0, 80)}..."`,
        type: "INFO",
        link: "messages",
      },
    });

    // Send Real-time Email Alert via Gmail SMTP
    try {
      const { sendContactMessageAlert } = await import("@/lib/email");
      await sendContactMessageAlert({
        name,
        email: effectiveEmail,
        phone,
        message,
      });
    } catch (mailErr: any) {
      console.warn("Failed to dispatch email alert for contact message:", mailErr?.message);
    }

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
