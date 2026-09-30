import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
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
      return NextResponse.json(
        { error: "A valid Project and Plant Name are required." },
        { status: 400 }
      );
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

    return NextResponse.json({
      success: true,
      message: "Plant health record created successfully.",
      record,
    });
  } catch (error: any) {
    console.error("Error creating plant health record:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("projectId");

    const records = await prisma.plantHealthRecord.findMany({
      where: projectId ? { projectId } : undefined,
      include: {
        project: {
          select: { name: true, location: true, clientName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(records);
  } catch (error: any) {
    console.error("Error fetching plant health records:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Record ID is required" }, { status: 400 });
    }

    await prisma.plantHealthRecord.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting plant health record:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 }
    );
  }
}

