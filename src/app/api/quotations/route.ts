import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
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

    return NextResponse.json(quotations);
  } catch (error: any) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      projectId,
      userId,
      clientName,
      clientEmail,
      clientPhone,
      discount = 0,
      advance = 0,
      items, // array of { category, itemTitle, quantity, unit, unitPrice }
      notes,
    } = body;

    if (!clientName || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Client Name and itemized quotation lines are required." },
        { status: 400 }
      );
    }

    const quotationNumber = `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    // Calculate subtotal
    const calculatedItems = items.map((it: any) => {
      const qty = parseFloat(it.quantity) || 1;
      const price = parseFloat(it.unitPrice) || 0;
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
    const total = Math.max(0, subtotal - (parseFloat(discount) || 0));
    const advanceAmount = parseFloat(advance) || 0;
    const due = Math.max(0, total - advanceAmount);

    const quotation = await prisma.quotation.create({
      data: {
        quotationNumber,
        projectId: projectId || null,
        userId: userId || null,
        clientName,
        clientEmail: clientEmail || null,
        clientPhone: clientPhone || null,
        subtotal,
        discount: parseFloat(discount) || 0,
        total,
        advance: advanceAmount,
        due,
        status: "SENT",
        notes: notes || null,
        items: {
          create: calculatedItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Also auto-generate an Invoice if advance was paid or quotation accepted
    const invoiceNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoice = await prisma.invoice.create({
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
        payments: advanceAmount > 0 ? {
          create: {
            amount: advanceAmount,
            paymentMethod: "BKASH",
            notes: "Advance payment on quotation",
          }
        } : undefined,
      },
    });

    return NextResponse.json({
      success: true,
      quotation,
      invoice,
    });
  } catch (error: any) {
    console.error("Error creating quotation:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, status, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Quotation ID is required" }, { status: 400 });
    }

    const updated = await prisma.quotation.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
      include: { items: true },
    });

    return NextResponse.json({ success: true, quotation: updated });
  } catch (error: any) {
    console.error("Error updating quotation:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Quotation ID is required" }, { status: 400 });
    }

    await prisma.quotationItem.deleteMany({ where: { quotationId: id } });
    await prisma.quotation.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting quotation:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

