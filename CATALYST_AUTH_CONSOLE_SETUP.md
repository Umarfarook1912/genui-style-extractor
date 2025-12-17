# 🔐 Catalyst Console Authentication Setup Guide

## Step-by-Step Instructions

### Step 1: Enable Native Catalyst Authentication

1. **Open Catalyst Console**
   - Go to: https://console.catalyst.zoho.com/
   - Select your project: **genui-backend**

2. **Navigate to Authentication**
   - In the left sidebar, go to: **Cloud Scale** → **SECURITY & IDENTITY** → **Authentication**
   - You should see the Authentication page (as shown in your screenshot)

3. **Set Up Native Catalyst Authentication**
   - Click **"Set Up"** button on the **Native Catalyst Authentication** card
   - Select: **Hosted Login** (Recommended - easier to implement)
   - Click **"Enable"**

### Step 2: Use Hosted Auth URLs (What the Extension Opens)

After enabling **Hosted Login**, Catalyst exposes hosted pages on your domain:

- Login:
   `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/login`
- Signup:
   `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/signup`
- Password reset:
   `https://genui-backend-908193831.development.catalystserverless.com/__catalyst/auth/reset-password`

The extension opens these pages in a popup window. After the user logs in, Catalyst sets a session cookie, and the extension calls APIs using `credentials: 'include'`.

### Step 3: Configure Allowed Origins (CORS)

To allow the extension to call your Catalyst APIs with cookies, add your extension origin to allowed origins.

Add these allowed origins:

```
chrome-extension://YOUR_EXTENSION_ID
https://genui-backend-908193831.development.catalystserverless.com
```

*To get YOUR_EXTENSION_ID: Go to `chrome://extensions/` and find your extension's ID*

Then **Save**.

### Step 4: Add `user_id` Column to Database Table

**CRITICAL: Must do this before testing!**

1. **Navigate to Data Store**
   - Cloud Scale → Storage → **Data Store**
   - Click on **Tables**
   - Find and open **ConversionHistory** table

2. **Go to Schema View**
   - Click **"Schema View"** tab

3. **Add New Column**
   - Click **"+ Add Column"** or **"+ New Column"**
   - Configure the column:
     ```
     Column Name: user_id
     Data Type: BIGINT
     Mandatory: ✅ Yes
     Default Value: 0
     Max Length: (auto)
     ```
   - Click **"Add"** or **"Save"**

4. **Verify Column**
   - You should see `user_id` in your table schema
   - Data Type: BIGINT
   - Default: 0

### Step 5: Test Authentication (Manual)

1. **Create a Test User** (Optional)
   - Go to: **User Management** in Catalyst Console
   - Click **"Add User"**
   - Enter email and password
   - Or use your Zoho account for testing

2. **Test Login Flow**
   - Open the login URL in your browser and sign in
   - Then open the extension and load History
   - If authenticated, History should load without a "Please log in" message

---

## What You'll Get After Setup

### From Catalyst Console:

✅ **Hosted Auth Pages Enabled**:
   - Login / Signup / Reset-password URLs available

✅ **CORS Origins Whitelisted**:
   - `chrome-extension://YOUR_EXTENSION_ID` allowed

✅ **Database Ready**:
   - `user_id` column added to ConversionHistory table
   - Backend functions already deployed with auth support

---

## Configuration Values You'll Need

After completing the setup, provide me with:

1. **Extension ID**: (from `chrome://extensions/`)

Client ID is NOT required when using hosted auth pages.

---

## Quick Checklist

- [ ] Enable Native Catalyst Authentication (Hosted Login)
- [ ] Add allowed origins
- [ ] Add `user_id` column to ConversionHistory table (Data Type: BIGINT, Default: 0)
- [ ] Save all configurations

### Confirm password / email verification

Catalyst doesn't provide a fixed “confirm password preview URL”. Confirmation links are generated per user/token and typically arrive via email.
If you're testing in development, check Catalyst email delivery/logging (or your inbox/spam) for the confirmation link.

---

## ⚠️ Common Issues

**Issue: "Redirect URI mismatch"**
- Solution: Ensure redirect URLs are added exactly as shown, including protocol (https://)

**Issue: "CORS error"**
- Solution: Add chrome-extension://YOUR_EXTENSION_ID to allowed origins

**Issue: "Column user_id not found"**
- Solution: Add the user_id column to ConversionHistory table with BIGINT type

**Issue: "Authentication not working"**
- Solution: Make sure you clicked "Enable" on Native Catalyst Authentication

---

## Next Steps

1. ✅ Complete the setup above
2. ✅ Provide me with your Client ID
3. 🎨 I'll implement the login UI in your extension
4. 🧪 We'll test the complete authentication flow

Ready? Let's get your authentication set up! 🚀
