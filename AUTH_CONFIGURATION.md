# 🔐 Zoho Catalyst Authentication Setup

## Prerequisites

Before implementing authentication, you need to configure Catalyst Authentication service.

## Step-by-Step Setup

### 1. Enable Authentication in Catalyst Console

1. Go to: https://console.catalyst.zoho.com/
2. Select: **genui-backend** project
3. Navigate to: **Security & Identity** → **Authentication**
4. Click: **Enable Authentication**

### 2. Configure OAuth Settings

1. In Authentication settings, configure:
   - **Allowed Redirect URLs**: Add these URLs:
     ```
     https://genui-backend-908193831.development.catalystserverless.com/auth/callback
     chrome-extension://YOUR_EXTENSION_ID/auth-callback.html
     ```
     *(Replace YOUR_EXTENSION_ID with your actual extension ID)*

2. **Allowed Origins**: Add:
   ```
   chrome-extension://YOUR_EXTENSION_ID
   ```

3. **Save** the settings

### 3. Get Your Client ID

After enabling authentication, note down:
- **Client ID** (shown in Authentication dashboard)
- **Domain** (your Catalyst domain)

### 4. Update ConversionHistory Table

Add `user_id` column:
1. Go to: Data Store → Tables → ConversionHistory → Schema View
2. Click: **"+ New Column"**
3. Configure:
   - Column Name: `user_id`
   - Data Type: `BIGINT`
   - Mandatory: ✅ Yes
   - Default Value: `0`

### 5. Update Frontend Configuration

You'll need to update `frontend/src/constants/api.ts` with your Client ID:

```typescript
export const ZOHO_AUTH_CONFIG = {
  clientId: 'YOUR_CLIENT_ID_HERE',
  scope: 'ZohoCatalyst.userdetails.READ',
  redirectUri: chrome.runtime.getURL('auth-callback.html'),
  authEndpoint: 'https://accounts.zoho.com/oauth/v2/auth'
};
```

### 6. Deploy Functions

```powershell
cd d:\genui-style-extractor\catalyst
catalyst deploy
```

### 7. Rebuild & Reload Extension

```powershell
cd d:\genui-style-extractor\frontend
npm run build
Copy-Item -Path "..\sigma-package\app\*" -Destination "..\chrome-dev\app\" -Recurse -Force
```

Then reload extension in chrome://extensions/

---

## How Authentication Works

```
User clicks "Login"
    ↓
Extension opens Zoho OAuth page
    ↓
User enters Zoho credentials
    ↓
Zoho redirects to auth-callback.html with auth code
    ↓
Extension exchanges code for access token
    ↓
Token stored in extension storage
    ↓
All API requests include token in headers
    ↓
Functions extract user ID from token
    ↓
Save/retrieve only that user's conversions
```

---

## Security Notes

- ✅ User ID is extracted server-side (cannot be spoofed)
- ✅ Each user can only see their own history
- ✅ Anonymous users (not logged in) get `user_id = 0`
- ✅ Tokens are stored securely in Chrome extension storage
- ✅ HTTPS for all communication

---

## Testing

1. Open extension
2. Click "Login with Zoho"
3. Authenticate with your Zoho account
4. Convert some styles
5. Check history - should only show your conversions
6. Logout and login as different user - history should be different

---

## Troubleshooting

### "Redirect URI mismatch"
→ Make sure redirect URL in Catalyst console matches exactly:
   `chrome-extension://YOUR_EXTENSION_ID/auth-callback.html`

### "Not authenticated" message in history
→ Make sure you're logged in
→ Check if auth token is present in extension storage

### User ID showing as 0
→ Authentication not working
→ Check Catalyst logs for auth errors

---

**Current Status:** 
- ✅ Backend functions updated (auth-ready)
- ⏳ Waiting for: Enable auth in Catalyst console, add user_id column
- ⏳ Next: Update frontend with login UI
