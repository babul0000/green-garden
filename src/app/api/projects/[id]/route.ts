import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        assignments: {
          include: {
            employee: { select: { id: true, name: true, designation: true, photo: true } },
          },
        },
        plantHealthRecords: true,
        maintenancePlans: true,
        reviews: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
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

    const existing = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: { id: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id: existing.id },
      data: {
        name: body.name || undefined,
        slug: body.slug || undefined,
        clientName: body.clientName || body.client || undefined,
        category: body.category || undefined,
        location: body.location || undefined,
        description: body.description || undefined,
        progress: typeof body.progress === "number" ? body.progress : undefined,
        status: body.status || undefined,
        budget: body.budget ? parseFloat(body.budget) : undefined,
        totalExpense: body.totalExpense ? parseFloat(body.totalExpense) : undefined,
        beforeImage: body.beforeImage || undefined,
        afterImage: body.afterImage || body.imageUrl || undefined,
        wipImages: Array.isArray(body.wipImages) ? body.wipImages : undefined,
        images: Array.isArray(body.images) ? body.images : (body.imageUrl ? [body.imageUrl] : undefined),
        featured: typeof body.featured === "boolean" ? body.featured : undefined,
        materialsUsed: body.materialsUsed || undefined,
        notes: body.notes || undefined,
      },
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
    await prisma.project.deleteMany({
      where: {
        OR: [{ id }, { slug: id }],
      },
    });
    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 400 }
    );
  }
}
