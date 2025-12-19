"use client";

import * as React from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    // Check for saved theme preference or default to system preference
    if (typeof window !== "undefined") {
      const theme = localStorage.getItem("theme");
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;

      if (theme === "dark" || (!theme && systemPrefersDark)) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, []);

  // Always render children to avoid hydration issues
  // The theme will be applied once mounted
  return <>{children}</>;
}

