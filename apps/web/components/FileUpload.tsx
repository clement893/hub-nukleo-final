"use client";

import * as React from "react";
import { Button } from "@nukleo/ui";
import { useToast } from "@/lib/toast";
import { logger } from "@/lib/logger";

interface FileUploadProps {
  onUploadSuccess?: (key: string, url: string) => void;
  onUploadError?: (error: Error) => void;
  accept?: string;
  maxSize?: number; // in bytes
  prefix?: string;
  label?: string;
  disabled?: boolean;
}

/**
 * FileUpload - Component for uploading files to S3
 */
export function FileUpload({
  onUploadSuccess,
  onUploadError,
  accept,
  maxSize = 10 * 1024 * 1024, // 10MB default
  prefix,
  label = "Upload file",
  disabled = false,
}: FileUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { addToast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(2);
      addToast({
        variant: "error",
        title: "File too large",
        description: `File size must be less than ${maxSizeMB}MB`,
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append("file", file);
      if (prefix) {
        formData.append("prefix", prefix);
      }

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to upload file");
      }

      const result = await response.json();
      setUploadProgress(100);

      addToast({
        variant: "success",
        title: "Upload successful",
        description: "File uploaded successfully",
      });

      onUploadSuccess?.(result.key, result.url);
    } catch (error) {
      logger.error("File upload error", error instanceof Error ? error : new Error(String(error)));
      addToast({
        variant: "error",
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
      });
      onUploadError?.(error instanceof Error ? error : new Error(String(error)));
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isUploading}
      />
      <Button
        onClick={handleClick}
        variant="outline"
        disabled={disabled || isUploading}
        className="w-full"
      >
        {isUploading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Uploading... {uploadProgress > 0 && `${uploadProgress}%`}
          </span>
        ) : (
          <span className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            {label}
          </span>
        )}
      </Button>
      {isUploading && uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}


