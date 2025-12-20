import { NextRequest, NextResponse } from "next/server";
import { uploadToS3, generateS3Key } from "@/lib/s3";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

/**
 * POST /api/upload
 * Upload a file to S3
 */
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await getCurrentUserId();

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const prefix = formData.get("prefix") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: "File size exceeds 10MB limit" }, { status: 400 });
    }

    // Generate unique S3 key
    const key = generateS3Key(file.name, prefix || "uploads");

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to S3
    await uploadToS3(buffer, key, file.type, {
      originalName: file.name,
      uploadedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      key,
      url: `/api/files/${key}`, // Proxy URL (you can implement this route)
    });
  } catch (error) {
    logger.error("Error uploading file", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload file" },
      { status: 500 }
    );
  }
}


