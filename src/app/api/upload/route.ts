import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "green-garden";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueStamp = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uniqueNameWithStamp = `${uniqueStamp}_${safeName}`;

    // Primary: Upload to Cloudinary CDN
    if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
      try {
        const cloudResult = await uploadToCloudinary(buffer, folder, uniqueNameWithStamp);
        return NextResponse.json(
          {
            success: true,
            url: cloudResult.url,
            publicId: cloudResult.public_id,
            fileName: uniqueNameWithStamp,
            provider: "cloudinary",
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              "Pragma": "no-cache",
              "Expires": "0",
            },
          }
        );
      } catch (cloudErr: any) {
        console.warn("Cloudinary upload failed, falling back to local disk:", cloudErr?.message);
      }
    }

    // Fallback: Local disk storage
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    const uniqueFileName = `${Date.now()}-${safeName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json(
      {
        success: true,
        url: publicUrl,
        fileName: uniqueFileName,
        provider: "local",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}

