/**
 * GenUI Background Service Worker
 * Handles communication between content script and popup
 */

// Import configuration
importScripts('config.js', 'catalyst-service.js');

// Store extracted styles temporarily
let latestStyles = null;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'STYLES_EXTRACTED') {
        // Store the styles
        latestStyles = message.styles;

        console.log('[GenUI] Styles extracted, sending to Catalyst...');

        // Convert styles using Catalyst
        convertStylesWithCatalyst(message.styles)
            .then(result => {
                // Notify popup with converted code
                chrome.runtime.sendMessage({
                    action: 'STYLES_READY',
                    styles: latestStyles,
                    converted: result
                }).catch(() => {
                    console.log('Popup not open, styles stored');
                });

                sendResponse({ success: true, converted: result });
            })
            .catch(error => {
                console.error('[GenUI] Conversion error:', error);
                sendResponse({ success: false, error: error.message });
            });

        return true; // Keep channel open for async response
    }
});

// Convert styles using Catalyst API
async function convertStylesWithCatalyst(styles) {
    try {
        const service = new CatalystService(CATALYST_CONFIG);

        // Get all three formats
        const [cssResult, tailwindResult, jsxResult] = await Promise.all([
            service.convertStyles(styles, 'css', true),
            service.convertStyles(styles, 'tailwind', false),
            service.convertStyles(styles, 'jsx', false)
        ]);

        return {
            css: cssResult.code || cssResult.error,
            tailwind: tailwindResult.code || tailwindResult.error,
            jsx: jsxResult.code || jsxResult.error,
            originalStyles: styles
        };

    } catch (error) {
        console.error('[GenUI] Catalyst conversion failed:', error);
        throw error;
    }
}

// Listen for requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'GET_LATEST_STYLES') {
        sendResponse({ styles: latestStyles });
    } else if (message.action === 'TEST_CATALYST') {
        // Test Catalyst connection
        const service = new CatalystService(CATALYST_CONFIG);
        service.testConnection()
            .then(result => sendResponse(result))
            .catch(error => sendResponse({ success: false, message: error.message }));
        return true; // Keep channel open
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    console.log('GenUI extension clicked on tab:', tab.id);
});
