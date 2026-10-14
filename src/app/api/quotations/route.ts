import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, requireModerator, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");
  const projectId = searchParams.get("projectId");

  const quotations = await prisma.quotation.findMany({
    where: {
      userId: userId ? userId : undefined,
      projectId: projectId ? projectId : undefined,
    },
    include: {
      items: true,
      project: { select: { name: true, location: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(quotations, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const body = await req.json();
  const {
    projectId, userId, clientName, clientEmail, clientPhone,
    discount = 0, advance = 0, items, notes,
  } = body;

  if (!clientName || !Array.isArray(items) || items.length === 0) {
    return apiError("Client Name and itemized quotation lines are required.", 400);
  }

  const calculatedItems = items.map((it: {
    category?: string; itemTitle?: string; quantity?: string | number;
    unit?: string; unitPrice?: string | number;
  }) => {
    const qty = parseFloat(String(it.quantity)) || 1;
    const price = parseFloat(String(it.unitPrice)) || 0;
    return {
      category: it.category || "Landscape Design",
      itemTitle: it.itemTitle || "Service item",
      quantity: qty,
      unit: it.unit || "pcs",
      unitPrice: price,
      amount: qty * price,
    };
  });

  const subtotal = calculatedItems.reduce((acc, item) => acc + item.amount, 0);
  const total = Math.max(0, subtotal - (parseFloat(String(discount)) || 0));
  const advanceAmount = parseFloat(String(advance)) || 0;
  const due = Math.max(0, total - advanceAmount);

  // ✅ FIXED: Use DB transaction with timestamp-based unique number
  const result = await prisma.$transaction(async (tx) => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const rand = Math.floor(Math.random() * 999).toString().padStart(3, "0");
    const quotationNumber = `QT-${new Date().getFullYear()}-${timestamp}-${rand}`;

    const quotation = await tx.quotation.create({
      data: {
        quotationNumber,
        projectId: projectId || null,
        userId: userId || null,
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        subtotal,
        discount: parseFloat(String(discount)) || 0,
        total,
        advance: advanceAmount,
        due,
        status: "SENT",
        notes: notes || null,
        items: { create: calculatedItems },
      },
      include: { items: true },
    });

    const invTimestamp = Date.now().toString(36).toUpperCase();
    const invRand = Math.floor(Math.random() * 999).toString().padStart(3, "0");
    const invoiceNumber = `INV-${new Date().getFullYear()}-${invTimestamp}-${invRand}`;

    const invoice = await tx.invoice.create({
      data: {
        invoiceNumber,
        quotationId: quotation.id,
        projectId: projectId || null,
        userId: userId || null,
        clientName,
        clientPhone: clientPhone || null,
        totalAmount: total,
        paidAmount: advanceAmount,
        dueAmount: due,
        status: due === 0 ? "PAID" : advanceAmount > 0 ? "PARTIALLY_PAID" : "DUE",
        notes: `Auto-generated from quotation ${quotationNumber}`,
        payments:
          advanceAmount > 0
            ? {
                create: {
                  amount: advanceAmount,
                  paymentMethod: "BKASH",
                  notes: "Advance payment on quotation",
                },
              }
            : undefined,
      },
    });

    return { quotation, invoice };
  });

  // Trigger WhatsApp Notification (non-blocking)
  if (clientPhone) {
    try {
      const { sendWhatsAppInvoiceAlert } = await import("@/services/whatsapp");
      await sendWhatsAppInvoiceAlert({
        clientName,
        clientPhone,
        invoiceNumber: result.invoice.invoiceNumber,
        amount: total,
        dueAmount: due,
      });
    } catch (waErr: unknown) {
      const msg = waErr instanceof Error ? waErr.message : String(waErr);
      console.warn("Failed to dispatch WhatsApp invoice alert:", msg);
    }
  }

  return NextResponse.json({ success: true, ...result }, { headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const body = await req.json();
  const { id, status, notes } = body;

  if (!id) {
    return apiError("Quotation ID is required", 400);
  }

  const updated = await prisma.quotation.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(notes !== undefined ? { notes } : {}),
    },
    include: { items: true },
  });

  return NextResponse.json({ success: true, quotation: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return apiError("Quotation ID is required", 400);
  }

  await prisma.$transaction([
    prisma.quotationItem.deleteMany({ where: { quotationId: id } }),
    prisma.quotation.delete({ where: { id } }),
  ]);

  return NextResponse.json({ success: true }, { headers: NO_CACHE });
});
