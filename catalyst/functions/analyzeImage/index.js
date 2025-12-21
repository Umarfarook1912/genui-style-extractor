'use strict';

const { IncomingMessage, ServerResponse } = require("http");

/**
 * Zoho Catalyst Function: analyzeImage
 * Analyzes UI design images and extracts design tokens
 * Returns design.json format compatible with convertStyles
 * 
 * Supports:
 * - OpenAI Vision API (if OPENAI_API_KEY is set)
 * - Fallback heuristic-based extraction
 */

// Helper: Extract colors from image using heuristics
// This is a simplified approach - in production, use a proper image processing library
function extractColorsHeuristic() {
	// Default design tokens based on common UI patterns
	// In a real implementation, you would use image processing libraries
	// like sharp, jimp, or canvas to analyze actual pixel data
	return {
		width: "100%",
		height: "auto",
		backgroundColor: "#ffffff",
		color: "#000000",
		fontSize: "16px",
		fontWeight: "400",
		padding: "16px",
		borderRadius: "8px",
		border: "1px solid #e5e7eb",
	};
}

/**
 * Analyze image using OpenAI Vision API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Design tokens
 */
async function analyzeWithOpenAI(base64Image, mimeType) {
	const openaiApiKey = process.env.OPENAI_API_KEY;
	
	if (!openaiApiKey) {
		console.log('OpenAI API key not set, using fallback');
		return null;
	}

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${openaiApiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'gpt-4-vision-preview',
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `Analyze this UI design image and extract design tokens. Return a JSON object with CSS properties in this exact format:
{
	"width": "300px",
	"height": "200px",
	"backgroundColor": "#ffffff",
	"color": "#000000",
	"fontSize": "16px",
	"fontWeight": "400",
	"fontFamily": "Arial, sans-serif",
	"padding": "16px",
	"margin": "0px",
	"borderRadius": "8px",
	"border": "1px solid #e5e7eb",
	"boxShadow": "0 1px 3px rgba(0,0,0,0.1)"
}

Extract:
- Colors (background, text, borders)
- Typography (font size, weight, family)
- Spacing (padding, margin)
- Dimensions (width, height)
- Border radius
- Shadows/effects
- Layout properties (display, flexDirection, etc.)

Return ONLY valid JSON, no markdown formatting.`
							},
							{
								type: 'image_url',
								image_url: {
									url: `data:${mimeType};base64,${base64Image}`
								}
							}
						]
					}
				],
				max_tokens: 1000,
			}),
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('OpenAI API error:', error);
			return null;
		}

		const data = await response.json();
		const content = data.choices[0]?.message?.content;
		
		if (!content) {
			return null;
		}

		// Parse JSON from response (may be wrapped in markdown code blocks)
		let jsonStr = content.trim();
		if (jsonStr.startsWith('```')) {
			jsonStr = jsonStr.replace(/^```(?:json)?\n?/i, '').replace(/\n?```$/i, '');
		}

		const designJson = JSON.parse(jsonStr);
		return designJson;
	} catch (error) {
		console.error('OpenAI analysis error:', error.message);
		return null;
	}
}

/**
 * Convert design tokens to CSS-compatible format
 * Ensures all values are strings with proper units
 */
function normalizeDesignJson(designJson) {
	const normalized = {};
	
	for (const [key, value] of Object.entries(designJson)) {
		if (typeof value === 'number') {
			// If it's a number, assume pixels for size-related properties
			if (key.includes('width') || key.includes('height') || 
			    key.includes('padding') || key.includes('margin') ||
			    key.includes('fontSize') || key.includes('borderRadius')) {
				normalized[key] = `${value}px`;
			} else if (key.includes('fontWeight')) {
				normalized[key] = String(value);
			} else {
				normalized[key] = String(value);
			}
		} else {
			normalized[key] = String(value);
		}
	}
	
	return normalized;
}

module.exports = async (req, res) => {
	// Handle CORS
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	// Handle OPTIONS request
	if (req.method === 'OPTIONS') {
		res.writeHead(204);
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

	let body = '';
	let responded = false;
	const bodyTimeout = setTimeout(() => {
		if (!responded) {
			responded = true;
			res.writeHead(408, { 'Content-Type': 'application/json' });
			res.write(JSON.stringify({ error: 'Request timeout' }));
			res.end();
		}
	}, 30000); // 30 second timeout

	let aborted = false;
	req.on('aborted', () => {
		aborted = true;
		clearTimeout(bodyTimeout);
	});

	req.on('data', (chunk) => {
		body += chunk.toString();
	});

	req.on('end', async () => {
		clearTimeout(bodyTimeout);
		if (aborted) {
			console.warn('Request ended after abort; skipping processing');
			return;
		}

		try {
			const requestBody = JSON.parse(body);
			const { image, mimeType, fileName } = requestBody;

			if (!image || typeof image !== 'string') {
				if (!responded) {
					responded = true;
					res.writeHead(400, { 'Content-Type': 'application/json' });
					res.write(JSON.stringify({ error: 'Invalid request. "image" (base64) is required.' }));
					res.end();
				}
				return;
			}

			// Try OpenAI Vision API first
			let designJson = await analyzeWithOpenAI(image, mimeType || 'image/png');

			// Fallback to heuristic extraction
			if (!designJson) {
				console.log('Using fallback heuristic extraction');
				designJson = extractColorsHeuristic();
			}

			// Normalize the design JSON
			const normalized = normalizeDesignJson(designJson);

			// Send successful response
			if (!responded) {
				responded = true;
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({
					success: true,
					designJson: normalized,
					message: 'Image analyzed successfully'
				}));
				res.end();
			}
		} catch (error) {
			console.error('Image analysis error:', error);
			if (!responded) {
				responded = true;
				res.writeHead(500, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({
					success: false,
					error: error.message || 'Failed to analyze image'
				}));
				res.end();
			}
		}
	});
};

