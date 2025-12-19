import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl, getPresignedDownloadUrl } from "@/lib/s3";
import { getCurrentUserId } from "@/lib/auth-helpers";
import { logger } from "@/lib/logger";

/**
 * GET /api/files/[key]/presigned
 * Get a presigned URL for uploading or downloading a file
 * Query params:
 * - type: "upload" | "download" (default: "download")
 * - expiresIn: expiration time in seconds (default: 3600)
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    // Verify authentication
    await getCurrentUserId();

    const { key } = await params;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type") || "download";
    const expiresIn = parseInt(searchParams.get("expiresIn") || "3600", 10);

    if (!key) {
      return NextResponse.json({ error: "File key is required" }, { status: 400 });
    }

    const decodedKey = decodeURIComponent(key);
    let url: string;

    if (type === "upload") {
      const contentType = searchParams.get("contentType") || "application/octet-stream";
      url = await getPresignedUploadUrl(decodedKey, contentType, expiresIn);
    } else {
      url = await getPresignedDownloadUrl(decodedKey, expiresIn);
    }

    return NextResponse.json({
      success: true,
      url,
      expiresIn,
    });
  } catch (error) {
    logger.error("Error generating presigned URL", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}

