import { NextResponse } from "next/server";
import { initSSLCommerzPayment } from "@/lib/sslcommerz";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/apiAuth";

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();
    const {
      amount,
      customerName,
      customerPhone,
      customerEmail,
      customerAddress,
      productName,
      invoiceId,
    } = body;

    const parsedAmount = Number(amount);
    if (!parsedAmount || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Valid payment amount is required" },
        { status: 400 }
      );
    }

    const tranId = `GG-TXN-${Date.now()}`;

    // Initialize SSLCommerz session
    const session = await initSSLCommerzPayment({
      totalAmount: parsedAmount,
      tranId,
      customerName: customerName || user?.name || "AR Green Garden Client",
      customerEmail: customerEmail || user?.email || "client@argreengarden.com",
      customerPhone: customerPhone || user?.phone || "01883012641",
      customerAddress: customerAddress || "Dhaka, Bangladesh",
      productName: productName || "Landscape Project Payment",
      invoiceId: invoiceId || undefined,
      userId: user?.id || undefined,
    });

    if (session.status !== "SUCCESS" || !session.gatewayPageURL) {
      return NextResponse.json(
        { error: session.failedReason || "Failed to initialize SSLCommerz payment" },
        { status: 502 }
      );
    }

    // If an invoiceId was provided, record transaction attempt
    if (invoiceId) {
      try {
        await prisma.notification.create({
          data: {
            title: `💳 পেমেন্ট শুরু: ৳${parsedAmount}`,
            message: `${customerName || user?.name || "ক্লায়েন্ট"} (ট্রানজ্যাকশন: ${tranId}) ইনভয়েসের জন্য SSLCommerz পেমেন্ট শুরু করেছেন।`,
            type: "BILLING",
            link: "/admin",
          },
        });
      } catch (e) {
        // ignore notification error
      }
    }

    return NextResponse.json({
      success: true,
      tranId,
      gatewayUrl: session.gatewayPageURL,
    });
  } catch (error: any) {
    console.error("Payment init error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
