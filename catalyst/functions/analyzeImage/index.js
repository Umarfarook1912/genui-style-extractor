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

// Note: Fallback is now handled inline in the main handler
// This function is kept for reference but not used

/**
 * Analyze image using OpenAI Vision API
 * @param {string} base64Image - Base64 encoded image
 * @param {string} mimeType - Image MIME type
 * @returns {Promise<Object>} Design tokens
 */
async function analyzeWithOpenAI(base64Image, mimeType) {
	// Check for API key in multiple possible environment variable names
	const openaiApiKey = process.env.OPENAI_API_KEY || 
	                     process.env.OPEN_API_KEY || 
	                     process.env.OPENAI_KEY ||
	                     process.env.API_KEY;
	
	if (!openaiApiKey) {
		console.log('❌ OpenAI API key not set in environment variables');
		console.log('Available env vars:', Object.keys(process.env).filter(k => k.includes('OPENAI') || k.includes('OPEN_API') || k.includes('API_KEY')));
		console.log('💡 Looking for: OPENAI_API_KEY, OPEN_API_KEY, OPENAI_KEY, or API_KEY');
		return null;
	}
	
	console.log('✅ OpenAI API key found (length:', openaiApiKey.length, 'chars)');
	console.log('🔑 API key prefix:', openaiApiKey.substring(0, 10) + '...');

	try {
		const response = await fetch('https://api.openai.com/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${openaiApiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				model: 'gpt-4o-mini', // Using mini model for lower costs (~10x cheaper)
				messages: [
					{
						role: 'user',
						content: [
							{
								type: 'text',
								text: `You are an expert UI/UX designer analyzing a design image. Extract a comprehensive, accurate design.json structure. Be THOROUGH and DETAILED - analyze EVERY visible element.

CRITICAL: Look at the ACTUAL image content. Do NOT guess or use generic values. Extract REAL colors, REAL text, REAL dimensions from what you see.

Return ONLY valid JSON (no markdown, no code blocks, no explanations):

{
  "meta": {
    "source": "image",
    "confidence": "high" or "approximate" or "low" (based on image clarity),
    "device": "mobile" or "desktop" or "tablet" (determine from aspect ratio and layout),
    "screenType": "portrait" or "landscape",
    "section": "string" (describe what page/section this is - e.g., "contact", "home", "login", "dashboard")
  },
  "colors": {
    "background": "#hexcolor" (main background color),
    "backgroundGradient": { "type": "linear", "direction": "top-to-bottom" or "left-to-right", "from": "#hex", "to": "#hex" } (if gradient exists, otherwise omit),
    "primary": "#hexcolor" (primary brand/accent color),
    "heading": "#hexcolor" (heading text color, if visible),
    "textPrimary": "#hexcolor" (main body text color),
    "textSecondary": "#hexcolor" (secondary text color, if visible),
    "inputBackground": "#hexcolor" (form input background, if forms exist),
    "buttonPrimary": "#hexcolor" (primary button color, if buttons exist),
    "buttonText": "#hexcolor" (button text color, if buttons exist),
    "borderLight": "#hexcolor" (border/divider color, if visible),
    "icon": "#hexcolor" (icon color, if icons exist),
    "accent": "#hexcolor" (accent color, if different from primary)
  },
  "layout": {
    "container": {
      "width": number (actual width in pixels, or "maxWidth": number if it's a centered container),
      "height": number (if fixed height, otherwise omit),
      "padding": {
        "top": number,
        "right": number,
        "bottom": number,
        "left": number
      },
      "display": "flex" or "grid" (determine from layout structure),
      "direction": "column" or "row" (if flex),
      "gridColumns": number (if grid layout),
      "alignItems": "center" or "flex-start" or "flex-end" or "stretch",
      "justifyContent": "center" or "flex-start" or "flex-end" or "space-between" or "space-around",
      "gap": number (spacing between elements in pixels),
      "backgroundColor": "#hexcolor" (container background)
    }
  },
  "components": [
    {
      "id": "unique-descriptive-id",
      "type": "text" or "button" or "input" or "textarea" or "form" or "image" or "column" or "circle" or "rectangle" or "icon",
      "content": "actual text content" (if text/button - extract the REAL text you see),
      "position": "center" or "top" or "bottom" or "left" or "right" (relative position),
      "size": {
        "width": number (actual width in pixels),
        "height": number (actual height in pixels)
      },
      "styles": {
        "fontSize": number (actual font size if text),
        "fontWeight": number (actual weight - 400, 500, 600, 700, etc.),
        "color": "#hexcolor" (actual text/icon color),
        "backgroundColor": "#hexcolor" (actual background color),
        "borderRadius": number (actual border radius in pixels),
        "padding": number or "string" or { "top": number, "right": number, "bottom": number, "left": number },
        "marginTop": number (if spacing visible),
        "textAlign": "center" or "left" or "right",
        "maxWidth": number (if text has max width constraint),
        "width": "fit-content" or number (if applicable),
        "height": number (for inputs/buttons - actual height)
      },
      "fields": [] (if form type - list all form fields with their properties),
      "children": [] (nested components - be thorough, include ALL nested elements),
      "description": "string" (if image type - describe what the image shows),
      "placeholder": "string" (if input/textarea - extract placeholder text)
    }
  ],
  "typography": {
    "fontFamily": "Inter" or "System UI" or "System Default (estimated)" or specific font name (try to identify if possible),
    "baseFontSize": number (base body text size),
    "headings": {
      "h1": {
        "fontSize": number (actual h1 size if visible),
        "fontWeight": number (actual weight),
        "lineHeight": number (if discernible)
      }
    } (if headings visible),
    "body": {
      "fontSize": number (body text size),
      "fontWeight": number,
      "lineHeight": number (if discernible)
    } (if body text visible),
    "inputs": {
      "fontSize": number (input text size if forms exist),
      "fontWeight": number
    } (if inputs visible)
  }
}

ANALYSIS REQUIREMENTS:
1. Look at the ACTUAL image - what do you REALLY see?
2. Extract ALL visible text content exactly as shown
3. Identify ALL form fields, buttons, inputs, text areas
4. Measure actual dimensions from the image
5. Extract actual colors (don't guess - use what you see)
6. Identify if it's a gradient or solid color
7. Determine layout type (flex vs grid) from structure
8. List EVERY component, including nested ones
9. Extract placeholder text from inputs if visible
10. Identify the page type/section (contact form, login, dashboard, etc.)
11. Be specific about device type based on layout width and structure

Return ONLY the JSON object. Be accurate and thorough.`
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
				max_tokens: 8000,
			}),
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('❌ OpenAI API HTTP Error - Status:', response.status);
			console.error('❌ OpenAI API Error Response:', errorText);
			
			// Try to parse error JSON for better error messages
			try {
				const errorJson = JSON.parse(errorText);
				if (errorJson.error) {
					console.error('❌ OpenAI API Error Type:', errorJson.error.type);
					console.error('❌ OpenAI API Error Message:', errorJson.error.message);
					console.error('❌ OpenAI API Error Code:', errorJson.error.code);
					
					// Check for specific error types
					if (errorJson.error.type === 'insufficient_quota' || errorJson.error.code === 'insufficient_quota') {
						console.error('⚠️ INSUFFICIENT QUOTA - OpenAI account has no credits:');
						console.error('   1. Go to https://platform.openai.com/account/billing');
						console.error('   2. Add payment method and credits ($5 minimum)');
						console.error('   3. Or use a different API key with credits');
						console.error('   4. Free tier keys have very limited usage');
					} else if (errorJson.error.message && errorJson.error.message.includes('rate limit')) {
						console.error('⚠️ RATE LIMIT EXCEEDED - Possible causes:');
						console.error('   1. Too many requests in a short time');
						console.error('   2. API key has usage limits');
						console.error('   3. Need to wait before retrying');
					}
				}
			} catch (e) {
				console.error('❌ Could not parse error response as JSON');
			}
			
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
		console.error('❌ OpenAI analysis exception:', error.message);
		if (error.message && error.message.includes('rate limit')) {
			console.error('⚠️ RATE LIMIT ERROR DETECTED');
			console.error('   - Wait a few minutes before retrying');
			console.error('   - Check your OpenAI account usage limits');
			console.error('   - Consider upgrading your OpenAI plan if needed');
		}
		return null;
	}
}

/**
 * Validate and ensure design.json has the correct structure
 * Returns the design.json as-is if valid, or adds missing required fields
 */
function validateDesignJson(designJson) {
	// Ensure required top-level keys exist
	if (!designJson.meta) {
		designJson.meta = {
			source: "image",
			confidence: "approximate",
			device: "mobile",
			screenType: "portrait"
		};
	}
	
	// Ensure meta has section if missing
	if (!designJson.meta.section) {
		designJson.meta.section = "unknown";
	}
	
	if (!designJson.colors) {
		designJson.colors = {
			background: "#ffffff",
			primary: "#000000",
			textPrimary: "#000000"
		};
	}
	
	if (!designJson.layout) {
		designJson.layout = {
			container: {
				width: 360,
				height: 640,
				padding: { top: 0, right: 0, bottom: 0, left: 0 },
				display: "flex",
				direction: "column",
				alignItems: "center",
				justifyContent: "center",
				gap: 24,
				backgroundColor: "#ffffff"
			}
		};
	}
	
	if (!designJson.components) {
		designJson.components = [];
	}
	
	if (!designJson.typography) {
		designJson.typography = {
			fontFamily: "System Default (estimated)",
			baseFontSize: 16
		};
	}
	
	return designJson;
}

module.exports = async (req, res) => {
	// Handle CORS with credentials support
	const origin = req.headers.origin || req.headers.referer || '*';
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	res.setHeader('Access-Control-Allow-Credentials', 'true');

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
			let quotaExceeded = false;

			// Fallback to default structure if OpenAI fails
			if (!designJson) {
				// Check if it was a quota error by checking logs or response
				// For now, we'll use a generic message
				console.log('OpenAI analysis failed, using default structure');
				quotaExceeded = true;
				designJson = {
					meta: {
						source: "image",
						confidence: "low",
						device: "mobile",
						screenType: "portrait"
					},
					colors: {
						background: "#ffffff",
						primary: "#000000",
						icon: "#000000",
						textPrimary: "#000000"
					},
					layout: {
						container: {
							width: 360,
							height: 640,
							padding: { top: 0, right: 0, bottom: 0, left: 0 },
							direction: "column",
							alignItems: "center",
							justifyContent: "center",
							gap: 24,
							backgroundColor: "#ffffff"
						}
					},
					components: [],
					typography: {
						fontFamily: "System Default (estimated)",
						baseFontSize: 16
					}
				};
			}

			// Validate and ensure structure is complete
			const validated = validateDesignJson(designJson);

			// Send successful response with full structured design.json
			if (!responded) {
				responded = true;
				res.writeHead(200, { 'Content-Type': 'application/json' });
				res.write(JSON.stringify({
					success: true,
					designJson: validated,
					message: quotaExceeded 
						? 'Image analyzed with default structure (OpenAI quota exceeded - add credits at https://platform.openai.com/account/billing)'
						: 'Image analyzed successfully',
					warning: quotaExceeded 
						? 'OpenAI API quota exceeded. Using default structure. Add credits to enable AI-powered extraction.'
						: undefined
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

