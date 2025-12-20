import { NextRequest, NextResponse } from "next/server";
import { getPresignedDownloadUrl } from "@/lib/s3";
import { logger } from "@/lib/logger";

/**
 * GET /api/files/[key]
 * Get a presigned URL for downloading a file from S3
 * For images, redirects to the presigned URL
 * For JSON requests, returns the URL in JSON format
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

    // Generate presigned URL (valid for 1 hour)
    // Note: We don't check if file exists first - S3 will return 404 if it doesn't exist
    // This allows the browser to handle 404s gracefully with onError handlers
    const url = await getPresignedDownloadUrl(decodedKey, 3600);

    // Return JSON with URL for AJAX requests or when explicitly requested
    const acceptHeader = request.headers.get("accept") || "";
    if (acceptHeader.includes("application/json") || request.headers.get("x-requested-with") === "XMLHttpRequest") {
      return NextResponse.json({ url });
    }

    // For images and other direct file requests, redirect to the presigned URL
    // The browser will handle 404s from S3 and trigger onError handlers
    return NextResponse.redirect(url);
  } catch (error) {
    logger.error("Error getting file", error instanceof Error ? error : new Error(String(error)));
    
    // Check if it's an S3 error
    const s3Error = error as { $metadata?: { httpStatusCode?: number } };
    if (s3Error?.$metadata?.httpStatusCode === 404) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
    
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to get file" },
      { status: 500 }
    );
  }
}

