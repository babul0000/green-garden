import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const GET = withAuthErrorHandling(async (req: Request) => {
  // Requires moderator or admin
  await requireModerator(req);

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const status = searchParams.get("status");

  const invoices = await prisma.invoice.findMany({
    where: {
      userId: userId ? userId : undefined,
      status: status ? status : undefined,
    },
    include: {
      payments: { orderBy: { paymentDate: "desc" } },
      quotation: { include: { items: true } },
      project: { select: { name: true, location: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invoices, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  // Only admin can record payments
  await requireAdmin(req);

  const body = await req.json();
  const { invoiceId, amount, paymentMethod, transactionId, receivedBy, notes } = body;

  if (!invoiceId || !amount) {
    return apiError("Invoice ID and payment amount are required.", 400);
  }

  const payAmount = parseFloat(amount);
  if (isNaN(payAmount) || payAmount <= 0) {
    return apiError("Payment amount must be a positive number.", 400);
  }

  const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } });
  if (!invoice) {
    return apiError("Invoice not found", 404);
  }

  // Record payment
  const payment = await prisma.payment.create({
    data: {
      invoiceId,
      amount: payAmount,
      paymentMethod: paymentMethod || "BKASH",
      transactionId: transactionId || null,
      receivedBy: receivedBy || null,
      notes: notes || null,
    },
  });

  const newPaidAmount = invoice.paidAmount + payAmount;
  const newDueAmount = Math.max(0, invoice.totalAmount - newPaidAmount);
  const newStatus = newDueAmount === 0 ? "PAID" : "PARTIALLY_PAID";

  const updatedInvoice = await prisma.invoice.update({
    where: { id: invoiceId },
    data: { paidAmount: newPaidAmount, dueAmount: newDueAmount, status: newStatus },
    include: { payments: true },
  });

  return NextResponse.json(
    { success: true, message: "Payment recorded successfully", payment, invoice: updatedInvoice },
    { headers: NO_CACHE }
  );
});
