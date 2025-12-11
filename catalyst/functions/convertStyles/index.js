'use strict';

const { IncomingMessage, ServerResponse } = require("http");

/**
 * Zoho Catalyst Function: convertStyles
 * Converts CSS styles to Tailwind classes or formatted CSS
 * Optional: Saves to Catalyst Datastore if table exists
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
 * Save conversion to Catalyst Datastore
 * @param {Object} inputStyles - Original styles object
 * @param {String} format - Output format (css/tailwind/jsx)
 * @param {String} outputCode - Generated code
 * @param {String} userAgent - Browser user agent
 * @param {IncomingMessage} req - Request object for Catalyst context
 */
async function saveToDatastore(inputStyles, format, outputCode, userAgent = '', req) {
	try {
		// Lazy load SDK only when needed
		const catalyst = require('zcatalyst-sdk-node');
		const catalystApp = catalyst.initialize(req);
		const table = catalystApp.datastore().table('ConversionHistory');

		const rowData = {
			format: format,
			input_styles: JSON.stringify(inputStyles),
			output_code: outputCode,
			user_agent: userAgent || 'Unknown'
		};

		// Try insertRow first (common API). If not available, try insertRows as fallback.
		if (typeof table.insertRow === 'function') {
			await table.insertRow(rowData);
			console.log('✅ Conversion saved to datastore via insertRow');
			return true;
		} else if (typeof table.insertRows === 'function') {
			await table.insertRows([rowData]);
			console.log('✅ Conversion saved to datastore via insertRows');
			return true;
		} else if (typeof table.addRow === 'function') {
			await table.addRow(rowData);
			console.log('✅ Conversion saved to datastore via addRow');
			return true;
		} else {
			// Last-resort: try calling createRow or insert as generic method names
			if (typeof table.createRow === 'function') {
				await table.createRow(rowData);
				console.log('✅ Conversion saved to datastore via createRow');
				return true;
			}
			console.log('⚠️ No recognized insert method on table object; available keys:', Object.keys(table));
			return false;
		}
	} catch (error) {
		// Don't throw - saving to datastore is optional
		// Table might not exist yet, or other issues
		console.error('ℹ️ Datastore save skipped, error details:');
		if (error && error.message) console.error('message:', error.message);
		if (error && error.stack) console.error(error.stack);
		try {
			// also log the table methods if catalyst init succeeded
			const catalyst = require('zcatalyst-sdk-node');
			const app = catalyst.initialize(req);
			const tbl = app.datastore().table('ConversionHistory');
			console.error('Table object keys:', Object.keys(tbl));
		} catch (err2) {
			console.error('error while inspecting table object:', err2 && err2.message);
		}
		return false;
	}
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

			// Save to Datastore (async, don't block response)
			// Pass req for Catalyst context
			saveToDatastore(styles, format, convertedCode, req.headers['user-agent'], req)
				.catch(err => console.log('Datastore save failed (non-critical):', err.message));

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

