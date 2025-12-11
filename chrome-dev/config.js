/**
 * GenUI - Catalyst Configuration
 * Update this after deploying to Catalyst
 */

const CATALYST_CONFIG = {
    // STEP 1: After running 'catalyst deploy', get your function URL
    // Deployed function URL (updated automatically)
    functionUrl: 'https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles/', // Deployed to Catalyst

    // STEP 2: Get your project ID from Catalyst dashboard
    // Found in: console.catalyst.zoho.com → Your Project → Settings
    projectId: '50209000000021009', // genui-backend project ID

    // Environment
    environment: 'development', // 'development' or 'production'

    // Timeout for API calls (milliseconds)
    timeout: 10000,

    // Enable logging
    enableLogs: true
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CATALYST_CONFIG;
}
