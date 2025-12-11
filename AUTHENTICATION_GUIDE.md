# 🔐 Adding Catalyst Authentication (Optional Enhancement)

This guide shows how to add user authentication to GenUI using Catalyst Auth.

---

## 🎯 Why Add Authentication?

With authentication, you can:

✅ Let users log in and save their preferences  
✅ Store design tokens per user  
✅ Track user's conversion history  
✅ Sync settings across devices  
✅ Provide personalized experience  

---

## 📋 Prerequisites

Before adding auth:
- [ ] Basic Catalyst integration working
- [ ] Functions deployed successfully
- [ ] Chrome extension communicating with Catalyst

---

## 🚀 Phase 1: Enable Authentication in Catalyst

### Step 1: Navigate to Project

```powershell
cd d:\genui-style-extractor\catalyst
```

### Step 2: Enable Authentication

```powershell
catalyst auth:create
```

When prompted:
- **Authentication Type:** Choose **"OAuth 2.0"**
- **Provider:** Choose **"Zoho"** (recommended)
- **Redirect URL:** `https://YOUR_EXTENSION_ID.chromiumapp.org/`

### Step 3: Get Client Credentials

After setup, you'll receive:
- **Client ID**
- **Client Secret**

**📝 SAVE THESE!** You'll need them in your extension.

---

## 🔧 Phase 2: Update Chrome Extension

### Step 1: Add Identity Permission

Update `chrome-dev/manifest.json`:

```json
{
  "permissions": [
    "scripting",
    "activeTab",
    "tabs",
    "windows",
    "storage",
    "identity"
  ],
  "oauth2": {
    "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
    "scopes": ["https://www.zohoapis.com/catalyst/all"]
  }
}
```

### Step 2: Create Auth Service

Create `chrome-dev/auth-service.js`:

```javascript
class AuthService {
  constructor() {
    this.token = null;
    this.user = null;
  }

  async login() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({ interactive: true }, (token) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
        } else {
          this.token = token;
          this.getUserInfo()
            .then(user => {
              this.user = user;
              resolve({ token, user });
            })
            .catch(reject);
        }
      });
    });
  }

  async logout() {
    if (!this.token) return;

    return new Promise((resolve) => {
      chrome.identity.removeCachedAuthToken({ token: this.token }, () => {
        this.token = null;
        this.user = null;
        resolve();
      });
    });
  }

  async getUserInfo() {
    if (!this.token) throw new Error('Not authenticated');

    const response = await fetch(
      'https://www.zohoapis.com/catalyst/v1/user/me',
      {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      }
    );

    if (!response.ok) {
      throw new Error('Failed to get user info');
    }

    return await response.json();
  }

  isAuthenticated() {
    return !!this.token;
  }
}

const authService = new AuthService();
```

### Step 3: Update Popup UI

Add login button to `popup.html`:

```html
<div id="auth-section">
  <button id="login-btn">Login with Zoho</button>
  <button id="logout-btn" style="display: none;">Logout</button>
  <span id="user-name"></span>
</div>
```

Add event listeners:

```javascript
document.getElementById('login-btn').addEventListener('click', async () => {
  try {
    const { user } = await authService.login();
    updateAuthUI(user);
  } catch (error) {
    console.error('Login failed:', error);
  }
});

document.getElementById('logout-btn').addEventListener('click', async () => {
  await authService.logout();
  updateAuthUI(null);
});

function updateAuthUI(user) {
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');
  const userName = document.getElementById('user-name');

  if (user) {
    loginBtn.style.display = 'none';
    logoutBtn.style.display = 'inline-block';
    userName.textContent = `Hello, ${user.name}`;
  } else {
    loginBtn.style.display = 'inline-block';
    logoutBtn.style.display = 'none';
    userName.textContent = '';
  }
}
```

---

## 💾 Phase 3: Add Data Storage (Save User Preferences)

### Step 1: Create Data Store Table

```powershell
catalyst datastore:create
```

When prompted:
- **Table Name:** `user_preferences`
- **Columns:**
  - `user_id` (String, Primary Key)
  - `default_format` (String) - 'css', 'tailwind', or 'jsx'
  - `use_rem` (Boolean)
  - `theme` (String)
  - `saved_tokens` (JSON)

### Step 2: Create Preference Function

Create `catalyst/functions/savePreferences/index.js`:

```javascript
const catalyst = require('zcatalyst-sdk-node');

module.exports = async (context) => {
  try {
    const app = catalyst.initialize(context);
    const datastore = app.datastore();
    const table = datastore.table('user_preferences');

    const { userId, preferences } = context.request.body;

    // Upsert preferences
    const result = await table.insertRow({
      user_id: userId,
      ...preferences
    });

    context.response.setStatus(200);
    context.response.write(JSON.stringify({
      success: true,
      data: result
    }));

  } catch (error) {
    context.response.setStatus(500);
    context.response.write(JSON.stringify({
      error: error.message
    }));
  }
};
```

Deploy:
```powershell
catalyst deploy
```

---

## 🧪 Testing Authentication

### Test 1: Login Flow

1. Open extension popup
2. Click "Login with Zoho"
3. Authenticate in browser
4. Verify user name appears

### Test 2: Save Preferences

1. Change format to Tailwind
2. Extract a style
3. Logout and login again
4. Verify Tailwind is still selected

### Test 3: Data Sync

Check Catalyst dashboard:
**Data Store → user_preferences**

You should see user entries!

---

## 🎨 Enhanced Features with Auth

### 1. Save Design Tokens

```javascript
async function saveDesignToken(token) {
  if (!authService.isAuthenticated()) {
    alert('Please login to save tokens');
    return;
  }

  await fetch(`${CATALYST_CONFIG.functionUrl}/saveToken`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authService.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: authService.user.id,
      token: token
    })
  });
}
```

### 2. History Tracking

Track all conversions:

```javascript
async function saveConversionHistory(styles, converted) {
  if (!authService.isAuthenticated()) return;

  await fetch(`${CATALYST_CONFIG.functionUrl}/saveHistory`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${authService.token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      userId: authService.user.id,
      styles,
      converted,
      timestamp: new Date().toISOString()
    })
  });
}
```

---

## 📊 Analytics Dashboard (Bonus)

Create a web dashboard to show:
- Total conversions
- Popular formats
- Saved design tokens
- Conversion history

Deploy on Catalyst static hosting:
```powershell
catalyst static:deploy --folder ./dashboard
```

---

## ✅ Authentication Checklist

- [ ] Enabled Catalyst Auth
- [ ] Got OAuth credentials
- [ ] Updated manifest.json
- [ ] Created auth-service.js
- [ ] Added login/logout UI
- [ ] Created data store tables
- [ ] Deployed preference functions
- [ ] Tested login flow
- [ ] Verified data storage

---

## 🔒 Security Best Practices

1. **Never expose Client Secret in extension code**
2. **Use HTTPS for all API calls**
3. **Validate tokens on server side**
4. **Implement proper CORS policies**
5. **Encrypt sensitive user data**

---

## 📚 References

- **Catalyst Auth Docs:** https://catalyst.zoho.com/help/authentication
- **Chrome Identity API:** https://developer.chrome.com/docs/extensions/reference/identity/
- **OAuth 2.0 Flow:** https://oauth.net/2/

---

## 💡 When to Add Auth?

**Add authentication when:**
- ✅ Basic conversion features work perfectly
- ✅ You want to offer user-specific features
- ✅ You need to track usage per user
- ✅ You want to build a community around GenUI

**Skip authentication if:**
- ❌ Just testing basic functionality
- ❌ Building MVP for hackathon demo
- ❌ Want to keep things simple

---

For now, **focus on getting basic Catalyst integration working first!**

Use `QUICKSTART_CATALYST.md` to set up the core features.

Add authentication later as an enhancement! 🚀
