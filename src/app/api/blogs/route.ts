import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        comments: {
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, slug, author, coverImage, category, content, readingTime } = body;

    if (!title || !slug || !author || !content) {
      return NextResponse.json(
        { error: "Title, slug, author, and content are required." },
        { status: 400 }
      );
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        slug: slug.toLowerCase().replace(/\s+/g, "-"),
        author,
        coverImage: coverImage || null,
        category: category || "Rooftop Gardening",
        content,
        readingTime: readingTime || "5 mins",
      },
    });

    return NextResponse.json(blog, { status: 201 });
  } catch (error: any) {
    console.error("Error creating blog:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
