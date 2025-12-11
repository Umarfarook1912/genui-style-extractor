/**
 * GenUI - Catalyst API Service
 * Handles all communication with Catalyst backend
 */

class CatalystService {
    constructor(config) {
        this.config = config || CATALYST_CONFIG;
        this.baseUrl = this.config.functionUrl;
    }

    /**
     * Convert styles using Catalyst function
     * @param {Object} styles - Extracted CSS styles
     * @param {string} format - Output format: 'css', 'tailwind', or 'jsx'
     * @param {boolean} useRem - Convert px to rem
     * @returns {Promise<Object>} Converted code
     */
    async convertStyles(styles, format = 'tailwind', useRem = true) {
        try {
            if (this.config.enableLogs) {
                console.log('[GenUI] Sending styles to Catalyst:', { styles, format, useRem });
            }

            const response = await fetch(this.baseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    styles,
                    format,
                    useRem
                }),
                signal: AbortSignal.timeout(this.config.timeout)
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();

            if (this.config.enableLogs) {
                console.log('[GenUI] Received from Catalyst:', result);
            }

            return result;

        } catch (error) {
            console.error('[GenUI] Catalyst API Error:', error);

            // Return fallback response
            return {
                success: false,
                error: error.message,
                code: this._generateFallbackCode(styles, format)
            };
        }
    }

    /**
     * Fallback code generation (if Catalyst is unavailable)
     * Basic conversion without Catalyst
     */
    _generateFallbackCode(styles, format) {
        if (format === 'tailwind') {
            // Simple Tailwind conversion
            const classes = [];

            if (styles.width) classes.push(`w-[${styles.width}]`);
            if (styles.height) classes.push(`h-[${styles.height}]`);
            if (styles.backgroundColor) classes.push(`bg-[${this._rgbToHex(styles.backgroundColor)}]`);
            if (styles.color) classes.push(`text-[${this._rgbToHex(styles.color)}]`);
            if (styles.fontSize) classes.push(`text-[${styles.fontSize}]`);

            return classes.join(' ') || 'No styles converted';

        } else if (format === 'css') {
            // Simple CSS formatting
            let css = '{\n';
            for (const [key, value] of Object.entries(styles)) {
                if (value && value !== 'none' && value !== 'auto') {
                    const prop = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                    css += `  ${prop}: ${value};\n`;
                }
            }
            css += '}';
            return css;

        } else if (format === 'jsx') {
            return `style={${JSON.stringify(styles, null, 2)}}`;
        }

        return 'Format not supported';
    }

    /**
     * Helper: Convert RGB to Hex
     */
    _rgbToHex(rgb) {
        const match = rgb.match(/\d+/g);
        if (!match) return rgb;
        const [r, g, b] = match;
        return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b))
            .toString(16)
            .slice(1)}`;
    }

    /**
     * Test connection to Catalyst
     */
    async testConnection() {
        try {
            const testStyles = {
                width: '100px',
                height: '100px',
                backgroundColor: 'rgb(59, 130, 246)'
            };

            const result = await this.convertStyles(testStyles, 'tailwind');

            if (result.success) {
                console.log('✅ Catalyst connection successful!');
                return { success: true, message: 'Connected to Catalyst' };
            } else {
                console.warn('⚠️ Catalyst returned error:', result.error);
                return { success: false, message: result.error };
            }

        } catch (error) {
            console.error('❌ Catalyst connection failed:', error);
            return { success: false, message: error.message };
        }
    }
}

// Create global instance
const catalystService = new CatalystService(CATALYST_CONFIG);

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CatalystService, catalystService };
}
