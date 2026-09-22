import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(messages);
  } catch (error: any) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const newMessage = await prisma.contactMessage.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || "General Inquiry",
        message,
      },
    });

    // Notify Admin
    await prisma.notification.create({
      data: {
        title: `📩 নতুন কন্টাক্ট মেসেজ: ${name}`,
        message: `${name} (${email}) একটি বার্তা পাঠিয়েছেন: "${message.slice(0, 80)}..."`,
        type: "REQUEST",
        link: "/admin",
      },
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error: any) {
    console.error("Error sending message:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
