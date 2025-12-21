/**
 * useImageAnalysis Hook
 * Custom React Query hook for analyzing images and extracting design tokens
 * Converts images to design.json format
 */

import { useMutation } from "@tanstack/react-query";
import { CATALYST_ANALYZE_IMAGE_URL } from "../constants/api";

// Type definitions
export interface DesignJson {
  [key: string]: string | number;
}

interface ImageAnalysisParams {
  imageFile: File;
}

interface ImageAnalysisResponse {
  success: boolean;
  designJson?: DesignJson;
  error?: string;
  message?: string;
}

/**
 * Analyzes an image and extracts design tokens
 * Converts the image to base64 and sends to Catalyst backend
 */
const analyzeImageAPI = async (
  params: ImageAnalysisParams
): Promise<ImageAnalysisResponse> => {
  // Convert image to base64
  const base64Image = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix if present
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(params.imageFile);
  });

  // Use the image analysis endpoint
  const analyzeUrl = CATALYST_ANALYZE_IMAGE_URL;

  const response = await fetch(analyzeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({
      image: base64Image,
      mimeType: params.imageFile.type,
      fileName: params.imageFile.name,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Image analysis failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Custom hook for image analysis using React Query
 */
export const useImageAnalysis = () => {
  return useMutation<ImageAnalysisResponse, Error, ImageAnalysisParams>({
    mutationFn: analyzeImageAPI,
    onError: (error) => {
      console.error("Image analysis error:", error);
    },
  });
};

export default useImageAnalysis;

