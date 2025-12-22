# 🔐 Enable Catalyst Authentication - Quick Fix

## ❌ Current Issue

You're seeing "page doesn't exist" because **Catalyst Hosted Authentication** isn't enabled yet.

## ✅ Solution: Enable in Catalyst Console

### Step 1: Open Catalyst Console

1. Go to: **https://console.catalyst.zoho.com/**
2. Select your project: **genui-backend**

### Step 2: Navigate to Authentication

1. In the left sidebar, click: **Cloud Scale**
2. Click: **SECURITY & IDENTITY**
3. Click: **Authentication**

### Step 3: Enable Native Catalyst Authentication

1. You should see a card titled **"Native Catalyst Authentication"**
2. Click the **"Set Up"** button on that card
3. Select: **Hosted Login** (Recommended - easier to use)
4. Click **"Enable"**
5. **Wait 1-2 minutes** for Catalyst to activate the pages

### Step 4: Verify It's Working

After enabling, test the login URL directly in your browser:

```
https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/login
```

**Expected:** You should see a login form (not the "page doesn't exist" error)

### Step 5: Configure CORS (Important!)

1. Still in **Authentication** settings
2. Find **"Allowed Origins"** or **"CORS Settings"**
3. Add your Chrome extension origin:
   ```
   chrome-extension://YOUR_EXTENSION_ID
   ```
   *(To get your extension ID: Go to `chrome://extensions/` and find your extension's ID)*
4. Also add:
   ```
   https://genui-backend-908193831.development.catalystserverless.com
   ```
5. Click **Save**

### Step 6: Test in Extension

1. **Reload the extension** in Chrome:
   - Go to `chrome://extensions/`
   - Find "GenUI - Style Extractor"
   - Click the reload icon (🔄)

2. **Click "Login"** in the extension
3. **You should now see** the Catalyst login page (not the error!)

## 🎯 What You'll See After Enabling

✅ Login page: `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/login`  
✅ Signup page: `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/signup`  
✅ Reset password: `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/reset-password`  

## ⚠️ Still Seeing "Page doesn't exist"?

1. **Double-check** that you clicked "Enable" (not just "Set Up")
2. **Wait a bit longer** - activation can take 2-3 minutes
3. **Refresh** the Catalyst Console page
4. **Verify** the status shows "Enabled" (not "Set Up")

## 📝 Quick Checklist

- [ ] Opened Catalyst Console
- [ ] Navigated to Authentication
- [ ] Clicked "Set Up" on Native Catalyst Authentication
- [ ] Selected "Hosted Login"
- [ ] Clicked "Enable"
- [ ] Waited 1-2 minutes for activation
- [ ] Added extension origin to CORS
- [ ] Tested login URL in browser (should show login form)
- [ ] Reloaded extension in Chrome
- [ ] Tested login button in extension

## 🚀 After This Works

Once authentication is enabled:
- Users can sign up / log in
- Session cookies work automatically
- Extension can access protected APIs
- User-specific data is stored correctly

---

**Need help?** Check the logs in Catalyst Console → Functions → analyzeImage → Logs to see if there are any errors.


