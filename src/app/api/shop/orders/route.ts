import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SHOP_CONFIG, ShopConfig } from "@/types/cms";
import { getCurrentUser, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";
import { initSSLCommerzPayment } from "@/lib/sslcommerz";

export const dynamic = "force-dynamic";

async function loadShopConfig(): Promise<ShopConfig> {
  const row = await prisma.setting.findUnique({ where: { key: "shop_config" } });
  const stored = (row?.value as Partial<ShopConfig>) || {};
  return {
    ...DEFAULT_SHOP_CONFIG,
    ...stored,
    products: Array.isArray(stored.products) ? stored.products : DEFAULT_SHOP_CONFIG.products,
  };
}

// POST /api/shop/orders — Real DB checkout for Green Store
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser(req);
    const body = await req.json();

    const customerName = String(body.name || "").trim();
    const customerPhone = String(body.phone || "").trim();
    const customerAddress = String(body.address || "").trim();
    const customerEmail = String(body.email || user?.email || "guest@argreengarden.com").trim();
    const paymentMethod = String(body.paymentMethod || "COD").toUpperCase();
    const transactionRef = String(body.transactionRef || "").trim();
    const rawItems: Array<{ id: string; quantity: number }> = Array.isArray(body.items) ? body.items : [];

    if (!customerName || !customerPhone || !customerAddress || rawItems.length === 0) {
      return NextResponse.json(
        { error: "অনুগ্রহ করে নাম, ফোন, ঠিকানা ও অন্তত ১টি পণ্য নির্বাচন করুন।" },
        { status: 400 }
      );
    }

    const cfg = await loadShopConfig();
    const productMap = new Map(cfg.products.map((p) => [p.id, p]));

    const lineItems: Array<{
      id: string;
      nameEn: string;
      nameBn: string;
      price: number;
      quantity: number;
      lineTotal: number;
    }> = [];

    for (const item of rawItems) {
      const prod = productMap.get(item.id);
      const qty = Math.max(1, Math.min(99, Number(item.quantity) || 1));
      if (!prod || prod.isActive === false) {
        return NextResponse.json({ error: `পণ্যটি পাওয়া যায়নি (${item.id})` }, { status: 400 });
      }
      if (prod.stock < qty) {
        return NextResponse.json(
          { error: `দুঃখিত, "${prod.nameBn}" পণ্যের পর্যাপ্ত স্টক নেই (অবশিষ্ট: ${prod.stock})।` },
          { status: 400 }
        );
      }
      lineItems.push({
        id: prod.id,
        nameEn: prod.nameEn,
        nameBn: prod.nameBn,
        price: prod.price,
        quantity: qty,
        lineTotal: prod.price * qty,
      });
    }

    const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);
    const deliveryFee =
      cfg.freeShippingMin > 0 && subtotal >= cfg.freeShippingMin ? 0 : cfg.deliveryCharge;
    const tax = cfg.taxPercent > 0 ? Math.round((subtotal * cfg.taxPercent) / 100) : 0;
    const total = subtotal + deliveryFee + tax;
    const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;

    // Decrement product stock inside shop_config
    const updatedProducts = cfg.products.map((p) => {
      const ordered = lineItems.find((li) => li.id === p.id);
      return ordered ? { ...p, stock: Math.max(0, p.stock - ordered.quantity) } : p;
    });

    await prisma.setting.upsert({
      where: { key: "shop_config" },
      update: { value: { ...cfg, products: updatedProducts } as any },
      create: { key: "shop_config", value: { ...cfg, products: updatedProducts } as any },
    });

    const summaryText = lineItems.map((i) => `${i.nameEn} x${i.quantity}`).join(", ");

    const booking = await prisma.booking.create({
      data: {
        clientName: customerName,
        clientEmail: customerEmail,
        phone: customerPhone,
        address: customerAddress,
        service: "Shop Order",
        budgetRange: `৳${total.toLocaleString()}`,
        status: "Pending",
        paymentStatus: paymentMethod === "BKASH" && transactionRef ? "pending_verification" : "unpaid",
        userId: user?.id || null,
        message: JSON.stringify({
          orderNumber,
          items: lineItems,
          subtotal,
          deliveryFee,
          tax,
          total,
          paymentMethod,
          transactionRef,
          summaryText,
        }),
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber: `SHP-${Date.now().toString().slice(-7)}`,
        userId: user?.id || null,
        clientName: customerName,
        clientPhone: customerPhone,
        totalAmount: total,
        paidAmount: 0,
        dueAmount: total,
        status: "DUE",
        notes: `Green Store Order ${orderNumber} (${paymentMethod}): ${summaryText}`,
      },
    });

    await prisma.notification
      .create({
        data: {
          title: `নতুন শপ অর্ডার: ${orderNumber}`,
          message: `${customerName} (${customerPhone}) — ৳${total} [${summaryText}]`,
          type: "PAYMENT",
          link: "/admin?tab=shop-studio",
        },
      })
      .catch(() => {});

    let gatewayPageURL: string | undefined;
    if (paymentMethod === "SSLCOMMERZ") {
      const ssl = await initSSLCommerzPayment({
        totalAmount: total,
        tranId: orderNumber,
        customerName,
        customerEmail,
        customerPhone,
        customerAddress,
        productName: summaryText.slice(0, 200),
        productCategory: "Botanical Store",
        invoiceId: invoice.id,
        userId: user?.id,
      });
      if (ssl.status === "SUCCESS" && ssl.gatewayPageURL) {
        gatewayPageURL = ssl.gatewayPageURL;
      }
    }

    return NextResponse.json(
      {
        success: true,
        orderNumber,
        bookingId: booking.id,
        invoiceNumber: invoice.invoiceNumber,
        subtotal,
        deliveryFee,
        tax,
        total,
        gatewayPageURL,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Shop order POST error:", err);
    return NextResponse.json({ error: err?.message || "অর্ডার সম্পন্ন করা যায়নি।" }, { status: 500 });
  }
}

// Admin: List all shop orders
export const GET = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const bookings = await prisma.booking.findMany({
    where: { service: "Shop Order" },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  const orders = bookings.map((b) => {
    let meta: any = {};
    try {
      meta = b.message ? JSON.parse(b.message) : {};
    } catch {
      meta = { raw: b.message };
    }
    return {
      id: b.id,
      orderNumber: meta.orderNumber || b.id.slice(-6).toUpperCase(),
      clientName: b.clientName,
      clientEmail: b.clientEmail,
      phone: b.phone,
      address: b.address,
      status: b.status,
      paymentStatus: b.paymentStatus,
      total: meta.total || 0,
      subtotal: meta.subtotal || 0,
      deliveryFee: meta.deliveryFee || 0,
      paymentMethod: meta.paymentMethod || "COD",
      transactionRef: meta.transactionRef || "",
      items: Array.isArray(meta.items) ? meta.items : [],
      createdAt: b.createdAt,
    };
  });

  return NextResponse.json({ orders });
});

// Admin: Update order status / paymentStatus
export const PATCH = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const body = await req.json();
  const { id, status, paymentStatus } = body;
  if (!id) return apiError("Order id required", 400);

  const updated = await prisma.booking.update({
    where: { id },
    data: {
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    },
  });

  return NextResponse.json({ success: true, order: updated });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Order id required", 400);

  await prisma.booking.delete({ where: { id } });
  return NextResponse.json({ success: true });
});

