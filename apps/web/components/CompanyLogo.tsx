"use client";

import * as React from "react";

interface CompanyLogoProps {
  companyName: string;
  logoKey?: string | null;
  size?: number;
  className?: string;
}

/**
 * CompanyLogo - Component to display company logo with S3 support
 * Uses the /api/files/[key]/presigned route to get presigned S3 URL
 */
export function CompanyLogo({
  companyName,
  logoKey,
  size = 40,
  className = "",
}: CompanyLogoProps) {
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Reset states when logoKey changes
    setPhotoUrl(null);
    setError(false);
    setIsLoading(true);

    if (!logoKey) {
      setIsLoading(false);
      return;
    }

    // Fetch presigned URL from API
    fetch(`/api/files/${encodeURIComponent(logoKey)}/presigned?type=download&expiresIn=3600`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.success && data.url) {
          setPhotoUrl(data.url);
          setError(false);
        } else {
          setError(true);
        }
      })
      .catch((err) => {
        console.error("Error fetching logo URL:", err);
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [logoKey]); // Removed 'error' from dependencies to avoid infinite loops

  // Show logo if URL is loaded and no error
  if (photoUrl && !error && !isLoading) {
    return (
      <div
        className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={photoUrl}
          alt={`${companyName} logo`}
          className="object-contain w-full h-full"
          style={{ width: size, height: size }}
          onError={() => {
            setError(true);
            setPhotoUrl(null);
          }}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback: show company initials
  const initials = companyName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  return (
    <div
      className={`flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold text-sm ${className}`}
      style={{ width: size, height: size }}
    >
      {initials}
    </div>
  );
}


