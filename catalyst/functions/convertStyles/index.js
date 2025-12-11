'use strict';

const { IncomingMessage, ServerResponse } = require("http");

/**
 * Zoho Catalyst Function: convertStyles
 * Converts CSS styles to Tailwind classes or formatted CSS
 */

// Helper: Convert px to rem
function pxToRem(px) {
	const value = parseFloat(px);
	return isNaN(value) ? px : `${(value / 16).toFixed(3)}rem`;
}

// Helper: Convert CSS color to hex
function rgbToHex(rgb) {
	const match = rgb.match(/\d+/g);
	if (!match) return rgb;
	const [r, g, b] = match;
	return `#${((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b))
		.toString(16)
		.slice(1)}`;
}

// Helper: Convert CSS to Tailwind classes
function cssToTailwind(styles) {
	const tailwindClasses = [];

	// Width & Height
	if (styles.width) {
		const w = parseFloat(styles.width);
		if (w) tailwindClasses.push(`w-[${styles.width}]`);
	}
	if (styles.height) {
		const h = parseFloat(styles.height);
		if (h) tailwindClasses.push(`h-[${styles.height}]`);
	}

	// Colors
	if (styles.backgroundColor) {
		const bg = rgbToHex(styles.backgroundColor);
		tailwindClasses.push(`bg-[${bg}]`);
	}
	if (styles.color) {
		const text = rgbToHex(styles.color);
		tailwindClasses.push(`text-[${text}]`);
	}

	// Typography
	if (styles.fontSize) {
		tailwindClasses.push(`text-[${styles.fontSize}]`);
	}
	if (styles.fontWeight) {
		const weight = styles.fontWeight;
		if (weight === '700' || weight === 'bold') tailwindClasses.push('font-bold');
		else if (weight === '600') tailwindClasses.push('font-semibold');
		else if (weight === '500') tailwindClasses.push('font-medium');
	}

	// Spacing (padding)
	if (styles.padding) {
		tailwindClasses.push(`p-[${styles.padding}]`);
	}
	if (styles.margin) {
		tailwindClasses.push(`m-[${styles.margin}]`);
	}

	// Border
	if (styles.borderRadius) {
		tailwindClasses.push(`rounded-[${styles.borderRadius}]`);
	}
	if (styles.borderWidth && parseFloat(styles.borderWidth) > 0) {
		tailwindClasses.push(`border-[${styles.borderWidth}]`);
		if (styles.borderColor) {
			const borderColor = rgbToHex(styles.borderColor);
			tailwindClasses.push(`border-[${borderColor}]`);
		}
	}

	// Display & Layout
	if (styles.display === 'flex') {
		tailwindClasses.push('flex');
		if (styles.flexDirection) {
			if (styles.flexDirection === 'column') tailwindClasses.push('flex-col');
			if (styles.flexDirection === 'row') tailwindClasses.push('flex-row');
		}
		if (styles.justifyContent) {
			const justify = {
				'center': 'justify-center',
				'space-between': 'justify-between',
				'flex-start': 'justify-start',
				'flex-end': 'justify-end'
			}[styles.justifyContent];
			if (justify) tailwindClasses.push(justify);
		}
		if (styles.alignItems) {
			const align = {
				'center': 'items-center',
				'flex-start': 'items-start',
				'flex-end': 'items-end'
			}[styles.alignItems];
			if (align) tailwindClasses.push(align);
		}
	}

	return tailwindClasses.join(' ');
}

// Helper: Format CSS with rem conversion
function formatCSS(styles, useRem = true) {
	let css = '';

	for (const [property, value] of Object.entries(styles)) {
		if (!value || value === 'none' || value === 'auto') continue;

		let cssValue = value;

		// Convert px to rem if enabled
		if (useRem && typeof value === 'string' && value.includes('px')) {
			cssValue = pxToRem(value);
		}

		// Convert camelCase to kebab-case
		const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
		css += `  ${cssProperty}: ${cssValue};\n`;
	}

	return `{\n${css}}`;
}

/**
 * Main function handler
 * @param {IncomingMessage} req 
 * @param {ServerResponse} res 
 */
module.exports = (req, res) => {
	// Handle CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS request
	if (req.method === 'OPTIONS') {
		res.writeHead(200);
		res.end();
		return;
	}

	// Only handle POST requests
	if (req.method !== 'POST') {
		res.writeHead(405, { 'Content-Type': 'application/json' });
		res.write(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
		res.end();
		return;
	}

	// Read request body
	let body = '';
	req.on('data', chunk => {
		body += chunk.toString();
	});

	req.on('end', () => {
		try {
			const requestBody = JSON.parse(body);
			const { styles, format = 'css', useRem = true } = requestBody;

			if (!styles || typeof styles !== 'object') {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({
					error: 'Invalid request. "styles" object is required.'
				}));
				res.end();
				return;
			}

			let convertedCode = '';

			// Convert based on format
			if (format === 'tailwind') {
				convertedCode = cssToTailwind(styles);
			} else if (format === 'css') {
				convertedCode = formatCSS(styles, useRem);
			} else if (format === 'jsx') {
				convertedCode = `style={${JSON.stringify(styles, null, 2)}}`;
			} else {
				res.writeHead(400, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({
					error: 'Invalid format. Use "css", "tailwind", or "jsx".'
				}));
				res.end();
				return;
			}

			// Send successful response
			res.writeHead(200, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({
				success: true,
				format,
				code: convertedCode,
				originalStyles: styles
			}));
			res.end();

		} catch (error) {
			console.error('Error in convertStyles function:', error);
			res.writeHead(500, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({
				error: 'Internal server error',
				message: error.message
			}));
			res.end();
		}
	});
};

