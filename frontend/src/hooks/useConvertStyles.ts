/**
 * useConvertStyles Hook
 * Custom React Query hook for converting CSS styles to Tailwind/CSS/JSX
 */

import { useMutation } from "@tanstack/react-query";
import { CATALYST_CONVERT_URL } from "../constants/api";

// Type definitions
type Styles = Record<string, string>;
type OutputFormat = "css" | "tailwind" | "jsx";

interface ConvertStylesParams {
    styles: Styles;
    format: OutputFormat;
    useRem?: boolean;
}

interface ConvertStylesResponse {
    code?: string;
    output?: string;
    error?: string;
}

/**
 * Converts CSS styles to the specified format using Catalyst backend
 */
const convertStylesAPI = async (
    params: ConvertStylesParams
): Promise<ConvertStylesResponse> => {
    const response = await fetch(CATALYST_CONVERT_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
    }

    return response.json();
};

/**
 * Custom hook for style conversion using React Query
 */
export const useConvertStyles = () => {
    return useMutation<ConvertStylesResponse, Error, ConvertStylesParams>({
        mutationFn: convertStylesAPI,
        onError: (error) => {
            console.error("Style conversion error:", error);
        },
    });
};

export default useConvertStyles;
