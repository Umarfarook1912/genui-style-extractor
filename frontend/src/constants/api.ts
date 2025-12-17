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
