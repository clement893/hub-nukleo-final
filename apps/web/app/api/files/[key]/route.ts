import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl, fileExistsInS3 } from "@/lib/s3";
import { logger } from "@/lib/logger";

/**
 * GET /api/files/[key]
 * Get a presigned URL for downloading a file from S3
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params;

    if (!key) {
      return NextResponse.json({ error: "File key is required" }, { status: 400 });
    }

    // Decode the key (it might be URL encoded)
    const decodedKey = decodeURIComponent(key);

    // Check if file exists
    const exists = await fileExistsInS3(decodedKey);
    if (!exists) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Generate presigned URL (valid for 1 hour)
    const url = await getPresignedDownloadUrl(decodedKey, 3600);

    // Return JSON with URL for images (better for Avatar component)
    // Or redirect for direct file downloads
    const acceptHeader = request.headers.get("accept") || "";
    if (acceptHeader.includes("application/json") || request.headers.get("x-requested-with") === "XMLHttpRequest") {
      return NextResponse.json({ url });
    }

    // Redirect to the presigned URL for direct downloads
    return NextResponse.redirect(url);
  } catch (error) {
    logger.error("Error getting file", error instanceof Error ? error : new Error(String(error)));
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get file" },
      { status: 500 }
    );
  }
}

