import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  return handleCallback(req);
}

export async function GET(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let status = searchParams.get("status");
    let tranId = searchParams.get("tran_id");

    // Also check form-data / body if it was POSTed
    try {
      if (req.method === "POST") {
        const formData = await req.formData();
        if (formData.get("status")) status = (formData.get("status") as string).toLowerCase();
        if (formData.get("tran_id")) tranId = formData.get("tran_id") as string;
      }
    } catch {
      // ignore
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    if (status === "success" || status === "valid") {
      // Record payment notification
      try {
        await prisma.notification.create({
          data: {
            title: `✅ SSLCommerz পেমেন্ট সফল!`,
            message: `ট্রানজ্যাকশন আইডি: ${tranId || "N/A"} এর পেমেন্ট সফলভাবে সম্পন্ন হয়েছে।`,
            type: "BILLING",
            link: "/admin",
          },
        });
      } catch (e) {
        // ignore
      }

      return NextResponse.redirect(
        `${appUrl}/client-dashboard?payment=success&tran_id=${tranId || ""}`,
        303
      );
    } else if (status === "cancel") {
      return NextResponse.redirect(
        `${appUrl}/client-dashboard?payment=cancelled`,
        303
      );
    } else {
      return NextResponse.redirect(
        `${appUrl}/client-dashboard?payment=failed&tran_id=${tranId || ""}`,
        303
      );
    }
  } catch (error: any) {
    console.error("SSLCommerz callback error:", error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    return NextResponse.redirect(`${appUrl}/client-dashboard?payment=error`, 303);
  }
}
