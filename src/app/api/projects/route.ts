import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status"); // RUNNING, COMPLETED, PLANNING
    const clientId = searchParams.get("clientId");

    const projects = await prisma.project.findMany({
      where: {
        status: status ? status : undefined,
        clientId: clientId ? clientId : undefined,
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
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      name,
      slug,
      clientId,
      clientName,
      clientPhone,
      category,
      location,
      description,
      progress,
      status,
      budget,
      totalExpense,
      startDate,
      deadline,
      beforeImage,
      afterImage,
      wipImages,
      images,
      materialsUsed,
      notes,
    } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const projectSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`;

    const project = await prisma.project.create({
      data: {
        name,
        slug: projectSlug,
        clientId: clientId || null,
        clientName: clientName || null,
        clientPhone: clientPhone || null,
        category: category || "Residential",
        location: location || "Dhaka",
        description: description || null,
        progress: typeof progress === "number" ? progress : 0,
        status: status || "RUNNING",
        budget: budget ? parseFloat(budget) : null,
        totalExpense: totalExpense ? parseFloat(totalExpense) : 0,
        startDate: startDate ? new Date(startDate) : new Date(),
        deadline: deadline ? new Date(deadline) : null,
        beforeImage: beforeImage || null,
        afterImage: afterImage || null,
        wipImages: Array.isArray(wipImages) ? wipImages : [],
        images: Array.isArray(images) ? images : [],
        materialsUsed: materialsUsed || null,
        notes: notes || null,
      },
    });

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error: any) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, progress, status, totalExpense, beforeImage, afterImage, wipImages, materialsUsed, notes } = body;

    if (!id) {
      return NextResponse.json({ error: "Project ID is required for update." }, { status: 400 });
    }

    const updated = await prisma.project.update({
      where: { id },
      data: {
        progress: typeof progress === "number" ? progress : undefined,
        status: status || undefined,
        totalExpense: typeof totalExpense === "number" ? totalExpense : undefined,
        beforeImage: beforeImage || undefined,
        afterImage: afterImage || undefined,
        wipImages: Array.isArray(wipImages) ? wipImages : undefined,
        materialsUsed: materialsUsed || undefined,
        notes: notes || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      project: updated,
    });
  } catch (error: any) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}
