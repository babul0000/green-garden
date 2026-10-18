import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireModerator, apiError, withAuthErrorHandling } from "@/lib/apiAuth";
import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const PUBLIC_CACHE = {
  "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
};

const PUBLIC_SERVICE_SELECT = {
  id: true,
  slug: true,
  label: true,
  titleBn: true,
  category: true,
  desc: true,
  descBn: true,
  icon: true,
  pricing: true,
  features: true,
  benefits: true,
  process: true,
  faqs: true,
  bannerImage: true,
  order: true,
  createdAt: true,
  updatedAt: true,
};

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    const { isPaginated, page, limit, skip, q } = parsePaginationParams(req);

    if (slug) {
      const service = await prisma.service.findUnique({
        where: { slug },
        select: PUBLIC_SERVICE_SELECT,
      });
      if (!service) return NextResponse.json({ error: "Service not found" }, { status: 404 });
      return NextResponse.json(service, { headers: PUBLIC_CACHE });
    }

    const searchFilter = q
      ? {
          OR: [
            { label: { contains: q, mode: "insensitive" as const } },
            { titleBn: { contains: q, mode: "insensitive" as const } },
            { desc: { contains: q, mode: "insensitive" as const } },
            { descBn: { contains: q, mode: "insensitive" as const } },
            { category: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = {
      category: category || undefined,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.service.count({ where }) : 0;

    const services = await prisma.service.findMany({
      where,
      select: PUBLIC_SERVICE_SELECT,
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      skip: isPaginated ? skip : undefined,
      take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
    });

    return NextResponse.json(
      formatDataResponse(services, total, { isPaginated, page, limit }),
      { headers: PUBLIC_CACHE }
    );
  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === "development";
    const msg = error instanceof Error ? error.message : "Server error";
    return NextResponse.json({ error: isDev ? msg : "Failed to fetch services." }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  const actor = await requireModerator(req);

  const body = await req.json();
  const { label, titleBn, slug, category, desc, descBn, icon, bannerImage, pricing, features, benefits, process, faqs, order } = body;

  if (!label) return apiError("Service label is required.", 400);

  const calculatedSlug = slug || `${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const newService = await prisma.service.create({
    data: {
      label,
      titleBn: titleBn || null,
      slug: calculatedSlug,
      category: category || "Landscape Design",
      desc: desc || null,
      descBn: descBn || null,
      icon: icon || "🌱",
      bannerImage: bannerImage || null,
      pricing: pricing || null,
      features: Array.isArray(features) ? features : [],
      benefits: Array.isArray(benefits) ? benefits : [],
      process: process || null,
      faqs: faqs || null,
      order: typeof order === "number" ? order : 0,
    },
  });

  const { logActivity } = await import("@/lib/activityLog");
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "CREATE",
    entity: "Service",
    entityId: newService.id,
    summary: `নতুন ল্যান্ডস্কেপ সার্ভিস যোগ করা হয়েছে: ${newService.label} (${newService.category})`,
    details: { label: newService.label, category: newService.category, slug: newService.slug },
  });

  return NextResponse.json({ success: true, service: newService }, { status: 201 });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  const actor = await requireModerator(req);

  const body = await req.json();

  // Reorder batch update support: { items: [{ id, order }] }
  if (Array.isArray(body.items)) {
    await Promise.all(
      body.items.map((item: { id: string; order: number }) =>
        prisma.service.update({
          where: { id: item.id },
          data: { order: item.order },
        })
      )
    );
    const { logActivity } = await import("@/lib/activityLog");
    await logActivity({
      userId: actor.id,
      userName: actor.name,
      action: "UPDATE",
      entity: "Service",
      summary: `সার্ভিস ক্রমবিন্যাস (Reorder) হালনাগাদ করা হয়েছে (${body.items.length}টি সার্ভিস)`,
    });
    return NextResponse.json({ success: true, message: "Order updated." }, { headers: NO_CACHE });
  }

  const { id, label, titleBn, slug, category, desc, descBn, icon, bannerImage, pricing, features, benefits, process, faqs, order } = body;

  if (!id) return apiError("Service ID is required.", 400);

  const updated = await prisma.service.update({
    where: { id },
    data: {
      label: label || undefined,
      titleBn: titleBn !== undefined ? titleBn : undefined,
      slug: slug || undefined,
      category: category || undefined,
      desc: desc !== undefined ? desc : undefined,
      descBn: descBn !== undefined ? descBn : undefined,
      icon: icon !== undefined ? icon : undefined,
      bannerImage: bannerImage !== undefined ? bannerImage : undefined,
      pricing: pricing !== undefined ? pricing : undefined,
      features: Array.isArray(features) ? features : undefined,
      benefits: Array.isArray(benefits) ? benefits : undefined,
      process: process !== undefined ? process : undefined,
      faqs: faqs !== undefined ? faqs : undefined,
      order: typeof order === "number" ? order : undefined,
    },
  });

  const { logActivity } = await import("@/lib/activityLog");
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "UPDATE",
    entity: "Service",
    entityId: updated.id,
    summary: `সার্ভিস তথ্য হালনাগাদ করা হয়েছে: ${updated.label}`,
    details: { label: updated.label, category: updated.category },
  });

  return NextResponse.json({ success: true, service: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  const actor = await requireModerator(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Service ID required", 400);

  const existing = await prisma.service.findUnique({
    where: { id },
    select: { id: true, label: true },
  });

  await prisma.service.delete({ where: { id } });

  const { logActivity } = await import("@/lib/activityLog");
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "DELETE",
    entity: "Service",
    entityId: id,
    summary: `সার্ভিস মুছে ফেলা হয়েছে: ${existing?.label || id}`,
    details: { id, label: existing?.label },
  });

  return NextResponse.json({ success: true, message: "Service deleted." }, { headers: NO_CACHE });
});
