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

        console.log('🔵 getHistory - Current user object:', JSON.stringify(currentUser));

        // Try multiple possible fields for user ID  
        const userId = currentUser?.user_id || currentUser?.id || currentUser?.zaaid || currentUser?.ROWID;

        if (userId) {
            console.log('🔵 getHistory - Extracted user ID:', userId, 'Type:', typeof userId);
            return String(userId);
        }

        console.log('⚠️ getHistory - No user ID found in current user object');
        return null;
    } catch (error) {
        console.log('No authenticated user:', error.message);
        return null;
    }
}

module.exports = (req, res) => {
    // Handle CORS with credentials support
    const origin = req.headers.origin || req.headers.referer || '*';
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

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
    const returnUserInfo = url.searchParams.get('userInfo') === 'true'; // Return user info if requested

    getConversionHistory(req, limit, offset, format, returnUserInfo)
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
async function getConversionHistory(req, limit, offset, formatFilter, returnUserInfo = false) {
    try {
        // Fetch conversion history and optional user info

        const catalystApp = catalyst.initialize(req);
        const table = catalystApp.datastore().table('ConversionHistory');

        // Get authenticated user ID
        const userId = await getAuthenticatedUserId(catalystApp);

        // Get user information if requested
        let userInfo = null;
        if (returnUserInfo) {
            try {
                const userManagement = catalystApp.userManagement();
                const currentUser = await userManagement.getCurrentUser();

                if (currentUser) {
                    userInfo = {
                        user_id: currentUser.user_id || currentUser.id || currentUser.zaaid || currentUser.ROWID,
                        email: currentUser.email_id || currentUser.email || currentUser.Email,
                        first_name: currentUser.first_name || currentUser.First_Name || currentUser.firstname,
                        last_name: currentUser.last_name || currentUser.Last_Name || currentUser.lastname,
                        display_name: currentUser.display_name || currentUser.Display_Name,
                        name: currentUser.name || currentUser.Name,
                        org_id: currentUser.org_id || currentUser.Org_ID,
                        zuid: currentUser.zuid || currentUser.ZUID,
                        created_time: currentUser.created_time || currentUser.Created_Time
                    };
                }
            } catch (err) {
                console.log('Could not fetch user info:', err.message);
            }
        }

        // For development: Show all records if no user is authenticated
        // In production, you might want to restrict this
        const showAllRecords = !userId; // Show all if not authenticated (for testing)

        console.log('🔵 Fetching rows from datastore...');

        // Get all rows (Catalyst SDK method)
        const result = await table.getAllRows();
        console.log('🔵 Datastore result type:', typeof result);
        console.log('🔵 Datastore result:', result);

        let records = result || [];

        // If result is an object with data property, extract it
        if (result && typeof result === 'object' && Array.isArray(result.data)) {
            records = result.data;
        } else if (Array.isArray(result)) {
            records = result;
        } else {
            console.log('⚠️ Unexpected result format:', result);
            records = [];
        }

        console.log('🔵 Total records fetched:', records.length);

        // Filter by CREATORID only if authenticated (CREATORID is automatically set by Catalyst)
        if (userId && !showAllRecords) {
            console.log('🔵 Filtering by CREATORID:', userId);
            records = records.filter(record => String(record.CREATORID) === String(userId));
            console.log('🔵 Records after user filter:', records.length);
        }

        // Apply format filter if provided
        if (formatFilter) {
            records = records.filter(record => record.format === formatFilter);
            // Apply format filter if provided
        }

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

        const response = {
            success: true,
            data: conversions,
            pagination: {
                limit,
                offset,
                total,
                hasMore: offset + limit < total
            }
        };

        // Include user info if requested
        if (returnUserInfo && userInfo) {
            response.userInfo = userInfo;
        }

        return response;

    } catch (error) {
        console.error('Datastore query error:', error);
        throw new Error(`Failed to fetch history: ${error.message || String(error)}`);
    }
}
