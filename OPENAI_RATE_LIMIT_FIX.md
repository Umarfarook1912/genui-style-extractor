# 🔧 Fix OpenAI Rate Limit Issues

## Current Issue

Getting "rate limit exceeded" errors even with a new API key.

## Possible Causes

1. **API Key Not Properly Set in Catalyst**
   - Environment variable might not be loaded
   - Key might be set incorrectly

2. **Rate Limits on API Key**
   - Free tier has strict limits
   - Too many requests in short time
   - Account-level rate limits

3. **Multiple Concurrent Requests**
   - Multiple users testing simultaneously
   - Retry attempts causing more requests

## Solutions

### Step 1: Verify API Key is Set in Catalyst

1. **Go to Catalyst Console:**
   - https://console.catalyst.zoho.com/
   - Select project: **genui-backend**

2. **Check Environment Variables:**
   - Go to: **Functions** → **analyzeImage**
   - Look for **Environment Variables** section
   - Verify `OPENAI_API_KEY` is set with your API key
   - Get your key from: https://platform.openai.com/api-keys

3. **If Not Set:**
   - Click **Add Environment Variable**
   - Key: `OPENAI_API_KEY`
   - Value: (paste the key above)
   - Click **Save**

4. **Redeploy Function:**
   ```bash
   cd catalyst
   catalyst deploy
   ```

### Step 2: Check OpenAI Account Limits

1. **Go to OpenAI Dashboard:**
   - https://platform.openai.com/usage
   - Check your usage and limits

2. **Rate Limits:**
   - Free tier: ~3 requests/minute
   - Paid tier: Higher limits
   - Check if you've exceeded limits

3. **If Rate Limited:**
   - Wait 1-2 minutes before retrying
   - Consider upgrading plan if needed
   - Check billing/usage page for details

### Step 3: Add Request Throttling (Optional)

If you're making too many requests, we can add:
- Request queuing
- Rate limiting on our side
- Retry with exponential backoff

### Step 4: Verify Function Logs

Check Catalyst function logs to see:
1. Is API key being loaded? (should see "✅ OpenAI API key found")
2. What's the exact error message?
3. Is it rate limit or another error?

## Testing

1. **Wait 2-3 minutes** (if rate limited)
2. **Upload one image** (don't spam requests)
3. **Check logs** in Catalyst Console
4. **Verify** the API key is being used

## Error Messages to Look For

- **"rate_limit_exceeded"** → Wait and retry
- **"invalid_api_key"** → Check API key is correct
- **"insufficient_quota"** → Check OpenAI billing
- **"model_not_found"** → Model name issue (should be fixed now)

## Quick Checklist

- [ ] API key set in Catalyst environment variables
- [ ] Function redeployed after setting key
- [ ] Waited 2-3 minutes if rate limited
- [ ] Checked OpenAI account usage/limits
- [ ] Only making one request at a time
- [ ] Checked Catalyst function logs for details

## Next Steps

After verifying the API key is set:
1. Wait a few minutes
2. Try uploading one image
3. Check the logs to see what error you get
4. Share the exact error message if it persists

