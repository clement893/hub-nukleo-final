/**
 * Helper functions for authentication using NextAuth
 * Replaces the old lib/auth.ts system
 */

import { auth } from "@/auth";
import { redirect } from "next/navigation";

/**
 * Get the current authenticated user ID
 * Throws an error if user is not authenticated
 * Note: In API routes, this will throw an error instead of redirecting
 */
export async function getCurrentUserId(): Promise<string> {
  const session = await auth();
  
  if (!session?.user?.id) {
    // In API routes, we can't redirect, so we throw an error
    // The caller should handle this appropriately
    throw new Error("Unauthorized: User not authenticated");
  }
  
  return session.user.id;
}

/**
 * Get the current authenticated user
 * Returns null if user is not authenticated
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Require authentication - redirects to login if not authenticated
 */
export async function requireAuth() {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }
  
  return session;
}

