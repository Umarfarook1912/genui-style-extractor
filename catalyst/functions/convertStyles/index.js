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
 * Get authenticated user ID from Catalyst request
 * @param {Object} catalystApp - Initialized Catalyst app
 * @returns {String|null} User ID or null if not authenticated
 */
async function getAuthenticatedUserId(catalystApp) {
	try {
		const userManagement = catalystApp.userManagement();
		const currentUser = await userManagement.getCurrentUser();

		console.log('🔵 Current user object:', JSON.stringify(currentUser));

		// Try multiple possible fields for user ID
		const userId = currentUser?.user_id || currentUser?.id || currentUser?.zaaid || currentUser?.ROWID;

		if (userId) {
			console.log('🔵 Extracted user ID:', userId, 'Type:', typeof userId);
			return String(userId);
		}

		console.log('⚠️ No user ID found in current user object');
		return null;
	} catch (error) {
		console.log('No authenticated user:', error.message);
		return null;
	}
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
		console.log('🔵 Starting datastore save operation...');
		console.log('🔵 Format:', format);
		console.log('🔵 User Agent:', userAgent || 'Unknown');

		// Lazy load SDK only when needed
		const catalyst = require('zcatalyst-sdk-node');
		console.log('🔵 Catalyst SDK loaded');

		const catalystApp = catalyst.initialize(req);
		console.log('🔵 Catalyst app initialized');

		const datastore = catalystApp.datastore();
		console.log('🔵 Datastore instance obtained');

		const table = datastore.table('ConversionHistory');
		console.log('🔵 Table reference obtained:', typeof table);
		console.log('🔵 Table methods:', Object.keys(table));

		// Get authenticated user ID (optional - works with or without auth)
		const userId = await getAuthenticatedUserId(catalystApp);
		console.log('🔵 User ID retrieved:', userId);

		const rowData = {
			format: format,
			input_styles: JSON.stringify(inputStyles),
			output_code: outputCode,
			user_agent: userAgent || 'Unknown'
			// Note: CREATORID is automatically set by Catalyst to the authenticated user's ID
		};

		console.log('🔵 Row data prepared:', {
			format: rowData.format,
			input_styles_length: rowData.input_styles.length,
			output_code_length: rowData.output_code.length,
			user_agent: rowData.user_agent,
			user_id: rowData.user_id
		});

		// Catalyst SDK uses a promise-based API with requester
		// The table object has: _tableDetails, identifier, requester
		console.log('🔵 Attempting to insert row using Catalyst SDK...');

		// Check what methods are available on table
		console.log('🔵 Table type:', typeof table);
		console.log('🔵 Table.insertRows?', typeof table.insertRows);
		console.log('🔵 All table methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(table)));

		// Try to call insertRows
		try {
			console.log('🔵 Calling insertRows with data...');
			const result = await table.insertRows([rowData]);
			console.log('✅ insertRows completed:', JSON.stringify(result));
			return true;
		} catch (insertError) {
			console.error('❌ insertRows failed:', typeof insertError, insertError);
			throw insertError; // Re-throw to outer catch
		}

	} catch (error) {
		// Log detailed error information
		console.error('❌ Datastore save failed!');
		console.error('❌ Error type:', typeof error);
		console.error('❌ Error constructor:', error?.constructor?.name);
		console.error('❌ Error as string:', String(error));
		console.error('❌ Error message:', error?.message);
		console.error('❌ Error code:', error?.code);
		console.error('❌ Error stack:', error?.stack);

		// Try to get more context about the error
		if (error.response) {
			console.error('❌ Error response:', JSON.stringify(error.response));
		}
		if (error.details) {
			console.error('❌ Error details:', JSON.stringify(error.details));
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

	// Read request body with safety guards
	let body = '';
	let aborted = false;
	let responded = false;

	console.log('convertStyles handler invoked, method=', req.method);

	// Safety: guard against excessively large bodies or stalled uploads
	const MAX_BODY_SIZE = 256 * 1024; // 256 KB should be plenty for styles
	let bodyTimeout = setTimeout(() => {
		console.error('Request body read timed out');
		aborted = true;
		// destroy the request stream to stop further data events
		if (typeof req.destroy === 'function') req.destroy();
		if (!responded) {
			responded = true;
			try {
				res.writeHead(408, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ status: 'failure', data: { message: 'Request body read timed out' } }));
				res.end();
			} catch (e) { console.error('Error while sending timeout response:', e && e.message); }
		}
	}, 10000); // 10s

	req.on('data', chunk => {
		if (aborted) return;
		body += chunk.toString();
		if (body.length > MAX_BODY_SIZE) {
			console.error('Request body too large, aborting');
			aborted = true;
			if (typeof req.destroy === 'function') req.destroy();
			if (!responded) {
				responded = true;
				try {
					res.writeHead(413, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Payload too large' }));
					res.end();
				} catch (e) { console.error('Error while sending payload too large response:', e && e.message); }
			}
		}
	});

	req.on('error', err => {
		console.error('Request stream error:', err && err.message);
		aborted = true;
		if (!responded) {
			responded = true;
			try {
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ error: 'Request stream error', message: err && err.message }));
				res.end();
			} catch (e) { console.error('Error while sending request error response:', e && e.message); }
		}
	});

	req.on('end', () => {
		clearTimeout(bodyTimeout);
		if (aborted) {
			console.warn('Request ended after abort; skipping processing');
			return;
		}
		try {
			const requestBody = JSON.parse(body);
			const { styles, format = 'css', useRem = true } = requestBody;

			if (!styles || typeof styles !== 'object') {
				if (!responded) {
					responded = true;
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Invalid request. "styles" object is required.' }));
					res.end();
				}
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
				if (!responded) {
					responded = true;
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Invalid format. Use "css", "tailwind", or "jsx".' }));
					res.end();
				}
				return;
			}

			// Send successful response (without saving to datastore)
			if (!responded) {
				responded = true;
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({ success: true, format, code: convertedCode, originalStyles: styles }));
				res.end();
			}

			// Note: Datastore save is now handled by separate saveConversion endpoint
			// User must click "Save" button to persist the conversion

		} catch (error) {
			console.error('Error in convertStyles function:', error && (error.stack || error.message));
			if (!responded) {
				responded = true;
				if (error && error instanceof SyntaxError) {
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Invalid JSON in request body', message: error.message }));
				} else {
					res.writeHead(500, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Internal server error', message: error.message }));
				}
				res.end();
			}
		}
	});
};

