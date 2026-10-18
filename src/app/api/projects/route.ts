import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, apiError, withAuthErrorHandling, getCurrentUser } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  "Pragma": "no-cache",
  "Expires": "0",
};

// Strict public field selection (excludes clientPhone, budget, totalExpense, notes, materialsUsed)
const PUBLIC_PROJECT_SELECT = {
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
  reviews: { where: { status: "Approved" }, select: { id: true, rating: true, name: true, text: true } },
};

import { parsePaginationParams, formatDataResponse } from "@/lib/pagination";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const clientId = searchParams.get("clientId");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const slug = searchParams.get("slug");

    const { isPaginated, page, limit, skip, q } = parsePaginationParams(req);

    const user = await getCurrentUser(req);
    const role = user?.role?.toUpperCase();
    const isStaff = role === "ADMIN" || role === "MODERATOR" || role === "EDITOR" || role === "EMPLOYEE";

    if (slug) {
      if (isStaff) {
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
      } else {
        const project = await prisma.project.findUnique({
          where: { slug },
          select: {
            ...PUBLIC_PROJECT_SELECT,
            plantHealthRecords: true,
            maintenancePlans: true,
            serviceCard: true,
          },
        });
        if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
        return NextResponse.json(project, { headers: NO_CACHE });
      }
    }

    const searchFilter = q
      ? {
          OR: [
            { name: { contains: q, mode: "insensitive" as const } },
            { location: { contains: q, mode: "insensitive" as const } },
            { clientName: { contains: q, mode: "insensitive" as const } },
            { description: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {};

    const where = {
      status: status || undefined,
      clientId: clientId || undefined,
      featured: featured === "true" ? true : undefined,
      category: category || undefined,
      ...searchFilter,
    };

    const total = isPaginated ? await prisma.project.count({ where }) : 0;

    if (isStaff) {
      const projects = await prisma.project.findMany({
        where,
        include: {
          assignments: {
            include: {
              employee: { select: { id: true, name: true, designation: true, photo: true } },
            },
          },
          reviews: { where: { status: "Approved" }, select: { id: true, rating: true, name: true, text: true } },
        },
        orderBy: { updatedAt: "desc" },
        skip: isPaginated ? skip : undefined,
        take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
      });

      return NextResponse.json(
        formatDataResponse(projects, total, { isPaginated, page, limit }),
        { headers: NO_CACHE }
      );
    } else {
      const projects = await prisma.project.findMany({
        where,
        select: PUBLIC_PROJECT_SELECT,
        orderBy: { updatedAt: "desc" },
        skip: isPaginated ? skip : undefined,
        take: isPaginated ? limit : (searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : undefined),
      });

      return NextResponse.json(
        formatDataResponse(projects, total, { isPaginated, page, limit }),
        { headers: NO_CACHE }
      );
    }
  } catch (error: any) {
    console.error("Error fetching projects:", error);
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 });
  }
}

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const {
    name, titleBn, slug, clientId, clientName, clientPhone,
    category, location, description, descBn, progress, status,
    budget, totalExpense, startDate, deadline,
    beforeImage, afterImage, wipImages, images,
    materialsUsed, notes, featured, warrantyMonths,
  } = body;

  if (!name) return apiError("Project name is required", 400);

  const projectSlug = slug || `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now()}`;

  const project = await prisma.project.create({
    data: {
      name,
      titleBn: titleBn || null,
      slug: projectSlug,
      clientId: clientId || null,
      clientName: clientName || null,
      clientPhone: clientPhone || null,
      category: category || "Residential",
      location: location || "Dhaka",
      description: description || null,
      descBn: descBn || null,
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

  const { logActivity } = await import("@/lib/activityLog");
  const actor = await requireEditor(req);
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "CREATE",
    entity: "Project",
    entityId: project.id,
    summary: `নতুন ল্যান্ডস্কেপ প্রজেক্ট যুক্ত করা হয়েছে: ${project.name} (${project.category || "General"})`,
    details: { name: project.name, slug: project.slug, category: project.category, budget: project.budget },
  });

  return NextResponse.json({ success: true, project }, { headers: NO_CACHE });
});

export const PUT = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);
  const body = await req.json();
  const {
    id, name, titleBn, slug, clientId, clientName, clientPhone,
    category, location, description, descBn, progress, status,
    budget, totalExpense, startDate, deadline, completionDate,
    beforeImage, afterImage, wipImages, images,
    materialsUsed, notes, featured, warrantyMonths,
  } = body;

  if (!id) return apiError("Project ID is required for update.", 400);

  const updated = await prisma.project.update({
    where: { id },
    data: {
      name: name || undefined,
      titleBn: titleBn !== undefined ? titleBn : undefined,
      slug: slug || undefined,
      clientId: clientId !== undefined ? clientId : undefined,
      clientName: clientName !== undefined ? clientName : undefined,
      clientPhone: clientPhone !== undefined ? clientPhone : undefined,
      category: category || undefined,
      location: location || undefined,
      description: description !== undefined ? description : undefined,
      descBn: descBn !== undefined ? descBn : undefined,
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

  const { logActivity } = await import("@/lib/activityLog");
  const actor = await requireEditor(req);
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "UPDATE",
    entity: "Project",
    entityId: updated.id,
    summary: `প্রজেক্ট আপডেট করা হয়েছে: ${updated.name} (অগ্রগতি: ${updated.progress}%, স্ট্যাটাস: ${updated.status})`,
    details: { name: updated.name, progress: updated.progress, status: updated.status },
  });

  return NextResponse.json({ success: true, project: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  const actor = await requireEditor(req);
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return apiError("Project ID required", 400);

  const existing = await prisma.project.findUnique({
    where: { id },
    select: { id: true, name: true },
  });

  await prisma.project.delete({ where: { id } });

  const { logActivity } = await import("@/lib/activityLog");
  await logActivity({
    userId: actor.id,
    userName: actor.name,
    action: "DELETE",
    entity: "Project",
    entityId: id,
    summary: `প্রজেক্ট মুছে ফেলা হয়েছে: ${existing?.name || id}`,
    details: { id, name: existing?.name },
  });

  return NextResponse.json({ success: true, message: "Project deleted." }, { headers: NO_CACHE });
});
