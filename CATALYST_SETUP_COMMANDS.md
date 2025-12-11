# 🎯 Catalyst Setup - Step-by-Step Commands

Follow these commands in order to set up GenUI with Catalyst.

---

## 📦 Prerequisites Check

```powershell
# Check Node.js version (should be 14+)
node --version

# Check npm version
npm --version

# Navigate to project
cd d:\genui-style-extractor
```

---

## 🔧 Step 1: Install Catalyst CLI

```powershell
# Install Catalyst CLI globally
npm install -g zcatalyst-cli

# Verify installation
catalyst --version
```

Expected output: `Catalyst CLI version X.X.X`

---

## 🔐 Step 2: Login to Catalyst

```powershell
# Login (this will open browser)
catalyst login
```

Follow the browser prompts to authenticate with your Zoho account.

---

## 🏗️ Step 3: Initialize Catalyst Project

**IMPORTANT:** You already have a `catalyst/` folder, so we'll use it.

```powershell
# Navigate to catalyst folder
cd catalyst

# Initialize the project
catalyst init

# Set active project for this directory
catalyst project:use
```

When prompted for `catalyst init`:
- Choose **"Link to existing project"**
- **Select project:** Choose the project you created in dashboard (e.g., `genui-backend`)
- **Environment:** Select `Development`

When prompted for `catalyst project:use`:
- **Select project:** Choose `genui-backend`

---

## 📤 Step 4: Deploy Functions to Catalyst

```powershell
# Make sure you're in catalyst folder
cd d:\genui-style-extractor\catalyst

# Deploy all functions
catalyst deploy
```

This will upload your `convertStyles` function to Catalyst cloud.

Expected output:
```
✓ Deploying functions...
✓ convertStyles deployed successfully
```

---

## 🌐 Step 5: Get Your Function URL

```powershell
# Get deployment information
catalyst serve:info
```

You'll see something like:
```
Function URL: https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles_function/convertStyles
```

**COPY THIS URL!** You'll need it in Step 6.

---

## 🔗 Step 6: Update Chrome Extension Configuration

Create a config file for your extension:

```powershell
# Navigate to chrome-dev folder
cd d:\genui-style-extractor\chrome-dev

# Create config file (I'll create this for you)
New-Item -Path "config.js" -ItemType File
```

Add this content to `config.js`:
```javascript
const CATALYST_CONFIG = {
  functionUrl: 'YOUR_FUNCTION_URL_HERE', // Paste from Step 5
  projectId: 'YOUR_PROJECT_ID',
  environment: 'development'
};
```

---

## 🧪 Step 7: Test Locally (Before Cloud)

You can test functions locally before deploying:

```powershell
# Navigate to catalyst folder
cd d:\genui-style-extractor\catalyst

# Start local server
catalyst serve
```

This runs at: `http://localhost:9000`

Test with curl or Postman:
```powershell
curl -X POST http://localhost:9000/server/convertStyles_function/convertStyles `
  -H "Content-Type: application/json" `
  -d '{\"styles\":{\"width\":\"300px\",\"backgroundColor\":\"#3b82f6\"},\"format\":\"tailwind\"}'
```

---

## 🔄 Step 8: Reload Chrome Extension

After updating config:

1. Go to `chrome://extensions/`
2. Find "GenUI"
3. Click **Reload** (circular arrow icon)
4. Test by selecting an element on any webpage

---

## 📊 Step 9: Monitor Your Functions

### View Logs:
```powershell
catalyst logs --function convertStyles
```

### Check Function Details:
```powershell
catalyst function:list
```

### View in Dashboard:
Go to: https://console.catalyst.zoho.com/

Navigate to: **Your Project → Functions → convertStyles**

You'll see:
- Execution count
- Error logs
- Performance metrics

---

## 🔄 Common Development Workflow

### After Making Changes:

```powershell
# 1. Navigate to catalyst folder
cd d:\genui-style-extractor\catalyst

# 2. Re-deploy functions
catalyst deploy

# 3. Reload Chrome extension
# Go to chrome://extensions/ and click Reload
```

---

## 🆘 Troubleshooting Commands

### Clear Cache and Re-deploy:
```powershell
catalyst deploy --force
```

### Check Catalyst Status:
```powershell
catalyst status
```

### Re-authenticate:
```powershell
catalyst logout
catalyst login
```

### View Project Configuration:
```powershell
catalyst config:list
```

---

## 📝 Quick Reference

| Task | Command |
|------|---------|
| Deploy functions | `catalyst deploy` |
| Test locally | `catalyst serve` |
| View logs | `catalyst logs --function convertStyles` |
| List functions | `catalyst function:list` |
| Get function URL | `catalyst serve:info` |
| Re-authenticate | `catalyst logout && catalyst login` |

---

## ✅ Verification Checklist

After setup, verify:

- [ ] Catalyst CLI installed (`catalyst --version` works)
- [ ] Logged in to Catalyst (`catalyst status` shows authenticated)
- [ ] Functions deployed (`catalyst function:list` shows convertStyles)
- [ ] Function URL obtained and added to Chrome extension config
- [ ] Chrome extension reloaded
- [ ] Test extraction works end-to-end

---

## 🎯 What Happens When You Select an Element?

```
1. User selects element → content-script.js extracts styles
2. Styles sent to background.js
3. Background.js sends to Catalyst function (convertStyles)
4. Catalyst converts CSS → Tailwind/JSX/CSS
5. Response sent back to popup
6. User sees converted code ✨
```

---

## 🚀 Next Steps

After basic integration works:

1. **Add Authentication** - Let users save preferences
2. **Add Data Store** - Save design tokens and history
3. **Add Zia AI** - Smart component generation
4. **Add Analytics** - Track popular conversions

---

Need help? Check `CATALYST_INTEGRATION_GUIDE.md` for detailed explanations!
