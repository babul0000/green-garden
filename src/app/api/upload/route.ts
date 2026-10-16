import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { uploadToNeonStorage, getNeonStorageClient } from "@/lib/neonStorage";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
  "application/pdf",
]);
const ALLOWED_EXTENSIONS = new Set(["jpg", "jpeg", "png", "webp", "gif", "svg", "pdf"]);

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "green-garden";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 1. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 10MB limit. Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    // 2. Validate MIME Type and Extension
    const fileType = file.type?.toLowerCase() || "";
    const extension = file.name.split(".").pop()?.toLowerCase() || "";

    if (!ALLOWED_MIME_TYPES.has(fileType) && !ALLOWED_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { error: "Invalid file type. Only images (JPG, PNG, WEBP, GIF, SVG) and PDF documents are permitted." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueStamp = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uniqueNameWithStamp = `${uniqueStamp}_${safeName}`;

    // 3. Neon Object Storage (if configured)
    if (getNeonStorageClient()) {
      try {
        const objectKey = `${folder}/${uniqueNameWithStamp}`;
        const neonResult = await uploadToNeonStorage(buffer, objectKey, file.type || "application/octet-stream");
        return NextResponse.json(
          {
            success: true,
            url: neonResult.url,
            key: neonResult.key,
            fileName: uniqueNameWithStamp,
            provider: "neon-object-storage",
          },
          {
            headers: {
              "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
      } catch (neonErr: any) {
        console.warn("Neon storage upload error, falling back:", neonErr?.message);
      }
    }

    // 4. Fallback: Upload to Cloudinary CDN
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
              Pragma: "no-cache",
              Expires: "0",
            },
          }
        );
      } catch (cloudErr: any) {
        console.warn("Cloudinary upload failed, falling back to local disk:", cloudErr?.message);
      }
    }

    // 5. Fallback: Local disk storage
    try {
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
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
    } catch (diskErr: any) {
      console.error("Local disk upload failed:", diskErr?.message);
      return NextResponse.json(
        { error: "Cloud and storage upload failed. Please verify storage configuration." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
