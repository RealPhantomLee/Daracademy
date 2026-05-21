import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const IS_STUB = !process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;

const s3Client = IS_STUB
  ? null
  : new S3Client({
      region: "auto",
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || "",
      },
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    });

const BUCKET_NAME = process.env.CLOUDFLARE_R2_BUCKET_NAME || "daracademy";

export interface UploadOptions {
  key: string;
  body: Buffer | Uint8Array | string;
  contentType?: string;
  metadata?: Record<string, string>;
}

export async function uploadToR2(
  options: UploadOptions,
): Promise<{ success: boolean; url?: string; error?: string }> {
  const { key, body, contentType, metadata } = options;

  if (IS_STUB) {
    const stubUrl = `https://r2-stub.daracademy.com/${key}`;
    console.log("[R2 STUB]", { key, contentType, url: stubUrl });
    return { success: true, url: stubUrl };
  }

  if (!s3Client) {
    return {
      success: false,
      error: "R2 storage not configured",
    };
  }

  try {
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: body,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);

    const url = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`;
    return { success: true, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}

export async function getSignedDownloadUrl(
  key: string,
  expirationSeconds: number = 3600,
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (IS_STUB) {
    const stubUrl = `https://r2-stub.daracademy.com/signed/${key}`;
    console.log("[R2 STUB - Signed URL]", {
      key,
      expiresIn: expirationSeconds,
      url: stubUrl,
    });
    return { success: true, url: stubUrl };
  }

  if (!s3Client) {
    return {
      success: false,
      error: "R2 storage not configured",
    };
  }

  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, {
      expiresIn: expirationSeconds,
    });
    return { success: true, url };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}

export async function deleteFromR2(
  key: string,
): Promise<{ success: boolean; error?: string }> {
  if (IS_STUB) {
    console.log("[R2 STUB - Delete]", { key });
    return { success: true };
  }

  if (!s3Client) {
    return {
      success: false,
      error: "R2 storage not configured",
    };
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: message,
    };
  }
}
