import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, author, coverImage, category, content, readingTime } = body;

    if (!title || !author || !content) {
      return NextResponse.json({ error: "Title, author, and content are required." }, { status: 400 });
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
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, title, slug, author, coverImage, category, content, readingTime } = body;

    if (!id) return NextResponse.json({ error: "Blog ID is required." }, { status: 400 });

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
      },
    });

    return NextResponse.json({ success: true, blog: updated }, { headers: NO_CACHE });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Blog ID required" }, { status: 400 });

    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Blog deleted." }, { headers: NO_CACHE });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}
