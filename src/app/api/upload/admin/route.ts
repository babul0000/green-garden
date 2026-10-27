import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { uploadToNeonStorage, getNeonStorageClient } from "@/lib/neonStorage";
import { requireEditor } from "@/lib/apiAuth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Maximum allowed file size for administrative uploads: 100MB (allows high-res videos & media)
const MAX_ADMIN_FILE_SIZE = 100 * 1024 * 1024;

const ALLOWED_ADMIN_EXTENSIONS = new Set([
  // Images (standard web, raw camera, and browser interchange formats like JFIF)
  "jpg", "jpeg", "jfif", "pjpeg", "pjp", "png", "webp", "gif", "svg", "avif", "heic", "heif", "bmp", "ico", "tiff", "tif",
  // Documents
  "pdf",
  // Videos
  "mp4", "webm", "mov", "avi", "mkv", "ogg", "m4v"
]);

export async function POST(req: Request) {
  try {
    // 1. RBAC Guard: Strictly requires EDITOR, MODERATOR, or ADMIN role
    try {
      await requireEditor(req);
    } catch (authErr: any) {
      const status = authErr?.status || 403;
      return NextResponse.json(
        { error: authErr?.message || "Forbidden: Editor, Moderator, or Admin privileges required." },
        { status }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "green-garden/admin";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. Validate File Size (100MB limit for admin media & videos)
    if (file.size > MAX_ADMIN_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 100MB administrative limit. Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    // 3. Validate Extension
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    if (!ALLOWED_ADMIN_EXTENSIONS.has(extension)) {
      return NextResponse.json(
        { error: `File format '.${extension}' is not permitted. Permitted formats: images (JPG, JPEG, JFIF, PNG, WEBP, AVIF, GIF, SVG, BMP, HEIC), PDF, and videos (MP4, WEBM, MOV, OGG).` },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueStamp = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const uniqueNameWithStamp = `${uniqueStamp}_${safeName}`;

    // 4. Upload to Neon Object Storage (if configured)
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
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          }
        );
      } catch (neonErr: any) {
        console.warn("Neon storage upload error, falling back:", neonErr?.message);
      }
    }

    // 5. Upload to Cloudinary CDN
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
              "Cache-Control": "no-store, no-cache, must-revalidate",
            },
          }
        );
      } catch (cloudErr: any) {
        console.warn("Cloudinary upload failed, falling back to local disk:", cloudErr?.message);
      }
    }

    // 6. Local disk storage fallback
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
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    } catch (diskErr: any) {
      console.error("Local disk upload failed:", diskErr?.message);
      return NextResponse.json(
        { error: "Administrative storage upload failed." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Admin upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
