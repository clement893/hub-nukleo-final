"use client";
import * as React from "react";
import { Avatar } from "@nukleo/ui";

interface EmployeeAvatarProps {
  firstName: string;
  lastName: string;
  photoKey?: string | null;
  photoUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function EmployeeAvatar({
  firstName,
  lastName,
  photoKey,
  photoUrl,
  size = "md",
  className,
}: EmployeeAvatarProps) {
  const [error, setError] = React.useState(false);
  const fallback = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();
  
  // Priorité: photoKey via API, puis photoUrl (qui peut être image depuis Employee), puis fallback
  const src = React.useMemo(() => {
    if (error) return undefined;
    if (photoKey) return `/api/files/${encodeURIComponent(photoKey)}`;
    if (photoUrl) return photoUrl; // Peut être l'URL directe ou le chemin image
    return undefined;
  }, [photoKey, photoUrl, error]);

  return (
    <Avatar
      size={size}
      className={className}
      fallback={fallback}
      src={src}
      alt={`${firstName} ${lastName}`}
    />
  );
}

