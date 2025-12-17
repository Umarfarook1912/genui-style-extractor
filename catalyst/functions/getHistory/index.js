'use strict';

const catalyst = require('zcatalyst-sdk-node');

/**
 * Zoho Catalyst Function: getHistory
 * Retrieves conversion history from Datastore
 * Supports pagination and user-specific filtering
 */

/**
 * Get authenticated user ID from Catalyst request
 * @param {Object} catalystApp - Initialized Catalyst app
 * @returns {String|null} User ID or null if not authenticated
 */
async function getAuthenticatedUserId(catalystApp) {
    try {
        const userManagement = catalystApp.userManagement();
        const currentUser = await userManagement.getCurrentUser();
        return currentUser && currentUser.user_id ? String(currentUser.user_id) : null;
    } catch (error) {
        console.log('No authenticated user:', error.message);
        return null;
    }
}

module.exports = (req, res) => {
    // Handle CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle OPTIONS request
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Only handle GET requests
    if (req.method !== 'GET') {
        res.writeHead(405, { 'Content-Type': 'application/json' });
        res.write(JSON.stringify({ error: 'Method not allowed. Use GET.' }));
        res.end();
        return;
    }

    // Parse query parameters
    const url = new URL(req.url, `http://${req.headers.host}`);
    const limit = parseInt(url.searchParams.get('limit')) || 10;
    const offset = parseInt(url.searchParams.get('offset')) || 0;
    const format = url.searchParams.get('format'); // Optional filter

    getConversionHistory(req, limit, offset, format)
        .then(result => {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify(result));
            res.end();
        })
        .catch(error => {
            console.error('Error fetching history:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.write(JSON.stringify({
                error: 'Failed to fetch history',
                message: error.message
            }));
            res.end();
        });
};

/**
 * Fetch conversion history from Datastore
 */
async function getConversionHistory(req, limit, offset, formatFilter) {
    try {
        const catalystApp = catalyst.initialize(req);
        const table = catalystApp.datastore().table('ConversionHistory');

        // Get authenticated user ID
        const userId = await getAuthenticatedUserId(catalystApp);

        if (!userId) {
            // No authentication - return empty results for security
            return {
                success: true,
                data: [],
                pagination: { limit, offset, total: 0, hasMore: false },
                message: 'Please log in to view your conversion history'
            };
        }

        // Get all rows (Catalyst SDK method)
        const result = await table.getAllRows();
        let records = result || [];

        // Filter by user ID (only show current user's conversions)
        records = records.filter(record => String(record.user_id) === String(userId));

        // Get total count
        const total = records.length;

        // Apply pagination
        const paginatedRecords = records.slice(offset, offset + limit);

        // Transform records to match frontend expectations (snake_case keys)
        const conversions = paginatedRecords.map(record => ({
            id: record.ROWID,
            format: record.format,
            // keep original input_styles as stored (stringified JSON)
            input_styles: record.input_styles,
            output_code: record.output_code,
            user_agent: record.user_agent,
            created_time: record.CREATEDTIME
        }));

        return {
            success: true,
            data: conversions,
            pagination: {
                limit,
                offset,
                total,
                hasMore: offset + limit < total
            }
        };

    } catch (error) {
        console.error('Datastore query error:', error);
        throw new Error(`Failed to fetch history: ${error.message}`);
    }
}
