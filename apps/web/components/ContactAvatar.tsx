"use client";

import * as React from "react";
import { Avatar } from "@nukleo/ui";
import Image from "next/image";

interface ContactAvatarProps {
  firstName: string;
  lastName: string;
  photoKey?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * ContactAvatar - Component to display contact avatar with S3 photo support
 */
export function ContactAvatar({
  firstName,
  lastName,
  photoKey,
  size = "md",
  className,
}: ContactAvatarProps) {
  const [photoUrl, setPhotoUrl] = React.useState<string | null>(null);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    if (photoKey && !error) {
      // Generate presigned URL for the photo
      fetch(`/api/files/${encodeURIComponent(photoKey)}/presigned?type=download&expiresIn=3600`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.url) {
            setPhotoUrl(data.url);
          }
        })
        .catch(() => {
          setError(true);
        });
    }
  }, [photoKey, error]);

  const fallback = `${firstName[0]}${lastName[0]}`.toUpperCase();

  if (photoUrl && !error) {
    return (
      <Avatar
        size={size}
        className={className}
        fallback={fallback}
      >
        <Image
          src={photoUrl}
          alt={`${firstName} ${lastName}`}
          width={size === "lg" ? 80 : size === "md" ? 40 : 32}
          height={size === "lg" ? 80 : size === "md" ? 40 : 32}
          className="rounded-full object-cover"
          onError={() => setError(true)}
        />
      </Avatar>
    );
  }

  return (
    <Avatar
      size={size}
      className={className}
      fallback={fallback}
    />
  );
}

