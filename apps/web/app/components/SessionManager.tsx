"use client";

import * as React from "react";
import { useSession } from "next-auth/react";

/**
 * Component to manage session preferences (like rememberMe)
 * This runs after authentication to update the session with rememberMe preference
 */
export function SessionManager() {
  const { data: session, update } = useSession();
  const [hasUpdated, setHasUpdated] = React.useState(false);

  React.useEffect(() => {
    // Only run once after session is loaded
    if (session && !hasUpdated) {
      const rememberMe = localStorage.getItem("rememberMe") === "true";
      
      // Update session with rememberMe preference
      // This will be stored in the JWT token
      update({
        rememberMe,
      }).then(() => {
        setHasUpdated(true);
        // Clean up localStorage after updating session
        localStorage.removeItem("rememberMe");
      }).catch((error) => {
        console.error("Failed to update session:", error);
      });
    }
  }, [session, hasUpdated, update]);

  // This component doesn't render anything
  return null;
}

