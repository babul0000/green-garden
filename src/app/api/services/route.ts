import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const slug = searchParams.get("slug");

    if (slug) {
      const service = await prisma.service.findUnique({ where: { slug } });
      if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
      return NextResponse.json(service, { headers: NO_CACHE });
    }

    const services = await prisma.service.findMany({
      where: { category: category || undefined },
      orderBy: { createdAt: "asc" },
      take: limit ? parseInt(limit) : undefined,
    });
    return NextResponse.json(services, { headers: NO_CACHE });
  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === "development";
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: isDev ? msg : "Failed to fetch services." }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const body = await req.json();
  const { label, slug, category, desc, icon, bannerImage, pricing, features, benefits, process, faqs } = body;

  if (!label) return apiError("Service label is required.", 400);

  const calculatedSlug = slug || `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const newService = await prisma.service.create({
    data: {
      label, slug: calculatedSlug, category: category || "Landscape Design",
      desc: desc || null, icon: icon || "🌱", bannerImage: bannerImage || null,
      pricing: pricing || null, features: Array.isArray(features) ? features : [],
      benefits: Array.isArray(benefits) ? benefits : [], process: process || null, faqs: faqs || null,
    },
  });

  return NextResponse.json({ success: true, service: newService }, { status: 201 });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const body = await req.json();
  const { id, label, slug, category, desc, icon, bannerImage, pricing, features, benefits, process, faqs } = body;

  if (!id) return apiError("Service ID is required.", 400);

  const updated = await prisma.service.update({
    where: { id },
    data: {
      label: label || undefined, slug: slug || undefined, category: category || undefined,
      desc: desc !== undefined ? desc : undefined, icon: icon !== undefined ? icon : undefined,
      bannerImage: bannerImage !== undefined ? bannerImage : undefined,
      pricing: pricing !== undefined ? pricing : undefined,
      features: Array.isArray(features) ? features : undefined,
      benefits: Array.isArray(benefits) ? benefits : undefined,
      process: process !== undefined ? process : undefined, faqs: faqs !== undefined ? faqs : undefined,
    },
  });

  return NextResponse.json({ success: true, service: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireModerator(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Service ID required", 400);

  await prisma.service.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Service deleted." }, { headers: NO_CACHE });
});
