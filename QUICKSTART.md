# GenUI - How to Run and Test

## ✅ What's Currently Running

**Frontend Development Server**: http://localhost:5173/  
(Started and running in the background)

## 🧪 Testing Options

### Option 1: Test Locally with Dev Server (RECOMMENDED)

The Catalyst deployed function has timeout issues. Let's test locally instead:

**Step 1: Start Local Function Server**
```powershell
cd d:\genui-style-extractor\catalyst\functions\convertStyles
node dev-server.js
```

**Step 2: Test the Local Function**
```powershell
$body = '{"styles":{"color":"rgb(255, 0, 0)","fontSize":"16px"},"format":"tailwind","useRem":false}'
Invoke-RestMethod -Uri "http://localhost:3000/convertStyles" -Method POST -ContentType "application/json" -Body $body
```

### Option 2: Test Chrome Extension

1. Open Chrome: `chrome://extensions/`
2. Enable "Developer mode" (top-right toggle)
3. Click "Load unpacked"
4. Select: `d:\genui-style-extractor\chrome-dev`
5. Visit any website and click the GenUI icon
6. Click any element to extract styles!

### Option 3: Test Frontend UI

Visit: **http://localhost:5173/**

The frontend is already running and ready to use.

## ⚠️ Catalyst Deployment Issue

The deployed Catalyst function at:
```
https://polls-908193831.development.catalystserverless.com/server/genui/execute
```

Is experiencing "Execution Time Exceeded" errors (408 timeout).

**Possible Solutions:**
1. Use local development server (recommended for testing)
2. Contact Zoho Catalyst support: support@zohocatalyst.com
3. Try creating an Advanced I/O function instead of Basic I/O

## 📦 Ready for Distribution

- ✅ `genui-chrome-extension.zip` (293 KB)
- ✅ `genui-sigma-extension.zip` (75 KB)

---

**Quick Start**: Run `node dev-server.js` in `catalyst/functions/convertStyles` folder!
