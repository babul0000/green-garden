import { NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { uploadToNeonStorage, getNeonStorageClient } from "@/lib/neonStorage";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Maximum allowed file size for public uploads: 5MB
const MAX_PUBLIC_FILE_SIZE = 5 * 1024 * 1024;

// IP Rate Limiter Configuration (20 uploads per 10 minutes per IP)
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_UPLOADS_PER_WINDOW = 20;
const ipRateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isIpRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = ipRateLimitMap.get(ip);

  // Periodic cleanup of expired entries
  if (ipRateLimitMap.size > 2000) {
    for (const [key, val] of ipRateLimitMap.entries()) {
      if (val.resetAt < now) ipRateLimitMap.delete(key);
    }
  }

  if (!entry || entry.resetAt < now) {
    ipRateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_UPLOADS_PER_WINDOW) {
    return true;
  }

  entry.count += 1;
  return false;
}

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "127.0.0.1";
}

/**
 * Verify genuine file type using magic bytes binary inspection.
 * Prevents disguised executable or malicious file uploads.
 */
function verifyMagicBytes(buffer: Buffer, extension: string): { valid: boolean; error?: string } {
  if (buffer.length < 4) {
    return { valid: false, error: "File buffer is corrupted or empty." };
  }

  // 1. JPEG / JPG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    if (!["jpg", "jpeg"].includes(extension)) {
      return { valid: false, error: "File extension does not match genuine JPEG binary signature." };
    }
    return { valid: true };
  }

  // 2. PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4E &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0D &&
    buffer[5] === 0x0A &&
    buffer[6] === 0x1A &&
    buffer[7] === 0x0A
  ) {
    if (extension !== "png") {
      return { valid: false, error: "File extension does not match genuine PNG binary signature." };
    }
    return { valid: true };
  }

  // 3. GIF: 47 49 46 38 (GIF87a or GIF89a)
  if (
    buffer.length >= 6 &&
    buffer[0] === 0x47 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x38 &&
    (buffer[4] === 0x37 || buffer[4] === 0x39) &&
    buffer[5] === 0x61
  ) {
    if (extension !== "gif") {
      return { valid: false, error: "File extension does not match genuine GIF binary signature." };
    }
    return { valid: true };
  }

  // 4. WEBP: RIFF ... WEBP
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    if (extension !== "webp") {
      return { valid: false, error: "File extension does not match genuine WEBP binary signature." };
    }
    return { valid: true };
  }

  // 5. PDF: %PDF- (0x25 0x50 0x44 0x46)
  if (
    buffer.length >= 5 &&
    buffer.subarray(0, 4).toString("ascii") === "%PDF"
  ) {
    if (extension !== "pdf") {
      return { valid: false, error: "File extension does not match genuine PDF binary signature." };
    }
    return { valid: true };
  }

  // 6. SVG: XML text containing <svg and strictly free of executable scripts
  if (extension === "svg") {
    const textSample = buffer.subarray(0, Math.min(buffer.length, 2048)).toString("utf8").toLowerCase();
    const hasSvgTag = textSample.includes("<svg") || (textSample.includes("<?xml") && textSample.includes("<svg"));
    const hasMaliciousPattern =
      textSample.includes("<script") ||
      textSample.includes("javascript:") ||
      textSample.includes("onload=") ||
      textSample.includes("onerror=");

    if (!hasSvgTag) {
      return { valid: false, error: "File does not contain a valid SVG vector definition." };
    }
    if (hasMaliciousPattern) {
      return { valid: false, error: "Security risk: SVG contains forbidden embedded scripts or execution handlers." };
    }
    return { valid: true };
  }

  return { valid: false, error: "Unsupported or invalid file format. Only JPG, PNG, WEBP, GIF, SVG, and PDF are permitted." };
}

export async function POST(req: Request) {
  try {
    // 1. IP Rate Limiting
    const clientIp = getClientIp(req);
    if (isIpRateLimited(clientIp)) {
      return NextResponse.json(
        { error: "Too many upload requests. Please wait a few minutes before trying again." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "green-garden/public";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // 2. File Size Enforcement (Max 5MB for public uploads)
    if (file.size > MAX_PUBLIC_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the 5MB limit. Uploaded size: ${(file.size / (1024 * 1024)).toFixed(2)}MB` },
        { status: 400 }
      );
    }

    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Genuine Magic Bytes Binary Inspection
    const magicCheck = verifyMagicBytes(buffer, extension);
    if (!magicCheck.valid) {
      return NextResponse.json({ error: magicCheck.error }, { status: 400 });
    }

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
        { error: "Storage upload failed. Please contact administrator." },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Public upload error:", error);
    return NextResponse.json(
      { error: error?.message || "File upload failed" },
      { status: 500 }
    );
  }
}
