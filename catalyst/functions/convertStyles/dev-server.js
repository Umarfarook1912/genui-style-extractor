/*
 * Local dev server to run the convertStyles function locally
 * Usage:
 *  1. cd catalyst/functions/convertStyles
 *  2. npm install express body-parser
 *  3. npm start
 *
 * This wraps the existing handler exported by index.js and exposes
 * a simple POST /convertStyles endpoint for testing.
 */

const express = require('express');
const bodyParser = require('body-parser');
const handler = require('./index.js');

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

app.post('/convertStyles', async (req, res) => {
    try {
        const requestBody = req.body || {};

        // Minimal Catalyst-like context
        const context = {
            request: {
                body: requestBody,
            },
            response: {
                _status: 200,
                _contentType: 'application/json',
                _body: null,
                setStatus(code) {
                    this._status = code;
                },
                setContentType(type) {
                    this._contentType = type;
                },
                write(payload) {
                    this._body = payload;
                },
            },
            log: console,
        };

        // Call the function handler
        await handler(context, {});

        const status = context.response._status || 200;
        const body = context.response._body || '';
        const contentType = context.response._contentType || 'application/json';

        // If handler wrote a JSON string, send as JSON
        res.status(status).type(contentType).send(body);
    } catch (err) {
        console.error('Dev-server error:', err);
        res.status(500).json({ error: 'dev-server error', message: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('GenUI convertStyles local dev server is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`convertStyles dev server listening at http://localhost:${PORT}`);
});
