import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

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
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const limit = searchParams.get("limit");
    const slug = searchParams.get("slug");

    if (slug) {
      const project = await prisma.project.findUnique({
        where: { slug },
        include: {
          assignments: { include: { employee: { select: { id: true, name: true, designation: true, photo: true } } } },
          plantHealthRecords: true,
          maintenancePlans: true,
          reviews: { where: { status: "Approved" } },
          serviceCard: true,
        },
      });
      if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
      return NextResponse.json(project, { headers: NO_CACHE });
    }

    const projects = await prisma.project.findMany({
      where: {
        status: status || undefined,
        clientId: clientId || undefined,
        featured: featured === "true" ? true : undefined,
        category: category || undefined,
      },
      include: {
        assignments: {
          include: {
            employee: { select: { id: true, name: true, designation: true, photo: true } },
          },
        },
        reviews: { where: { status: "Approved" }, select: { id: true, rating: true, name: true, text: true } },
      },
      orderBy: { updatedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(projects, { headers: NO_CACHE });
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const body = await req.json();
  const {
    name, slug, clientId, clientName, clientPhone,
    category, location, description, progress, status,
    budget, totalExpense, startDate, deadline,
    beforeImage, afterImage, wipImages, images,
    materialsUsed, notes, featured, warrantyMonths,
  } = body;

  if (!name) return apiError("Project name is required", 400);

  const projectSlug = slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

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
      featured: Boolean(featured),
      warrantyMonths: warrantyMonths || 12,
    },
  });

  return NextResponse.json({ success: true, project }, { headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const body = await req.json();
  const {
    id, name, slug, clientId, clientName, clientPhone,
    category, location, description, progress, status,
    budget, totalExpense, startDate, deadline, completionDate,
    beforeImage, afterImage, wipImages, images,
    materialsUsed, notes, featured, warrantyMonths,
  } = body;

  if (!id) return apiError("Project ID is required for update.", 400);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: name || undefined,
      slug: slug || undefined,
      clientId: clientId !== undefined ? clientId : undefined,
      clientName: clientName !== undefined ? clientName : undefined,
      clientPhone: clientPhone !== undefined ? clientPhone : undefined,
      category: category || undefined,
      location: location || undefined,
      description: description !== undefined ? description : undefined,
      progress: typeof progress === "number" ? progress : undefined,
      status: status || undefined,
      budget: budget !== undefined ? parseFloat(budget) : undefined,
      totalExpense: totalExpense !== undefined ? parseFloat(totalExpense) : undefined,
      startDate: startDate ? new Date(startDate) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      completionDate: completionDate ? new Date(completionDate) : undefined,
      beforeImage: beforeImage !== undefined ? beforeImage : undefined,
      afterImage: afterImage !== undefined ? afterImage : undefined,
      wipImages: Array.isArray(wipImages) ? wipImages : undefined,
      images: Array.isArray(images) ? images : undefined,
      materialsUsed: materialsUsed !== undefined ? materialsUsed : undefined,
      notes: notes !== undefined ? notes : undefined,
      featured: featured !== undefined ? Boolean(featured) : undefined,
      warrantyMonths: warrantyMonths || undefined,
    },
  });

  return NextResponse.json({ success: true, project: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireAdmin(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Project ID required", 400);

  await prisma.project.delete({ where: { id } });
  return NextResponse.json({ success: true, message: "Project deleted." }, { headers: NO_CACHE });
});
