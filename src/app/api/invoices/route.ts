import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
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
        quotation: {
          include: { items: true },
        },
        project: { select: { name: true, location: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(invoices);
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { invoiceId, amount, paymentMethod, transactionId, receivedBy, notes } = body;

    if (!invoiceId || !amount) {
      return NextResponse.json(
        { error: "Invoice ID and payment amount are required." },
        { status: 400 }
      );
    }

    const payAmount = parseFloat(amount);

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
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

    // Recalculate invoice
    const newPaidAmount = invoice.paidAmount + payAmount;
    const newDueAmount = Math.max(0, invoice.totalAmount - newPaidAmount);
    const newStatus = newDueAmount === 0 ? "PAID" : "PARTIALLY_PAID";

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        dueAmount: newDueAmount,
        status: newStatus,
      },
      include: {
        payments: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Payment recorded successfully",
      payment,
      invoice: updatedInvoice,
    });
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
