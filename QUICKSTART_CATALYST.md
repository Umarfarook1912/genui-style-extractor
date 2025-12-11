# 🚀 GenUI + Catalyst - Complete Beginner's Quick Start

Welcome! This guide will help you get GenUI integrated with Zoho Catalyst in **3 simple phases**.

---

## 📖 What You'll Do (High-Level Overview)

```
Phase 1: Manual Setup (Catalyst Dashboard) → 5 minutes
Phase 2: Automated Setup (Terminal Commands) → 10 minutes  
Phase 3: Testing & Verification → 5 minutes

Total Time: ~20 minutes
```

---

## 🎯 Phase 1: Manual Setup (Catalyst Dashboard)

### Step 1: Open Catalyst Dashboard

Go to: https://console.catalyst.zoho.com/

You should see the screen from your screenshot.

### Step 2: Create New Project

1. Click **"Create New Project"** (the + button)
2. Fill in:
   - **Project Name:** `genui-backend`
   - **Description:** `Backend for GenUI style conversion`
   - **Domain Type:** Choose **"Web Client"** (since you have Chrome extension)
3. Click **"Create"**

### Step 3: Note Important Details

After creation, you'll see:

**Project ID (PID):** Something like `908193831_0000012115`

**📝 COPY THIS!** You'll need it later.

Also note:
- **Environment:** Development (default)
- **Region:** (wherever you selected)

---

## ⚡ Phase 2: Automated Setup (Terminal Commands)

Now let's do the coding part! Open PowerShell in your project folder.

### Step 1: Navigate to Project

```powershell
cd d:\genui-style-extractor
```

### Step 2: Install Catalyst CLI

```powershell
npm install -g zcatalyst-cli
```

Wait for installation... ☕

Verify:
```powershell
catalyst --version
```

Should show: `Catalyst CLI version X.X.X`

### Step 3: Login to Catalyst

```powershell
catalyst login
```

This will:
1. Open your browser
2. Ask you to authenticate with Zoho
3. Show success message

### Step 4: Initialize and Link Your Project

```powershell
# Navigate to catalyst folder
cd catalyst

# Initialize the project (if not already done)
catalyst init

# Set active project
catalyst project:use
```

When prompted for `catalyst init`:
- Choose **"Link to existing project"**
- Select your project: `genui-backend`
- Select environment: `Development`

When prompted for `catalyst project:use`:
- Select your project: `genui-backend`

### Step 5: Deploy Your Functions

```powershell
# Deploy everything to Catalyst cloud
catalyst deploy
```

You'll see:
```
✓ Deploying functions...
✓ convertStyles deployed successfully
```

### Step 6: Get Your Function URL

```powershell
catalyst serve:info
```

You'll see something like:
```
Function URL: https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles_function/convertStyles
```

**📝 COPY THIS URL!**

### Step 7: Update Configuration

Open `chrome-dev/config.js` in VS Code.

Replace:
```javascript
functionUrl: 'http://localhost:9000/server/convertStyles_function/convertStyles'
```

With your actual URL from Step 6:
```javascript
functionUrl: 'https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles_function/convertStyles'
```

Also update:
```javascript
projectId: '908193831_0000012115' // Your actual Project ID from Phase 1
```

Save the file!

---

## 🧪 Phase 3: Testing & Verification

### Step 1: Reload Chrome Extension

1. Open Chrome
2. Go to: `chrome://extensions/`
3. Find **"GenUI - Style Extractor"**
4. Click the **Reload** icon (🔄)

### Step 2: Test on a Webpage

1. Go to any website (e.g., https://google.com)
2. Click the GenUI extension icon
3. Click **"Start Extraction"** in popup
4. Hover over any element (it will highlight in blue)
5. Click the element

### Step 3: Check Results

You should see in the popup:
- ✅ Extracted CSS styles
- ✅ Converted Tailwind classes
- ✅ JSX/React code

### Step 4: Verify Catalyst Logs (Optional)

Check if your function was called:

```powershell
cd d:\genui-style-extractor\catalyst
catalyst logs --function convertStyles
```

You should see logs of the API call!

### Step 5: Dashboard Monitoring

Go to: https://console.catalyst.zoho.com/

Navigate to:
**Your Project → Functions → convertStyles**

You'll see:
- 📊 Execution count (should be > 0)
- 📝 Recent logs
- ⚡ Performance metrics

---

## ✅ Success Checklist

You're done when all these are checked:

- [ ] Created Catalyst project in dashboard
- [ ] Installed Catalyst CLI (`catalyst --version` works)
- [ ] Logged in (`catalyst login` successful)
- [ ] Linked project (`catalyst link` completed)
- [ ] Deployed functions (`catalyst deploy` successful)
- [ ] Updated `config.js` with real function URL
- [ ] Reloaded Chrome extension
- [ ] Tested element extraction
- [ ] Saw converted Tailwind/CSS code
- [ ] Verified logs in Catalyst dashboard

---

## 🎨 What Just Happened? (Simple Explanation)

**Before Catalyst:**
```
Chrome Extension → Extracts Styles → Shows Raw CSS
(All local, no conversion)
```

**After Catalyst:**
```
Chrome Extension → Extracts Styles → Sends to Catalyst Cloud → 
Gets Smart Conversion → Shows Tailwind/CSS/JSX
(Cloud-powered, intelligent conversion)
```

---

## 🔄 Daily Development Workflow

When you make changes to your code:

```powershell
# 1. Make changes to catalyst/functions/convertStyles/index.js

# 2. Deploy to Catalyst
cd d:\genui-style-extractor\catalyst
catalyst deploy

# 3. Reload Chrome extension
# Go to chrome://extensions/ → GenUI → Reload

# 4. Test again!
```

---

## 🐛 Troubleshooting

### Problem: "catalyst: command not found"
```powershell
# Solution: Reinstall
npm install -g zcatalyst-cli --force
```

### Problem: "Authentication failed"
```powershell
# Solution: Re-login
catalyst logout
catalyst login
```

### Problem: "Extension shows error"
1. Check `config.js` has correct URL
2. Open Chrome DevTools → Console
3. Look for error messages
4. Verify Catalyst function is deployed: `catalyst function:list`

### Problem: "No conversion happening"
1. Test locally first:
   ```powershell
   cd catalyst
   catalyst serve
   ```
2. Update `config.js` to use: `http://localhost:9000/...`
3. Test again
4. If local works, deploy: `catalyst deploy`
5. Update `config.js` back to cloud URL

---

## 📚 Additional Resources

- **Detailed Guide:** See `CATALYST_INTEGRATION_GUIDE.md`
- **Commands Reference:** See `CATALYST_SETUP_COMMANDS.md`
- **Catalyst Docs:** https://catalyst.zoho.com/help
- **Chrome Extension Docs:** https://developer.chrome.com/docs/extensions/

---

## 🎯 Next Features to Add

Once basic integration works, you can add:

1. **User Authentication** - Save user preferences
2. **Design Tokens Storage** - Save frequently used styles
3. **Zia AI Integration** - Smart component generation
4. **Analytics** - Track popular conversions
5. **Multi-format Export** - Save as files

Commands for these features are in `CATALYST_INTEGRATION_GUIDE.md`!

---

## 💡 Pro Tips

1. **Test Locally First:** Always test with `catalyst serve` before deploying
2. **Use Logs:** `catalyst logs --function convertStyles` is your friend
3. **Check Dashboard:** Monitor executions in Catalyst console
4. **Version Control:** Commit after each working feature
5. **Read Errors:** Chrome DevTools Console shows detailed errors

---

## 🆘 Still Stuck?

1. Check `TROUBLESHOOTING.md` in your project
2. Visit Zoho Catalyst community: https://help.catalyst.zoho.com/community
3. Check Chrome extension logs: DevTools → Console
4. Review Catalyst logs: `catalyst logs --function convertStyles`

---

🎉 **Congratulations!** You've successfully integrated GenUI with Zoho Catalyst!

Your Chrome extension now has cloud-powered style conversion! 🚀
