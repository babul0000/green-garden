import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const service = await prisma.service.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json(service);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const updateData: any = {};
    if (body.label !== undefined) updateData.label = body.label;
    if (body.slug !== undefined) updateData.slug = body.slug;
    if (body.category !== undefined) updateData.category = body.category;
    if (body.desc !== undefined) updateData.desc = body.desc;
    if (body.icon !== undefined) updateData.icon = body.icon;
    if (body.banner !== undefined || body.bannerImage !== undefined) {
      updateData.bannerImage = body.bannerImage || body.banner;
    }
    if (body.pricing !== undefined) updateData.pricing = body.pricing;
    if (body.features !== undefined && Array.isArray(body.features)) updateData.features = body.features;
    if (body.benefits !== undefined && Array.isArray(body.benefits)) updateData.benefits = body.benefits;

    const updated = await prisma.service.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.service.deleteMany({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });
    return NextResponse.json({ message: "Service deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
