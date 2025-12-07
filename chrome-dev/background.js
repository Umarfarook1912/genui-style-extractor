/**
 * GenUI Background Service Worker
 * Handles communication between content script and popup
 */

// Store extracted styles temporarily
let latestStyles = null;

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'STYLES_EXTRACTED') {
        // Store the styles
        latestStyles = message.styles;

        // Notify popup (if open)
        chrome.runtime.sendMessage({
            action: 'STYLES_READY',
            styles: latestStyles
        }).catch(() => {
            // Popup might not be open, that's okay
            console.log('Popup not open, styles stored');
        });

        sendResponse({ success: true });
    }
});

// Listen for requests from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'GET_LATEST_STYLES') {
        sendResponse({ styles: latestStyles });
    }
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
    // Open popup (default behavior)
    // Or you could inject content script here if needed
    console.log('GenUI extension clicked on tab:', tab.id);
});
