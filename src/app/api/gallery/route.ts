import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.galleryItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching gallery items:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, imageUrl, beforeImageUrl, category, caption, featured } = body;

    if (!title || !imageUrl) {
      return NextResponse.json(
        { error: "Title and Image URL are required." },
        { status: 400 }
      );
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        title,
        imageUrl,
        beforeImageUrl: beforeImageUrl || null,
        category: category || "All",
        caption: caption || null,
        featured: featured ?? false,
      },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error: any) {
    console.error("Error creating gallery item:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
