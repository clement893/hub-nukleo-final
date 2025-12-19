import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Callback route to handle post-authentication logic
 * This allows us to set the rememberMe preference after successful authentication
 */
export async function GET(request: NextRequest) {
  // This route is called after successful authentication
  // We can use it to set cookies or perform other actions
  // The actual session is handled by NextAuth
  
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") || "/commercial/dashboard";
  
  // Redirect to the callback URL
  return NextResponse.redirect(new URL(callbackUrl, request.url));
}

