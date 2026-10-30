import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, withAuthErrorHandling, apiError, getCurrentUser } from "@/lib/apiAuth";
import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

export const dynamic = "force-dynamic";
export const revalidate = 120;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

const PUBLIC_CACHE = {
  "Cache-Control": "public, max-age=60, s-maxage=300, stale-while-revalidate=600",
};

const PUBLIC_BLOG_SELECT = {
  id: true,
  slug: true,
  title: true,
  titleBn: true,
  author: true,
  coverImage: true,
  category: true,
  content: true,
  descBn: true,
  status: true,
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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const statusParam = searchParams.get("status");

    const user = await getCurrentUser(req);
    const role = user?.role?.toUpperCase();
    const isStaff = role === "ADMIN" || role === "MODERATOR" || role === "EDITOR";

    const { isPaginated, page, limit, skip, q } = parsePaginationParams(req);

    if (slug) {
      if (isStaff) {
        const blog = await prisma.blog.findUnique({
          where: { slug },
          include: {
            comments: {
              orderBy: { createdAt: "desc" },
            },
          },
        });
        if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        return NextResponse.json(blog, { headers: NO_CACHE });
      } else {
        const blog = await prisma.blog.findUnique({
          where: { slug },
          select: PUBLIC_BLOG_SELECT,
        });
        if (!blog || blog.status !== "PUBLISHED") {
          return NextResponse.json({ error: "Blog not found" }, { status: 404 });
        }
        return NextResponse.json(blog, { headers: PUBLIC_CACHE });
      }
    }

    const searchFilter = q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" as const } },
            { titleBn: { contains: q, mode: "insensitive" as const } },
            { author: { contains: q, mode: "insensitive" as const } },
            { category: { contains: q, mode: "insensitive" as const } },
            { content: { contains: q, mode: "insensitive" as const } },
            { descBn: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    // For public visitors, strictly only return PUBLISHED blogs
    // For staff, allow filtering by status or showing all if not specified
    const statusFilter = isStaff
      ? (statusParam === "all" ? undefined : (statusParam || undefined))
      : "PUBLISHED";

    const where = {
      category: category || undefined,
      status: statusFilter,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.blog.count({ where }) : 0;

    if (isStaff) {
      const blogs = await prisma.blog.findMany({
        where,
        include: {
          comments: {
            orderBy: { createdAt: "desc" },
          },
        },
        orderBy: { createdAt: "desc" },
        skip: isPaginated ? skip : undefined,
        take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
      });

      return NextResponse.json(
        formatDataResponse(blogs, total, { isPaginated, page, limit }),
        { headers: isStaff ? NO_CACHE : PUBLIC_CACHE }
      );
    } else {
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
    }
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { title, titleBn, slug, author, coverImage, category, content, descBn, status, readingTime } = body;

  if (!title || !author || !content) {
    return apiError("Title, author, and content are required.", 400);
  }

  const autoSlug = slug || `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const blog = await prisma.blog.create({
    data: {
      title,
      titleBn: titleBn || null,
      slug: autoSlug,
      author,
      coverImage: coverImage || null,
      category: category || "Rooftop Gardening",
      content,
      descBn: descBn || null,
      status: status || "PUBLISHED",
      readingTime: readingTime || "5 mins",
    },
  });

  return NextResponse.json({ success: true, blog }, { status: 201, headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const { id, title, titleBn, slug, author, coverImage, category, content, descBn, status, readingTime, comments } = body;

  if (!id) return apiError("Blog ID is required.", 400);

  const updated = await prisma.blog.update({
    where: { id },
    data: {
      title: title || undefined,
      titleBn: titleBn !== undefined ? titleBn : undefined,
      slug: slug || undefined,
      author: author || undefined,
      coverImage: coverImage !== undefined ? coverImage : undefined,
      category: category || undefined,
      content: content || undefined,
      descBn: descBn !== undefined ? descBn : undefined,
      status: status || undefined,
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
