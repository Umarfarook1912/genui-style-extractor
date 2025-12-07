/**
 * GenUI Content Script - Style Extractor
 * Extracts computed styles from selected DOM elements
 */

let extractionMode = false;
let highlightedElement = null;

// Create overlay for highlighting
const overlay = document.createElement('div');
overlay.style.position = 'absolute';
overlay.style.border = '2px solid #3b82f6';
overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
overlay.style.pointerEvents = 'none';
overlay.style.zIndex = '999999';
overlay.style.display = 'none';
document.body.appendChild(overlay);

// Listen for activation from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'START_EXTRACTION') {
        extractionMode = true;
        document.body.style.cursor = 'crosshair';
        sendResponse({ success: true });
    } else if (message.action === 'STOP_EXTRACTION') {
        extractionMode = false;
        document.body.style.cursor = 'default';
        overlay.style.display = 'none';
        sendResponse({ success: true });
    }
});

// Highlight element on hover
document.addEventListener('mouseover', (e) => {
    if (!extractionMode) return;

    highlightedElement = e.target;
    const rect = highlightedElement.getBoundingClientRect();

    overlay.style.display = 'block';
    overlay.style.left = rect.left + window.scrollX + 'px';
    overlay.style.top = rect.top + window.scrollY + 'px';
    overlay.style.width = rect.width + 'px';
    overlay.style.height = rect.height + 'px';
});

// Extract styles on click
document.addEventListener('click', (e) => {
    if (!extractionMode) return;

    e.preventDefault();
    e.stopPropagation();

    const el = e.target;
    const cs = window.getComputedStyle(el);

    // Extract comprehensive styles
    const styles = {
        // Dimensions
        width: cs.width,
        height: cs.height,

        // Colors
        color: cs.color,
        backgroundColor: cs.backgroundColor,

        // Typography
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontFamily: cs.fontFamily,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textAlign: cs.textAlign,

        // Spacing
        margin: cs.margin,
        marginTop: cs.marginTop,
        marginRight: cs.marginRight,
        marginBottom: cs.marginBottom,
        marginLeft: cs.marginLeft,
        padding: cs.padding,
        paddingTop: cs.paddingTop,
        paddingRight: cs.paddingRight,
        paddingBottom: cs.paddingBottom,
        paddingLeft: cs.paddingLeft,

        // Border
        border: cs.border,
        borderRadius: cs.borderRadius,
        borderWidth: cs.borderWidth,
        borderColor: cs.borderColor,
        borderStyle: cs.borderStyle,

        // Display & Layout
        display: cs.display,
        flexDirection: cs.flexDirection,
        justifyContent: cs.justifyContent,
        alignItems: cs.alignItems,
        gap: cs.gap,

        // Position
        position: cs.position,
        top: cs.top,
        right: cs.right,
        bottom: cs.bottom,
        left: cs.left,
        zIndex: cs.zIndex,

        // Other
        opacity: cs.opacity,
        boxShadow: cs.boxShadow,
        transform: cs.transform,
        transition: cs.transition,

        // Element info
        tagName: el.tagName.toLowerCase(),
        className: el.className,
        id: el.id
    };

    // Send to background script
    chrome.runtime.sendMessage({
        action: 'STYLES_EXTRACTED',
        styles: styles
    });

    // Stop extraction mode
    extractionMode = false;
    document.body.style.cursor = 'default';
    overlay.style.display = 'none';

}, { capture: true });
