import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const PUBLIC_GALLERY_SELECT = {
  id: true,
  title: true,
  imageUrl: true,
  beforeImageUrl: true,
  category: true,
  caption: true,
  featured: true,
  createdAt: true,
};

import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const featured = searchParams.get("featured");
    const beforeAfter = searchParams.get("beforeAfter");

    const { isPaginated, page, limit, skip, q } = parsePaginationParams(req);

    const searchFilter = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { caption: { contains: q, mode: "insensitive" as const } },
            { category: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = {
      category: category || undefined,
      featured: featured === "true" ? true : undefined,
      beforeImageUrl: beforeAfter === "true" ? { not: null } : undefined,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.galleryItem.count({ where }) : 0;

    const items = await prisma.galleryItem.findMany({
      where,
      select: PUBLIC_GALLERY_SELECT,
      orderBy: { createdAt: "desc" },
      skip: isPaginated ? skip : undefined,
      take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
    });

    return NextResponse.json(
      formatDataResponse(items, total, { isPaginated, page, limit }),
      { headers: NO_CACHE }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { title, imageUrl, beforeImageUrl, category, caption, featured } = body;

  if (!title || !imageUrl) {
    return apiError("Title and Image URL are required.", 400);
  }

  const newItem = await prisma.galleryItem.create({
    data: {
      title,
      imageUrl,
      beforeImageUrl: beforeImageUrl || null,
      category: category || "All",
      caption: caption || null,
      featured: Boolean(featured),
    },
  });

  return NextResponse.json({ success: true, item: newItem }, { status: 201, headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { id, title, imageUrl, beforeImageUrl, category, caption, featured } = body;
  if (!id) return apiError("Gallery item ID required", 400);

  const updated = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: title || undefined,
      imageUrl: imageUrl || undefined,
      beforeImageUrl: beforeImageUrl !== undefined ? beforeImageUrl : undefined,
      category: category || undefined,
      caption: caption !== undefined ? caption : undefined,
      featured: featured !== undefined ? Boolean(featured) : undefined,
    },
  });

  return NextResponse.json({ success: true, item: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Gallery item ID required", 400);

  await prisma.galleryItem.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Gallery item deleted." }, { headers: NO_CACHE });
});
