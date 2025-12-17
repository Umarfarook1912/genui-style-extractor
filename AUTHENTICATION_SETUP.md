# 🔐 Adding Authentication to GenUI

## Overview

We'll add Zoho authentication so each user can only see their own conversion history.

## Step 1: Update Database Schema

Add `user_id` column to ConversionHistory table:

1. Go to: https://console.catalyst.zoho.com/
2. Navigate to: Data Store → Tables → ConversionHistory → Schema View
3. Click: **"+ New Column"**
4. Add column:
   - **Column Name**: `user_id`
   - **Data Type**: `BIGINT`
   - **Mandatory**: Yes ✅
   - **Unique**: No

## Step 2: Backend Changes (Automated)

The following files will be updated automatically:
- ✅ `convertStyles/index.js` - Extract and save user ID
- ✅ `getHistory/index.js` - Filter by user ID
- ✅ Create auth helper utility

## Step 3: Frontend Changes (Automated)

- ✅ Add Zoho login button
- ✅ Handle authentication state
- ✅ Pass auth token to API calls

## Step 4: Testing

After deployment:
1. Open extension
2. Click "Login with Zoho"
3. Convert some styles
4. Check history - should only show your conversions

---

## Architecture

```
User clicks Login
    ↓
Zoho OAuth (redirects to Zoho login)
    ↓
User authenticates
    ↓
Extension receives auth token
    ↓
All API calls include token
    ↓
Functions extract user ID from token
    ↓
Save/retrieve only that user's data
```

---

**Ready?** 
1. Add the `user_id` column in Catalyst Console first
2. Let me know when done - I'll deploy the updated functions
