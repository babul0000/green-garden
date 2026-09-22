import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");

    const items = await prisma.inventoryItem.findMany({
      where: category ? { category } : undefined,
      orderBy: { name: "asc" },
    });

    const enriched = items.map((item) => ({
      ...item,
      isLowStock: item.stockQuantity <= item.minThreshold,
    }));

    const lowStockCount = enriched.filter((i) => i.isLowStock).length;

    return NextResponse.json({
      items: enriched,
      totalItems: items.length,
      lowStockCount,
    });
  } catch (error: any) {
    console.error("Error fetching inventory:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, category, stockQuantity, minThreshold, unit, unitCost, location, supplier } = body;

    if (!name || !category) {
      return NextResponse.json(
        { error: "Item name and category are required." },
        { status: 400 }
      );
    }

    const newItem = await prisma.inventoryItem.create({
      data: {
        name,
        category,
        stockQuantity: parseFloat(stockQuantity) || 0,
        minThreshold: parseFloat(minThreshold) || 10,
        unit: unit || "pcs",
        unitCost: unitCost ? parseFloat(unitCost) : 0,
        location: location || "Main Nursery",
        supplier: supplier || null,
      },
    });

    return NextResponse.json({
      success: true,
      item: newItem,
    });
  } catch (error: any) {
    console.error("Error creating inventory item:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT: Deduct inventory when used on a project & trigger Low Stock Alert
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, deductQuantity, projectId, reason } = body;

    if (!id || !deductQuantity) {
      return NextResponse.json(
        { error: "Item ID and deductQuantity are required." },
        { status: 400 }
      );
    }

    const item = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!item) {
      return NextResponse.json({ error: "Inventory item not found." }, { status: 404 });
    }

    const newStock = Math.max(0, item.stockQuantity - parseFloat(deductQuantity));

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: { stockQuantity: newStock },
    });

    // LOW STOCK ALERT CHECK
    let alertCreated = false;
    if (newStock <= item.minThreshold) {
      alertCreated = true;
      await prisma.notification.create({
        data: {
          title: `⚠️ Low Stock Alert: ${item.name}`,
          message: `${item.name} এর মজুদ কমে ${newStock} ${item.unit} এ নেমে এসেছে (নূন্যতম সীমা: ${item.minThreshold} ${item.unit})। দ্রুত রিস্টক করুন।`,
          type: "STOCK_ALERT",
          link: "/admin",
        },
      });
    }

    return NextResponse.json({
      success: true,
      item: updated,
      newStock,
      isLowStock: newStock <= item.minThreshold,
      lowStockAlertTriggered: alertCreated,
    });
  } catch (error: any) {
    console.error("Error updating inventory:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
