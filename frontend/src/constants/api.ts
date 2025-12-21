/**
 * API Configuration Constants
 * Contains API endpoints for the GenUI application
 */

/**
 * Catalyst backend endpoint for style conversion
 * Replace this URL with your deployed Catalyst function URL
 * Example: https://genui-12345.catalystserverless.in/server/convertStyles
 */
export const CATALYST_CONVERT_URL =
    import.meta.env.VITE_CATALYST_ENDPOINT ||
    "https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles/";

/**
 * Fallback endpoint for development
 */
export const DEV_ENDPOINT = "https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles/";

/**
 * Base URL for all API endpoints
 */
export const API_BASE_URL = "https://genui-backend-908193831.development.catalystserverless.com";

/**
 * Catalyst backend endpoint for image analysis
 * Analyzes UI design images and extracts design tokens
 */
export const CATALYST_ANALYZE_IMAGE_URL =
    import.meta.env.VITE_CATALYST_ANALYZE_IMAGE_ENDPOINT ||
    `${API_BASE_URL}/server/analyzeImage/`;

/**
 * Catalyst backend endpoint for saving conversions to datastore
 */
export const CATALYST_SAVE_CONVERSION_URL = `${API_BASE_URL}/server/saveConversion/`;
