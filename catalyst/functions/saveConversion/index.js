'use strict';

const catalyst = require('zcatalyst-sdk-node');

/**
 * Zoho Catalyst Function: saveConversion
 * Saves style conversion to Datastore
 */

/**
 * Get authenticated user ID from Catalyst request
 */
async function getAuthenticatedUserId(catalystApp) {
    try {
        const userManagement = catalystApp.userManagement();
        const currentUser = await userManagement.getCurrentUser();

        console.log('🔵 saveConversion - Current user:', JSON.stringify(currentUser));

        const userId = currentUser?.user_id || currentUser?.id || currentUser?.zaaid;

        if (userId) {
            console.log('🔵 saveConversion - Extracted user ID:', userId);
            return String(userId);
        }

        console.log('⚠️ saveConversion - No user ID found');
        return null;
    } catch (error) {
        console.log('❌ saveConversion - No authenticated user:', error.message);
        return null;
    }
}

module.exports = (req, res) => {
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

    req.on('data', chunk => {
        body += chunk.toString();
    });

    req.on('end', async () => {
        if (responded) return;

        try {
            const requestBody = JSON.parse(body);
            const { styles, format, output_code, user_agent } = requestBody;

            if (!styles || !format || !output_code) {
                responded = true;
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({
                    success: false,
                    error: 'Missing required fields: styles, format, output_code'
                }));
                res.end();
                return;
            }

            console.log('🔵 saveConversion: Starting save operation...');

            const catalystApp = catalyst.initialize(req);
            const table = catalystApp.datastore().table('ConversionHistory');

            // Get authenticated user ID (required)
            const userId = await getAuthenticatedUserId(catalystApp);

            if (!userId) {
                responded = true;
                res.writeHead(401, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({
                    success: false,
                    error: 'User not authenticated'
                }));
                res.end();
                return;
            }

            // Prepare row data (CREATORID will be automatically set by Catalyst)
            const rowData = {
                format: format,
                input_styles: JSON.stringify(styles),
                output_code: output_code,
                user_agent: user_agent || 'Unknown'
            };

            console.log('🔵 saveConversion: Inserting row...');

            // Insert the row
            const result = await table.insertRows([rowData]);

            console.log('✅ saveConversion: Save successful:', JSON.stringify(result));

            responded = true;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({
                success: true,
                message: 'Conversion saved successfully',
                data: result
            }));
            res.end();

        } catch (error) {
            console.error('❌ saveConversion error:', error);

            if (!responded) {
                responded = true;
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.write(JSON.stringify({
                    success: false,
                    error: 'Failed to save conversion',
                    message: error.message
                }));
                res.end();
            }
        }
    });

    req.on('error', err => {
        console.error('Request error:', err);
        if (!responded) {
            responded = true;
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({ error: 'Request error', message: err.message }));
            res.end();
        }
    });
};
