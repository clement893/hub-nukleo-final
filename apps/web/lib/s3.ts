/**
 * AWS S3 Storage Service
 * Handles file uploads, downloads, and deletions to/from Amazon S3
 */

import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { logger } from "./logger";

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "";

/**
 * Upload a file to S3
 * @param file Buffer or Uint8Array containing the file data
 * @param key S3 object key (path/filename)
 * @param contentType MIME type of the file
 * @param metadata Optional metadata to attach to the object
 * @returns The S3 object key
 */
export async function uploadToS3(
  file: Buffer | Uint8Array,
  key: string,
  contentType: string,
  metadata?: Record<string, string>
): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: file,
      ContentType: contentType,
      Metadata: metadata,
    });

    await s3Client.send(command);
    logger.info("File uploaded to S3", { key, contentType });

    return key;
  } catch (error) {
    logger.error("Error uploading file to S3", error instanceof Error ? error : new Error(String(error)), {
      key,
      contentType,
    });
    throw error;
  }
}

/**
 * Get a presigned URL for downloading a file from S3
 * @param key S3 object key
 * @param expiresIn URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
    }

    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    logger.info("Generated presigned download URL", { key, expiresIn });

    return url;
  } catch (error) {
    logger.error("Error generating presigned download URL", error instanceof Error ? error : new Error(String(error)), {
      key,
    });
    throw error;
  }
}

/**
 * Get a presigned URL for uploading a file to S3
 * @param key S3 object key
 * @param contentType MIME type of the file
 * @param expiresIn URL expiration time in seconds (default: 3600 = 1 hour)
 * @returns Presigned URL
 */
export async function getPresignedUploadUrl(
  key: string,
  contentType: string,
  expiresIn: number = 3600
): Promise<string> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
    }

    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      ContentType: contentType,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn });
    logger.info("Generated presigned upload URL", { key, contentType, expiresIn });

    return url;
  } catch (error) {
    logger.error("Error generating presigned upload URL", error instanceof Error ? error : new Error(String(error)), {
      key,
      contentType,
    });
    throw error;
  }
}

/**
 * Delete a file from S3
 * @param key S3 object key
 */
export async function deleteFromS3(key: string): Promise<void> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    logger.info("File deleted from S3", { key });
  } catch (error) {
    logger.error("Error deleting file from S3", error instanceof Error ? error : new Error(String(error)), { key });
    throw error;
  }
}

/**
 * Check if a file exists in S3
 * @param key S3 object key
 * @returns true if file exists, false otherwise
 */
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    if (!BUCKET_NAME) {
      throw new Error("AWS_S3_BUCKET_NAME environment variable is not set");
    }

    const command = new HeadObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    // If error is 404, file doesn't exist
    if ((error as { $metadata?: { httpStatusCode?: number } })?.$metadata?.httpStatusCode === 404) {
      return false;
    }
    // Re-throw other errors
    logger.error("Error checking file existence in S3", error instanceof Error ? error : new Error(String(error)), {
      key,
    });
    throw error;
  }
}

/**
 * Generate a unique S3 key for a file
 * @param filename Original filename
 * @param prefix Optional prefix (e.g., "uploads", "images")
 * @returns Unique S3 key
 */
export function generateS3Key(filename: string, prefix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  const extension = filename.split(".").pop() || "";
  const baseName = filename.replace(/\.[^/.]+$/, "").replace(/[^a-zA-Z0-9]/g, "-");
  const uniqueFilename = `${baseName}-${timestamp}-${random}.${extension}`;

  if (prefix) {
    return `${prefix}/${uniqueFilename}`;
  }

  return uniqueFilename;
}

