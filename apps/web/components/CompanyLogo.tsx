"use client";

import * as React from "react";
import Image from "next/image";

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

  React.useEffect(() => {
    if (logoKey && !error) {
      // Fetch presigned URL from API
      fetch(`/api/files/${encodeURIComponent(logoKey)}/presigned?type=download&expiresIn=3600`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.url) {
            setPhotoUrl(data.url);
          } else {
            setError(true);
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [logoKey, error]);

  if (photoUrl && !error) {
    return (
      <div
        className={`relative flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${className}`}
        style={{ width: size, height: size }}
      >
        <Image
          src={photoUrl}
          alt={`${companyName} logo`}
          width={size}
          height={size}
          className="object-contain"
          onError={() => setError(true)}
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


