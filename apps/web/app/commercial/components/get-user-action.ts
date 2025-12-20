"use server";

import { getCurrentUser } from "@/lib/auth-helpers";

export async function getCurrentUserAction() {
  try {
    const user = await getCurrentUser();
    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
    };
  }
}

