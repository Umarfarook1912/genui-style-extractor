'use strict';

const catalyst = require('zcatalyst-sdk-node');

/**
 * Zoho Catalyst Function: getUserInfo
 * Returns current authenticated user information
 */

module.exports = async (req, res) => {
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
        res.end(JSON.stringify({
            status: 'error',
            message: 'Method not allowed. Use GET.'
        }));
        return;
    }

    try {
        const catalystApp = catalyst.initialize(req);

        // Get current authenticated user
        const userManagement = catalystApp.userManagement();
        const currentUser = await userManagement.getCurrentUser();

        console.log('📦 getUserInfo - Raw user object:', JSON.stringify(currentUser, null, 2));

        if (!currentUser) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                status: 'error',
                message: 'Not authenticated. Please log in.'
            }));
            return;
        }

        // Extract user information with all possible field mappings
        const userInfo = {
            user_id: currentUser.user_id || currentUser.id || currentUser.zaaid || currentUser.ROWID,
            email: currentUser.email_id || currentUser.email || currentUser.Email,
            first_name: currentUser.first_name || currentUser.First_Name || currentUser.firstname,
            last_name: currentUser.last_name || currentUser.Last_Name || currentUser.lastname,
            display_name: currentUser.display_name || currentUser.Display_Name,
            name: currentUser.name || currentUser.Name,
            org_id: currentUser.org_id || currentUser.Org_ID,
            zuid: currentUser.zuid || currentUser.ZUID,
            created_time: currentUser.created_time || currentUser.Created_Time,
            role_details: currentUser.role_details,
            // Include raw user object for debugging
            _raw: currentUser
        };

        console.log('✅ getUserInfo - Processed user info:', JSON.stringify(userInfo, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'success',
            data: userInfo
        }));

    } catch (error) {
        console.error('❌ getUserInfo - Error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'error',
            message: 'Failed to retrieve user information',
            error: error.message
        }));
    }
};
