# 🔑 OpenAI API Key Setup

## Your API Key

**⚠️ Get your API key from:** https://platform.openai.com/api-keys

Replace `YOUR_OPENAI_API_KEY_HERE` below with your actual key.

```
YOUR_OPENAI_API_KEY_HERE
```

## ⚡ Quick Setup Steps

### Option 1: Catalyst Console (Recommended for Production)

1. **Login to Catalyst Console:**
   - Go to: https://catalyst.zoho.com
   - Navigate to your project: **genui-backend**

2. **Set Environment Variable:**
   - Go to **Functions** → Select **analyzeImage** function
   - Look for **Environment Variables** or **Settings** section
   - Click **Add Environment Variable**
   - **Key:** `OPENAI_API_KEY`
   - **Value:** (paste the key above)
   - Click **Save**

3. **Redeploy Function:**
   ```bash
   cd catalyst
   catalyst deploy
   ```

### Option 2: Local Testing

For local testing, create a `.env` file in `catalyst/functions/analyzeImage/`:

```bash
cd catalyst/functions/analyzeImage
echo "OPENAI_API_KEY=YOUR_OPENAI_API_KEY_HERE" > .env
```

Then run the local test server:
```bash
node local_test_server.js
```

Or pass the key as an argument:
```bash
node local_test_server.js "YOUR_OPENAI_API_KEY_HERE"
```

## ✅ Verification

After setting up:

1. **Test via Frontend:**
   - Upload an image through the app
   - Check if design.json is generated with accurate tokens
   - Verify it's not using fallback heuristics

2. **Check Logs:**
   - In Catalyst console, check function logs
   - Should see OpenAI API calls (not "using fallback")

## 🔒 Security Notes

- ✅ `.env` files are already in `.gitignore`
- ⚠️ **Never commit API keys to git**
- 🔄 Consider rotating the key periodically
- 🛡️ Use Catalyst environment variables for production (not hardcoded)

## 📝 What This Enables

With the OpenAI API key configured:
- ✅ AI-powered design token extraction from images
- ✅ More accurate color, typography, and spacing detection
- ✅ Better layout property recognition
- ✅ Fallback to heuristics if API is unavailable

