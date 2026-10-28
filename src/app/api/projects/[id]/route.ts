import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/apiAuth";

const PUBLIC_PROJECT_FIELDS = {
  id: true,
  slug: true,
  name: true,
  titleBn: true,
  clientId: true,
  clientName: true,
  category: true,
  location: true,
  description: true,
  descBn: true,
  progress: true,
  status: true,
  startDate: true,
  deadline: true,
  completionDate: true,
  warrantyMonths: true,
  warrantyExpiryDate: true,
  beforeImage: true,
  afterImage: true,
  wipImages: true,
  images: true,
  featured: true,
  createdAt: true,
  updatedAt: true,
  assignments: {
    include: {
      employee: { select: { id: true, name: true, designation: true, photo: true } },
    },
  },
  plantHealthRecords: true,
  maintenancePlans: true,
  reviews: { where: { status: "Approved" }, select: { id: true, rating: true, name: true, text: true } },
  serviceCard: true,
};

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await getCurrentUser(req);
    const role = user?.role?.toUpperCase();
    const isStaff = role === "ADMIN" || role === "MODERATOR" || role === "EDITOR" || role === "EMPLOYEE";

    if (isStaff) {
      const project = await prisma.project.findFirst({
        where: { OR: [{ id }, { slug: id }] },
        include: {
          assignments: {
            include: {
              employee: { select: { id: true, name: true, designation: true, photo: true } },
            },
          },
          plantHealthRecords: true,
          maintenancePlans: true,
          reviews: true,
          serviceCard: true,
        },
      });

      if (!project) {
        return NextResponse.json({ error: "Project not found" }, { status: 404 });
      }

      return NextResponse.json(project);
    }

    // Public / Client selection (strictly excludes clientPhone, budget, totalExpense, notes, materialsUsed)
    const project = await prisma.project.findFirst({
      where: { OR: [{ id }, { slug: id }] },
      select: PUBLIC_PROJECT_FIELDS,
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
        name: body.name !== undefined ? body.name : undefined,
        titleBn: body.titleBn !== undefined ? (body.titleBn || null) : undefined,
        slug: body.slug !== undefined ? body.slug : undefined,
        clientName: body.clientName !== undefined ? (body.clientName || null) : (body.client !== undefined ? (body.client || null) : undefined),
        clientPhone: body.clientPhone !== undefined ? (body.clientPhone || null) : undefined,
        category: body.category !== undefined ? body.category : undefined,
        location: body.location !== undefined ? (body.location || null) : undefined,
        description: body.description !== undefined ? (body.description || null) : undefined,
        descBn: body.descBn !== undefined ? (body.descBn || null) : undefined,
        progress: typeof body.progress === "number" ? body.progress : undefined,
        status: body.status !== undefined ? body.status : undefined,
        budget: body.budget !== undefined ? (body.budget ? parseFloat(body.budget) : null) : undefined,
        totalExpense: body.totalExpense !== undefined ? (body.totalExpense ? parseFloat(body.totalExpense) : 0) : undefined,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        deadline: body.deadline !== undefined ? (body.deadline ? new Date(body.deadline) : null) : undefined,
        completionDate: body.completionDate !== undefined ? (body.completionDate ? new Date(body.completionDate) : null) : undefined,
        beforeImage: body.beforeImage !== undefined ? (body.beforeImage || null) : undefined,
        afterImage: body.afterImage !== undefined ? (body.afterImage || null) : (body.imageUrl !== undefined ? (body.imageUrl || null) : undefined),
        wipImages: Array.isArray(body.wipImages) ? body.wipImages : undefined,
        images: Array.isArray(body.images) ? body.images : undefined,
        featured: typeof body.featured === "boolean" ? body.featured : undefined,
        materialsUsed: body.materialsUsed !== undefined ? body.materialsUsed : undefined,
        notes: body.notes !== undefined ? (body.notes || null) : undefined,
        warrantyMonths: body.warrantyMonths !== undefined ? (Number(body.warrantyMonths) || null) : undefined,
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
