import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, withAuthErrorHandling, apiError } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const PUBLIC_BLOG_SELECT = {
  id: true,
  slug: true,
  title: true,
  author: true,
  coverImage: true,
  category: true,
  content: true,
  readingTime: true,
  createdAt: true,
  updatedAt: true,
  comments: {
    where: { approved: true },
    select: {
      id: true,
      name: true,
      text: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" as const },
  },
};

import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");

    const { isPaginated, page, limit, skip, q } = parsePaginationParams(req);

    if (slug) {
      const blog = await prisma.blog.findUnique({
        where: { slug },
        select: PUBLIC_BLOG_SELECT,
      });
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog, { headers: NO_CACHE });
    }

    const searchFilter = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { author: { contains: q, mode: "insensitive" as const } },
            { category: { contains: q, mode: "insensitive" as const } },
            { content: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = {
      category: category || undefined,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.blog.count({ where }) : 0;

    const blogs = await prisma.blog.findMany({
      where,
      select: PUBLIC_BLOG_SELECT,
      orderBy: { createdAt: "desc" },
      skip: isPaginated ? skip : undefined,
      take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
    });

    return NextResponse.json(
      formatDataResponse(blogs, total, { isPaginated, page, limit }),
      { headers: NO_CACHE }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { title, slug, author, coverImage, category, content, readingTime } = body;

  if (!title || !author || !content) {
    return apiError("Title, author, and content are required.", 400);
  }

  const autoSlug = slug || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const blog = await prisma.blog.create({
    data: {
      title,
      slug: autoSlug,
      author,
      coverImage: coverImage || null,
      category: category || "Rooftop Gardening",
      content,
      readingTime: readingTime || "5 mins",
    },
  });

  return NextResponse.json({ success: true, blog }, { status: 201, headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { id, title, slug, author, coverImage, category, content, readingTime, comments } = body;

  if (!id) return apiError("Blog ID is required.", 400);

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      title: title || undefined,
      slug: slug || undefined,
      author: author || undefined,
      coverImage: coverImage !== undefined ? coverImage : undefined,
      category: category || undefined,
      content: content || undefined,
      readingTime: readingTime || undefined,
      comments: comments !== undefined ? comments : undefined,
    },
  });

  return NextResponse.json({ success: true, blog: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Blog ID required", 400);

  await prisma.blog.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Blog deleted." }, { headers: NO_CACHE });
});
