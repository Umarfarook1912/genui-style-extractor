# 🚀 Quick Start: Enable Authentication (3 Steps)

## What I've Done ✅

I've implemented **complete authentication** for your GenUI extension:

- ✅ Login page with "Sign in with Zoho" button
- ✅ Protected app (must login to use)
- ✅ User email displayed in header
- ✅ Logout functionality
- ✅ History tab (shows only your conversions)
- ✅ Backend filters data by user_id
- ✅ All API calls include auth tokens

---

## What You Need To Do 📋

### Step 1: Enable Authentication in Catalyst Console (5 minutes)

Looking at your screenshot, click **"Set Up"** on **Native Catalyst Authentication**:

1. ✅ **Open:** https://console.catalyst.zoho.com/ → Your Project → **Authentication**
2. ✅ **Click:** "Set Up" on **Native Catalyst Authentication** card
3. ✅ **Select:** **Hosted Login** (the recommended option)
4. ✅ **Enable** authentication
5. ✅ **Copy** the **Client ID** it generates (looks like: `1000.XXXXX...`)

### Step 2: Add `user_id` Column to Database (2 minutes)

**⚠️ CRITICAL - Without this, conversions won't save!**

1. ✅ Go to: **Data Store** → **Tables** → **ConversionHistory**
2. ✅ Click: **Schema View** tab
3. ✅ Click: **"+ Add Column"** button
4. ✅ Fill in:
   - Column Name: `user_id`
   - Data Type: `BIGINT`
   - Mandatory: ✅ Yes
   - Default Value: `0`
5. ✅ Click **Save**

### Step 3: Update Code with Your Client ID (1 minute)

After you complete Step 1 and get your Client ID:

**Tell me your Client ID and I'll update the code for you!**

Or update it yourself:

```powershell
# Open this file:
code d:\genui-style-extractor\frontend\src\hooks\useAuth.ts

# Line 20 - Replace this:
const CLIENT_ID = '__PLACEHOLDER_CLIENT_ID__';

# With your actual Client ID:
const CLIENT_ID = '1000.XXXXXXXXXXXXXXXXXXXXXXXXXX';
```

Then rebuild:

```powershell
cd d:\genui-style-extractor\frontend
npm run build
```

Then reload extension in Chrome: `chrome://extensions/` → Find GenUI → Click Reload (🔄)

---

## 🎯 After Setup - How It Works

### User Opens Extension:

1. **First time:** Sees login page with "Sign in with Zoho" button
2. **Clicks button:** Opens OAuth window, login with Zoho
3. **After login:** Extension unlocks, shows user email in header
4. **Uses features:** Convert styles, view history (only their conversions)
5. **Next time:** Automatically logged in (token saved)

### What You'll See:

```
┌─────────────────────────────────────────┐
│  🎨 GenUI                     👤 you@mail │
│  Extract styles, generate code  [Logout] │
├─────────────────────────────────────────┤
│  [✨ Convert Styles]  [📜 History]        │
├─────────────────────────────────────────┤
│                                         │
│  Your conversion history appears here    │
│  • Only YOUR conversions                │
│  • Click to expand details              │
│  • Color-coded by format                │
│                                         │
└─────────────────────────────────────────┘
```

---

## 📸 Based on Your Screenshot

Looking at your screenshot, I can see:

✅ You're already in the **Authentication** section of Catalyst Console  
✅ You need to click **"Set Up"** on the **Native Catalyst Authentication** card  
✅ Choose **Hosted Login** (it's easier than Embedded Login)  
✅ This will generate a Client ID for you

---

## 🆘 Quick Help

**Question:** Where do I configure redirect URLs?

**Answer:** After enabling authentication in Step 1, you'll see OAuth settings. Add:
- Redirect URL: `https://genui-backend-908193831.development.catalystserverless.com/app/auth/callback`
- Allowed Origin: `chrome-extension://YOUR_EXTENSION_ID` (get from chrome://extensions/)

**Question:** What if I don't want to add redirect URLs yet?

**Answer:** The login will work via Catalyst's default flow. You can add redirect URLs later for a smoother experience.

**Question:** Can I test without authentication first?

**Answer:** No - I've made authentication **required**. Without it, the extension will only show the login page. This is what you requested: *"when user open extension then need to login"*

---

## ✅ Ready?

1. Complete Step 1 & 2 in Catalyst Console (7 minutes)
2. Send me your **Client ID** from Step 1
3. I'll rebuild the extension with your Client ID
4. You'll reload in Chrome and test!

**Let me know when you've completed Steps 1 & 2, and share your Client ID!** 🚀
