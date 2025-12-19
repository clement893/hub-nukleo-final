"use client";

import * as React from "react";
import { Avatar } from "@nukleo/ui";

interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  photoKey?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ContactAvatar - Component to display contact avatar with S3 photo support
 * Uses the /api/files/[key] route which redirects to presigned S3 URL
 */
export function ContactAvatar({
  firstName,
  lastName,
  photoKey,
  size = "md",
  className,
}: ContactAvatarProps) {
  const [error, setError] = React.useState(false);

  const fallback = `${firstName[0]}${lastName[0]}`.toUpperCase();

  // If photoKey exists and no error, use the API route which will redirect to presigned URL
  const photoUrl = photoKey && !error 
    ? `/api/files/${encodeURIComponent(photoKey)}`
    : undefined;

  return (
    <Avatar
      size={size}
      className={className}
      fallback={fallback}
      src={photoUrl}
      onError={() => setError(true)}
    />
  );
}

