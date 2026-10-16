import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateSSLCommerzPayment } from "@/lib/sslcommerz";

export async function POST(req: Request) {
  return handleCallback(req);
}

export async function GET(req: Request) {
  return handleCallback(req);
}

async function handleCallback(req: Request) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  try {
    const url = new URL(req.url);
    const searchParams = url.searchParams;
    let status = searchParams.get("status")?.toLowerCase() || "";
    let tranId = searchParams.get("tran_id") || "";
    let valId = searchParams.get("val_id") || "";
    let invoiceId = searchParams.get("invoice_id") || "";
    let rawAmount = searchParams.get("amount") || "";
    let cardType = "";

    // Parse form-data / body if it was POSTed from SSLCommerz IPN / Redirect
    if (req.method === "POST") {
      try {
        const formData = await req.formData();
        if (formData.get("status")) status = String(formData.get("status")).toLowerCase();
        if (formData.get("tran_id")) tranId = String(formData.get("tran_id"));
        if (formData.get("val_id")) valId = String(formData.get("val_id"));
        if (formData.get("value_a")) invoiceId = String(formData.get("value_a"));
        if (formData.get("amount")) rawAmount = String(formData.get("amount"));
        if (formData.get("card_type")) cardType = String(formData.get("card_type"));
      } catch {
        // body parsing failed or already read
      }
    }

    if (status === "cancel") {
      return NextResponse.redirect(`${appUrl}/client-dashboard?payment=cancelled`, 303);
    }

    if (status === "fail" || status === "failed") {
      return NextResponse.redirect(`${appUrl}/client-dashboard?payment=failed&tran_id=${tranId}`, 303);
    }

    if (status === "success" || status === "valid") {
      // 1. Verify with SSLCommerz server if val_id is present
      if (valId) {
        try {
          const validationResult = await validateSSLCommerzPayment(valId);
          if (!validationResult.isValid) {
            console.warn(`[SSLCommerz] Transaction validation failed for tranId: ${tranId}, valId: ${valId}`);
            return NextResponse.redirect(`${appUrl}/client-dashboard?payment=failed&error=verification_failed`, 303);
          }
          if (validationResult.data?.value_a && !invoiceId) {
            invoiceId = validationResult.data.value_a;
          }
          if (validationResult.data?.amount && !rawAmount) {
            rawAmount = String(validationResult.data.amount);
          }
        } catch (vErr: any) {
          console.warn("SSLCommerz validation check error:", vErr?.message);
        }
      }

      // 2. Update Database: Invoice and Payment Record
      let invoice = null;
      if (invoiceId) {
        invoice = await prisma.invoice.findUnique({
          where: { id: invoiceId },
        });
      }

      // If no invoiceId matched directly, try finding by tranId from recent records
      if (!invoice && tranId) {
        const existingPayment = await prisma.payment.findFirst({
          where: { transactionId: tranId },
          include: { invoice: true },
        });
        if (existingPayment) invoice = existingPayment.invoice;
      }

      const paymentAmount = Number(rawAmount) || (invoice ? invoice.dueAmount || invoice.totalAmount : 0);

      if (invoice) {
        const newPaidAmount = invoice.paidAmount + paymentAmount;
        const newDueAmount = Math.max(0, invoice.totalAmount - newPaidAmount);
        const newStatus = newDueAmount <= 0 ? "PAID" : "PARTIALLY_PAID";

        // Create Payment audit record
        await prisma.payment.create({
          data: {
            invoiceId: invoice.id,
            amount: paymentAmount,
            paymentMethod: cardType ? `SSLCOMMERZ_${cardType}` : "SSLCOMMERZ",
            transactionId: tranId || `TXN-${Date.now()}`,
            receivedBy: "SSLCommerz Gateway",
            notes: `Online digital payment received via SSLCommerz (val_id: ${valId || "N/A"})`,
          },
        });

        // Update Invoice status in Neon PostgreSQL
        await prisma.invoice.update({
          where: { id: invoice.id },
          data: {
            paidAmount: newPaidAmount,
            dueAmount: newDueAmount,
            status: newStatus,
          },
        });
      }

      // 3. Record Admin & User Notification
      try {
        await prisma.notification.create({
          data: {
            title: `✅ SSLCommerz পেমেন্ট সফল: ৳${paymentAmount.toLocaleString()}`,
            message: `ট্রানজ্যাকশন আইডি: ${tranId || "N/A"} ${invoice ? `(ইনভয়েস #${invoice.invoiceNumber})` : ""} এর পেমেন্ট সফলভাবে ডাটাবেজে রেকর্ড করা হয়েছে।`,
            type: "BILLING",
            link: "/admin",
          },
        });
      } catch {
        // non-blocking
      }

      return NextResponse.redirect(
        `${appUrl}/client-dashboard?payment=success&tran_id=${tranId || ""}&invoice_id=${invoice?.id || invoiceId || ""}`,
        303
      );
    }

    // Default fallback
    return NextResponse.redirect(`${appUrl}/client-dashboard?payment=unknown`, 303);
  } catch (error: any) {
    console.error("SSLCommerz callback processing error:", error);
    return NextResponse.redirect(`${appUrl}/client-dashboard?payment=error`, 303);
  }
}
