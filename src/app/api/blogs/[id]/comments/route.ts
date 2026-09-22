import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, text, userId } = body;

    if (!name || !text) {
      return NextResponse.json(
        { error: "Name and comment text are required." },
        { status: 400 }
      );
    }

    // Check if blog exists by ID or Slug
    let blog = await prisma.blog.findUnique({ where: { id } });
    if (!blog) {
      blog = await prisma.blog.findUnique({ where: { slug: id } });
    }

    if (!blog) {
      return NextResponse.json({ error: "Blog not found." }, { status: 404 });
    }

    const comment = await prisma.comment.create({
      data: {
        blogId: blog.id,
        name,
        text,
        approved: true,
        userId: userId || null,
      },
    });

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Error adding blog comment:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
