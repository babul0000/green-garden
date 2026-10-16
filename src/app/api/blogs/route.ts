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

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");

    if (slug) {
      const blog = await prisma.blog.findUnique({
        where: { slug },
        include: { comments: { where: { approved: true }, orderBy: { createdAt: "desc" } } },
      });
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog, { headers: NO_CACHE });
    }

    const blogs = await prisma.blog.findMany({
      where: { category: category || undefined },
      include: { comments: { where: { approved: true } } },
      orderBy: { createdAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(blogs, { headers: NO_CACHE });
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
