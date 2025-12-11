'use strict';

const catalyst = require('zcatalyst-sdk-node');

/**
 * Zoho Catalyst Function: getHistory
 * Retrieves conversion history from Datastore
 * Supports pagination
 */

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

        // Get all rows (Catalyst SDK method)
        const result = await table.getAllRows();
        let records = result || [];

        // Filter by format if specified
        if (formatFilter) {
            records = records.filter(record => record.format === formatFilter);
        }

        // Sort by creation time (most recent first)
        records.sort((a, b) => new Date(b.CREATEDTIME) - new Date(a.CREATEDTIME));

        // Get total count
        const total = records.length;

        // Apply pagination
        const paginatedRecords = records.slice(offset, offset + limit);

        // Transform records for frontend
        const conversions = paginatedRecords.map(record => ({
            id: record.ROWID,
            format: record.format,
            inputStyles: JSON.parse(record.input_styles),
            outputCode: record.output_code,
            userAgent: record.user_agent,
            createdAt: record.CREATEDTIME
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
