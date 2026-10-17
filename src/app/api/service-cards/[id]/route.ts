import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEditor, requireAdmin, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const PUT = withAuthErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireEditor(req);

  const { id } = await params;
  if (!id) return apiError("ID is required", 400);

  const body = await req.json();
  const {
    projectName,
    clientName,
    clientPhone,
    location,
    handoverDate,
    warrantyMonths,
    servicesIncluded,
    plantedFlora,
    maintenanceFrequency,
    nextFollowUpDate,
    leadArchitect,
    doctorHotline,
    status,
    projectId,
  } = body;

  const dataToUpdate: any = {};
  if (projectName !== undefined) dataToUpdate.projectName = projectName;
  if (clientName !== undefined) dataToUpdate.clientName = clientName;
  if (clientPhone !== undefined) dataToUpdate.clientPhone = clientPhone;
  if (location !== undefined) dataToUpdate.location = location;
  if (servicesIncluded !== undefined) dataToUpdate.servicesIncluded = servicesIncluded;
  if (plantedFlora !== undefined) dataToUpdate.plantedFlora = plantedFlora;
  if (maintenanceFrequency !== undefined) dataToUpdate.maintenanceFrequency = maintenanceFrequency;
  if (leadArchitect !== undefined) dataToUpdate.leadArchitect = leadArchitect;
  if (doctorHotline !== undefined) dataToUpdate.doctorHotline = doctorHotline;
  if (status !== undefined) dataToUpdate.status = status;
  if (projectId !== undefined) dataToUpdate.projectId = projectId;

  if (handoverDate) dataToUpdate.handoverDate = new Date(handoverDate);
  if (nextFollowUpDate !== undefined) {
    dataToUpdate.nextFollowUpDate = nextFollowUpDate ? new Date(nextFollowUpDate) : null;
  }

  if (warrantyMonths !== undefined || handoverDate !== undefined) {
    const existing = await prisma.digitalServiceCard.findUnique({ where: { id } });
    if (existing) {
      const hDate = handoverDate ? new Date(handoverDate) : existing.handoverDate;
      const mCount = warrantyMonths !== undefined ? Number(warrantyMonths) : existing.warrantyMonths;
      const expiry = new Date(hDate);
      expiry.setMonth(expiry.getMonth() + mCount);
      dataToUpdate.warrantyMonths = mCount;
      dataToUpdate.warrantyExpiryDate = expiry;
    }
  }

  const updated = await prisma.digitalServiceCard.update({
    where: { id },
    data: dataToUpdate,
  });

  return NextResponse.json({ success: true, card: updated }, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
  await requireAdmin(req);

  const { id } = await params;
  if (!id) return apiError("ID is required", 400);

  await prisma.digitalServiceCard.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Service card deleted." }, { headers: NO_CACHE });
});
