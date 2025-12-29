/**
 * ImageUpload Component
 * Handles image file upload with drag-and-drop support
 * Displays preview and upload status
 */

import { useRef, useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { Loader } from "./Loader";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  isProcessing?: boolean;
  previewUrl?: string | null;
}

export const ImageUpload = ({
  onImageSelect,
  isProcessing = false,
  previewUrl,
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!validTypes.includes(file.type)) {
      setError("Please upload a valid image file (JPEG, PNG, WebP, or GIF)");
      return false;
    }

    if (file.size > maxSize) {
      setError("Image size must be less than 10MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleFileSelect = (file: File) => {
    if (validateFile(file)) {
      onImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="image-upload-card">
      <div
        className={`upload-area ${isDragging ? "dragging" : ""} ${isProcessing ? "processing" : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={{
          border: `2px dashed ${isDragging ? "#06b6d4" : "#d1d5db"}`,
          borderRadius: "12px",
          padding: "40px 20px",
          textAlign: "center",
          cursor: isProcessing ? "not-allowed" : "pointer",
          backgroundColor: isDragging ? "#f3f4f6" : "white",
          transition: "all 0.2s ease",
          position: "relative",
          minHeight: "200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          style={{ display: "none" }}
          disabled={isProcessing}
        />

        {isProcessing ? (
          <>
            <Loader text="Analyzing image..." />
            <p style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}>
              Extracting design tokens from your image
            </p>
          </>
        ) : previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                maxWidth: "100%",
                maxHeight: "300px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              }}
            />
            <p style={{ fontSize: "14px", color: "#666" }}>
              Click to upload a different image
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "8px",
                fontWeight: 700,
              }}
            />
            <div>
              <p style={{ fontSize: "16px", fontWeight: "600", marginBottom: "4px" }}>
                Upload UI Design Image
              </p>
              <p style={{ fontSize: "14px", color: "#666" }}>
                Drag and drop an image here, or click to browse
              </p>
            </div>
            <p style={{ fontSize: "12px", color: "#999", marginTop: "8px" }}>
              Supports JPEG, PNG, WebP, GIF (max 10MB)
            </p>
          </>
        )}

        {error && (
          <div
            style={{
              marginTop: "12px",
              padding: "8px 12px",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              borderRadius: "6px",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {previewUrl && !isProcessing && (
        <div style={{ marginTop: "16px", display: "flex", gap: "8px" }}>
          <Button
            onClick={handleClick}
            variant="secondary"
            style={{ flex: 1 }}
          >
            Change Image
          </Button>
        </div>
      )}
    </Card>
  );
};

export default ImageUpload;

