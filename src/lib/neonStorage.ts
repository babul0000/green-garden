import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const NEON_STORAGE_BUCKET = process.env.NEON_STORAGE_BUCKET || "assets";

/**
 * Returns a configured S3 client for Neon Object Storage using injected AWS_* variables.
 * Neon Object Storage requires path-style addressing (forcePathStyle: true).
 */
export function getNeonStorageClient(): S3Client | null {
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.AWS_ENDPOINT_URL_S3;
  const region = process.env.AWS_REGION || "ap-southeast-1";

  if (!accessKeyId || !secretAccessKey || !endpoint) {
    return null;
  }

  return new S3Client({
    forcePathStyle: true,
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Uploads an object buffer to Neon Object Storage.
 */
export async function uploadToNeonStorage(
  buffer: Buffer | Uint8Array,
  key: string,
  contentType: string = "application/octet-stream"
): Promise<{ success: boolean; url: string; key: string }> {
  const client = getNeonStorageClient();
  if (!client) {
    throw new Error("Neon Object Storage environment variables not configured.");
  }

  const putCmd = new PutObjectCommand({
    Bucket: NEON_STORAGE_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(putCmd);

  // Generate signed GET URL (valid for 7 days)
  const getCmd = new GetObjectCommand({
    Bucket: NEON_STORAGE_BUCKET,
    Key: key,
  });

  const url = await getSignedUrl(client, getCmd, { expiresIn: 604800 });
  return { success: true, url, key };
}

/**
 * Deletes an object from Neon Object Storage.
 */
export async function deleteFromNeonStorage(key: string): Promise<boolean> {
  const client = getNeonStorageClient();
  if (!client) return false;

  const deleteCmd = new DeleteObjectCommand({
    Bucket: NEON_STORAGE_BUCKET,
    Key: key,
  });

  await client.send(deleteCmd);
  return true;
}
