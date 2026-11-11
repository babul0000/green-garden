import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";
import { sendConsultationAlert } from "@/lib/email";

export const dynamic = "force-dynamic";

// Public POST /api/contact — stores real ContactMessage + Admin Notification + Email alert
export async function POST(req: Request) {
  try {
    const rateCheck = checkRateLimit(req, {
      limit: 6,
      windowMs: 10 * 60 * 1000,
      prefix: "contact_post",
    });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

    const body = await req.json();
    const name = String(body.name || body.clientName || "").trim();
    const phone = String(body.phone || body.clientPhone || "").trim();
    const email = String(body.email || body.clientEmail || "visitor@argreengarden.com").trim();
    const subject = String(body.subject || body.service || "Studio Consultation").trim();
    const branch = String(body.branch || "").trim();
    const rawMessage = String(body.message || body.notes || "").trim();

    if (!name || !phone) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে নাম এবং মোবাইল নম্বর দিন।" },
        { status: 400 }
      );
    }

    const fullMessage = [
      branch ? `Branch: ${branch}` : "",
      rawMessage || "Callback & consultation requested via Contact Page.",
    ]
      .filter(Boolean)
      .join(" | ");

    const record = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message: fullMessage,
        isRead: false,
      },
    });

    await prisma.notification
      .create({
        data: {
          title: `📩 নতুন যোগাযোগ বার্তা: ${name}`,
          message: `${name} (${phone}) — ${subject}${branch ? ` [${branch}]` : ""}`,
          type: "REQUEST",
          link: "/moderator",
        },
      })
      .catch(() => {});

    // Fire-and-forget email notification
    sendConsultationAlert({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      clientAddress: branch || "Dhaka Studio",
      spaceType: subject,
      notes: fullMessage,
    }).catch(() => {});

    return NextResponse.json(
      { success: true, id: record.id },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Contact POST error:", err);
    return NextResponse.json(
      { error: err?.message || "বার্তা পাঠানো যায়নি।" },
      { status: 500 }
    );
  }
}

