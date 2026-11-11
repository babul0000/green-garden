import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DEFAULT_SHOP_CONFIG, ShopConfig, ShopProduct } from "@/types/cms";
import { getCurrentUser, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";

async function loadShopConfig(): Promise<ShopConfig> {
  const row = await prisma.setting.findUnique({ where: { key: "shop_config" } });
  if (!row || !row.value || typeof row.value !== "object") {
    return DEFAULT_SHOP_CONFIG;
  }
  const stored = row.value as Partial<ShopConfig>;
  return {
    ...DEFAULT_SHOP_CONFIG,
    ...stored,
    categories:
      Array.isArray(stored.categories) && stored.categories.length > 0
        ? stored.categories
        : DEFAULT_SHOP_CONFIG.categories,
    products: Array.isArray(stored.products) ? stored.products : DEFAULT_SHOP_CONFIG.products,
  };
}

async function saveShopConfig(cfg: ShopConfig) {
  await prisma.setting.upsert({
    where: { key: "shop_config" },
    update: { value: cfg as any },
    create: { key: "shop_config", value: cfg as any },
  });
}

// GET /api/shop/products (?id=... or ?all=true)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const wantAll = searchParams.get("all") === "true";

    const cfg = await loadShopConfig();
    let canViewHidden = false;
    if (wantAll) {
      const user = await getCurrentUser(req);
      const role = user?.role?.toUpperCase();
      canViewHidden = role === "ADMIN" || role === "EDITOR" || role === "MODERATOR";
    }

    const products = canViewHidden
      ? cfg.products
      : cfg.products.filter((p) => p.isActive !== false);

    if (id) {
      const product = products.find((p) => p.id === id);
      if (!product) {
        return NextResponse.json({ error: "Product not found" }, { status: 404 });
      }
      return NextResponse.json({ product, config: { ...cfg, products: undefined } });
    }

    return NextResponse.json({
      ...cfg,
      products,
    });
  } catch (err: any) {
    console.error("Shop products GET error:", err);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}

// Admin: Create or update product inside shop_config
export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const body = await req.json();
  const cfg = await loadShopConfig();

  const newProduct: ShopProduct = {
    id:
      body.id ||
      String(body.nameEn || body.nameBn || "plant")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "") +
        "-" +
        Date.now().toString(36),
    nameBn: String(body.nameBn || body.nameEn || "নতুন পণ্য"),
    nameEn: String(body.nameEn || body.nameBn || "New Botanical Item"),
    category: String(body.category || "Indoor Plants"),
    price: Number(body.price) || 0,
    oldPrice: body.oldPrice ? Number(body.oldPrice) : undefined,
    stock: Number(body.stock ?? 10),
    unitBn: String(body.unitBn || "টি"),
    unitEn: String(body.unitEn || "Unit"),
    image: String(body.image || "/hero_plants.png"),
    badgeBn: body.badgeBn || undefined,
    badgeEn: body.badgeEn || undefined,
    rating: body.rating ? Number(body.rating) : 5,
    descriptionBn: String(body.descriptionBn || ""),
    descriptionEn: String(body.descriptionEn || ""),
    careTipsBn: body.careTipsBn || undefined,
    careTipsEn: body.careTipsEn || undefined,
    isFeatured: Boolean(body.isFeatured),
    isActive: body.isActive !== false,
  };

  const exists = cfg.products.some((p) => p.id === newProduct.id);
  const products = exists
    ? cfg.products.map((p) => (p.id === newProduct.id ? newProduct : p))
    : [newProduct, ...cfg.products];

  const updated = { ...cfg, products };
  await saveShopConfig(updated);

  return NextResponse.json({ success: true, product: newProduct, products }, { status: exists ? 200 : 201 });
});

export const PATCH = POST;

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Product id is required", 400);

  const cfg = await loadShopConfig();
  const products = cfg.products.filter((p) => p.id !== id);
  await saveShopConfig({ ...cfg, products });

  return NextResponse.json({ success: true, products });
});

