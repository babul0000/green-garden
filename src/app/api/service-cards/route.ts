import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdminPortalAccess, getCurrentUser, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const GET = withAuthErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const projectCode = searchParams.get("projectCode");
  const projectId = searchParams.get("projectId");

  const user = await getCurrentUser(req);
  const role = user?.role?.toUpperCase();
  const isStaff = role === "ADMIN" || role === "MODERATOR" || role === "EDITOR" || role === "EMPLOYEE";

  // Public or targeted lookup by projectCode
  if (projectCode) {
    if (isStaff) {
      const card = await prisma.digitalServiceCard.findUnique({
        where: { projectCode },
        include: {
          project: {
            select: { id: true, name: true, slug: true, afterImage: true },
          },
        },
      });
      if (!card) return NextResponse.json({ error: "Service card not found" }, { status: 404 });
      return NextResponse.json(card, { headers: NO_CACHE });
    } else {
      // Public view strictly excludes clientPhone and internal fields
      const card = await prisma.digitalServiceCard.findUnique({
        where: { projectCode },
        select: {
          id: true,
          projectCode: true,
          projectName: true,
          clientName: true,
          location: true,
          handoverDate: true,
          warrantyMonths: true,
          warrantyExpiryDate: true,
          servicesIncluded: true,
          plantedFlora: true,
          maintenanceFrequency: true,
          nextFollowUpDate: true,
          leadArchitect: true,
          doctorHotline: true,
          status: true,
          createdAt: true,
          project: {
            select: { id: true, name: true, slug: true, afterImage: true },
          },
        },
      });
      if (!card) return NextResponse.json({ error: "Service card not found" }, { status: 404 });
      return NextResponse.json(card, { headers: NO_CACHE });
    }
  }

  // Lookup by linked projectId
  if (projectId) {
    const card = await prisma.digitalServiceCard.findUnique({
      where: { projectId },
      include: {
        project: { select: { id: true, name: true, slug: true } },
      },
    });
    return NextResponse.json(card || null, { headers: NO_CACHE });
  }

  // Admin listing requires staff portal access
  await requireAdminPortalAccess(req);

  const cards = await prisma.digitalServiceCard.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: { id: true, name: true, slug: true },
      },
    },
  });

  return NextResponse.json(cards, { headers: NO_CACHE });
});

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEditor(req);

  const body = await req.json();
  const {
    projectCode,
    projectName,
    clientName,
    clientPhone,
    location,
    handoverDate,
    warrantyMonths = 12,
    servicesIncluded = [],
    plantedFlora = [],
    maintenanceFrequency = "Weekly",
    nextFollowUpDate,
    leadArchitect = "Ar. Tanvir Chowdhury",
    doctorHotline = "01883012641",
    status = "ACTIVE",
    projectId,
  } = body;

  if (!projectName || !clientName || !clientPhone) {
    return apiError("Project Name, Client Name, and Client Phone are required.", 400);
  }

  // Calculate expiry date
  const handover = handoverDate ? new Date(handoverDate) : new Date();
  const months = Number(warrantyMonths) || 12;
  const expiry = new Date(handover);
  expiry.setMonth(expiry.getMonth() + months);

  const generatedCode =
    projectCode?.trim() ||
    `ARG-${new Date().getFullYear()}-C${Math.floor(100 + Math.random() * 900)}`;

  const card = await prisma.digitalServiceCard.create({
    data: {
      projectCode: generatedCode,
      projectName: projectName.trim(),
      clientName: clientName.trim(),
      clientPhone: clientPhone.trim(),
      location: location?.trim() || "Dhaka, Bangladesh",
      handoverDate: handover,
      warrantyMonths: months,
      warrantyExpiryDate: expiry,
      servicesIncluded: Array.isArray(servicesIncluded) ? servicesIncluded : [],
      plantedFlora: Array.isArray(plantedFlora) ? plantedFlora : [],
      maintenanceFrequency: maintenanceFrequency || "Weekly",
      nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
      leadArchitect: leadArchitect || "Ar. Tanvir Chowdhury",
      doctorHotline: doctorHotline || "01883012641",
      status: status || "ACTIVE",
      projectId: projectId || null,
    },
  });

  return NextResponse.json({ success: true, card }, { status: 201, headers: NO_CACHE });
});
