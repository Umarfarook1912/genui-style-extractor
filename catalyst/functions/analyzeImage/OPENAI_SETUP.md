# OpenAI API Key Setup for analyzeImage Function

## Setting the API Key in Catalyst Console

1. **Go to Catalyst Console:**
   - Visit: https://catalyst.zoho.com
   - Navigate to your project: `genui-backend`

2. **Set Environment Variable:**
   - Go to **Functions** → **analyzeImage**
   - Click on **Settings** or **Environment Variables**
   - Add a new environment variable:
     - **Key:** `OPENAI_API_KEY`
   - Save the changes

3. **Redeploy the Function:**
   - After setting the environment variable, redeploy the function:
   ```bash
   cd catalyst
   catalyst deploy
   ```

## Alternative: Using Catalyst CLI (if available)

If your Catalyst CLI version supports it:
```bash
cd catalyst
catalyst env:set OPENAI_API_KEY=""
```

## Local Testing

For local testing, you can create a `.env` file (but **NEVER commit it to git**):

```bash
# In catalyst/functions/analyzeImage/
echo "" > .env
```

Then load it in your local test server (you'll need to modify `local_test_server.js` to load dotenv).

## Security Notes

⚠️ **IMPORTANT:**
- Never commit API keys to version control
- The API key is already exposed in this file - consider rotating it after setup
- Use Catalyst's environment variable system for production
- Keep the key secure and rotate it periodically

## Verification

After setting the key, test the function:
1. Upload an image through the frontend
2. Check the Catalyst function logs to see if OpenAI API is being called
3. Verify that design.json is generated with accurate design tokens

