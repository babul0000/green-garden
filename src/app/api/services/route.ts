import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(services);
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { label, slug, category, desc, longContent, icon, banner, pricing, features } = body;

    if (!label) {
      return NextResponse.json({ error: "Service label is required." }, { status: 400 });
    }

    const calculatedSlug = slug || label.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const newService = await prisma.service.create({
      data: {
        label,
        slug: calculatedSlug,
        category: category || "Landscape Design",
        desc: desc || null,
        icon: icon || null,
        bannerImage: banner || body.bannerImage || null,
        pricing: pricing || null,
        features: Array.isArray(features) ? features : [],
      },
    });

    return NextResponse.json(newService, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
