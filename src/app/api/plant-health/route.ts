import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireEmployee, getCurrentUser, apiError, withAuthErrorHandling } from "@/lib/apiAuth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const NO_CACHE = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  Pragma: "no-cache",
  Expires: "0",
};

export const POST = withAuthErrorHandling(async (req: Request) => {
  await requireEmployee(req);

  const body = await req.json();
  const {
    projectId,
    plantName,
    photoUrl,
    plantingDate,
    location,
    diseaseHistory,
    treatment,
    fertilizer,
    pruning,
    nextMaintenanceDate,
    doctorReport,
  } = body;

  let targetProjectId = projectId;
  if (!targetProjectId) {
    const defaultProj = await prisma.project.findFirst();
    if (defaultProj) targetProjectId = defaultProj.id;
  }

  if (!targetProjectId || !plantName) {
    return apiError("A valid Project and Plant Name are required.", 400);
  }

  const record = await prisma.plantHealthRecord.create({
    data: {
      projectId: targetProjectId,
      plantName,
      photoUrl: photoUrl || null,
      plantingDate: plantingDate ? new Date(plantingDate) : null,
      location: location || "Garden Area",
      diseaseHistory: diseaseHistory || null,
      treatment: treatment || null,
      fertilizer: fertilizer || null,
      pruning: pruning || null,
      nextMaintenanceDate: nextMaintenanceDate ? new Date(nextMaintenanceDate) : null,
      doctorReport: doctorReport || null,
    },
  });

  return NextResponse.json(
    {
      success: true,
      message: "Plant health record created successfully.",
      record,
    },
    { status: 201, headers: NO_CACHE }
  );
});

export const GET = withAuthErrorHandling(async (req: Request) => {
  const { searchParams } = new URL(req.url);
  const projectId = searchParams.get("projectId");

  // If no specific projectId is requested, require authenticated user
  if (!projectId) {
    const user = await getCurrentUser(req);
    if (!user) {
      return apiError("Authentication required to list all plant health records", 401);
    }
  }

  const records = await prisma.plantHealthRecord.findMany({
    where: projectId ? { projectId } : undefined,
    include: {
      project: {
        select: { name: true, location: true, clientName: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(records, { headers: NO_CACHE });
});

export const DELETE = withAuthErrorHandling(async (req: Request) => {
  await requireEmployee(req);

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return apiError("Record ID is required", 400);
  }

  await prisma.plantHealthRecord.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, message: "Plant record deleted successfully" }, { headers: NO_CACHE });
});
