import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkRateLimit, rateLimitResponse } from "@/lib/rateLimit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const rateCheck = checkRateLimit(req, { limit: 5, windowMs: 5 * 60 * 1000, prefix: "blog_comments_post" });
    if (!rateCheck.allowed) {
      return rateLimitResponse(rateCheck.resetAt);
    }

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

    // Notify Admin (link to blogs tab)
    await prisma.notification.create({
      data: {
        title: `💬 ব্লগে নতুন মন্তব্য: ${blog.title.slice(0, 30)}`,
        message: `${name} মন্তব্য করেছেন: "${text.slice(0, 60)}..."`,
        type: "INFO",
        link: "blogs",
      },
    });

    // Notify Client if logged in
    if (userId) {
      await prisma.notification.create({
        data: {
          userId,
          title: "ব্লগে আপনার মন্তব্য জমা হয়েছে",
          message: `'${blog.title}' আর্টিকেলে আপনার মন্তব্য গৃহীত হয়েছে।`,
          type: "INFO",
          link: "blogs",
        },
      });
    }

    return NextResponse.json(comment, { status: 201 });
  } catch (error: any) {
    console.error("Error adding blog comment:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
