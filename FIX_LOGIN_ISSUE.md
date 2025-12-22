# 🔧 Fix: "Page doesn't exist" Login Error

## Problem

When clicking "Login", you see a "page doesn't exist" error because Catalyst's hosted authentication pages aren't enabled.

## Solution: Enable Catalyst Hosted Authentication

### Step 1: Enable Native Catalyst Authentication

1. **Go to Catalyst Console:**
   - Visit: https://console.catalyst.zoho.com/
   - Select your project: **genui-backend**

2. **Navigate to Authentication:**
   - Go to: **Cloud Scale** → **SECURITY & IDENTITY** → **Authentication**
   - You should see a card for **"Native Catalyst Authentication"**

3. **Enable Hosted Login:**
   - Click **"Set Up"** button on the **Native Catalyst Authentication** card
   - Select: **Hosted Login** (Recommended)
   - Click **"Enable"**

4. **Wait for Activation:**
   - Catalyst will set up the hosted auth pages
   - This usually takes 1-2 minutes

### Step 2: Verify Auth Pages Are Available

After enabling, these URLs should work:
- ✅ `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/login`
- ✅ `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/signup`
- ✅ `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/reset-password`

### Step 3: Configure CORS (If Needed)

If you get CORS errors after enabling:

1. In **Authentication** settings, find **Allowed Origins**
2. Add your extension origin:
   ```
   chrome-extension://YOUR_EXTENSION_ID
   ```
   *(Get your extension ID from `chrome://extensions/`)*
3. Click **Save**

### Step 4: Test Login

1. **Reload the extension** in Chrome (`chrome://extensions/` → Reload)
2. **Click "Login"** in the extension
3. **You should now see** the Catalyst login page (not the error page)

## Alternative: Temporary Workaround

If you can't enable hosted auth right now, you can temporarily disable authentication:

**Option 1: Skip Auth Check**
- Modify `useAuth.ts` to always return `isAuthenticated: true` for testing

**Option 2: Use Direct API Access**
- The functions work without auth (they just won't filter by user)

## What Happens After Enabling

✅ Login button opens Catalyst's hosted login page  
✅ Users can sign up / log in  
✅ Session cookies are set automatically  
✅ Extension can call APIs with `credentials: 'include'`  
✅ User-specific data is stored with `user_id`  

## Still Having Issues?

1. **Check Catalyst Console:**
   - Make sure "Native Catalyst Authentication" shows as "Enabled"
   - Check if there are any error messages

2. **Check Extension Logs:**
   - Open Chrome DevTools (F12)
   - Check Console for errors
   - Look for CORS or authentication errors

3. **Verify URLs:**
   - Try opening the login URL directly in a browser
   - Should show a login form, not an error page

---

**Quick Checklist:**
- [ ] Enabled "Native Catalyst Authentication" in Catalyst Console
- [ ] Selected "Hosted Login" option
- [ ] Waited for activation (1-2 minutes)
- [ ] Added extension origin to CORS (if needed)
- [ ] Reloaded extension
- [ ] Tested login button

