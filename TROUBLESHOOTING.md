# 🔧 GenUI Troubleshooting Guide

## Common Issues & Solutions

---

## 🚨 Installation Issues

### Issue: `npm install` fails in frontend/
**Symptoms:**
- Error messages during npm install
- Missing dependencies warnings

**Solutions:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### Issue: Catalyst CLI won't install
**Symptoms:**
- `npm install -g zcatalyst-cli` fails
- Permission errors

**Solutions:**
```bash
# Run PowerShell as Administrator
# Then try again
npm install -g zcatalyst-cli

# Or use npx (no global install needed)
npx zcatalyst-cli login
```

---

## 💻 Development Issues

### Issue: Frontend won't start (`npm run dev` fails)
**Symptoms:**
- Port already in use
- Vite errors

**Solutions:**
```bash
# Kill process on port 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force

# Or use different port
npm run dev -- --port 3000
```

### Issue: TypeScript errors everywhere
**Symptoms:**
- Red underlines in VSCode
- Build fails with type errors

**Solutions:**
```bash
# Install missing types
cd frontend
npm install --save-dev @types/chrome @types/node

# Check tsconfig.app.json includes chrome types
# Should have: "types": ["vite/client", "chrome"]

# Restart TypeScript server in VSCode
# Ctrl+Shift+P → "TypeScript: Restart TS Server"
```

### Issue: Hot reload not working
**Symptoms:**
- Changes don't appear in browser
- Need to manually refresh

**Solutions:**
```bash
# Restart dev server
# Stop with Ctrl+C
npm run dev

# Clear browser cache
# Hard reload: Ctrl+Shift+R
```

---

## 🔌 Chrome Extension Issues

### Issue: Extension won't load in Chrome
**Symptoms:**
- "Failed to load extension" error
- Manifest errors

**Solutions:**
```bash
# Rebuild extension properly
cd frontend
npm run build
cd ..
Copy-Item -Path "frontend\dist\*" -Destination "chrome-dev\" -Recurse -Force

# Check manifest.json is valid JSON
# Use online JSON validator

# Make sure all required files exist:
# - chrome-dev/manifest.json
# - chrome-dev/content-script.js
# - chrome-dev/background.js
```

### Issue: Content script not injecting
**Symptoms:**
- No overlay appears
- Console shows no messages from content script

**Solutions:**
```bash
# Check manifest.json has content_scripts
# Check file paths are correct
# Check permissions include "activeTab"

# Reload extension:
# Go to chrome://extensions/
# Click refresh icon on GenUI extension

# Check browser console for errors
# Right-click extension icon → Inspect popup
```

### Issue: Popup is blank/white screen
**Symptoms:**
- Extension icon works but popup shows nothing
- Console errors about React

**Solutions:**
```bash
# Rebuild with correct paths
cd frontend
npm run build

# Check index.html references are correct
# Open chrome://extensions/
# Click "Inspect" on popup
# Check console for errors
```

---

## ☁️ Catalyst Issues

### Issue: `catalyst login` fails
**Symptoms:**
- Browser doesn't open
- Authentication fails

**Solutions:**
```bash
# Make sure you're logged into Zoho
# Try opening Catalyst dashboard manually
# https://catalyst.zoho.com/

# Clear Catalyst config
Remove-Item -Recurse ~/.catalyst

# Try login again
catalyst login

# Use browser login if command fails
# catalyst login --browser
```

### Issue: `catalyst deploy` fails
**Symptoms:**
- Deployment errors
- Function not appearing in dashboard

**Solutions:**
```bash
# Make sure you're in catalyst/ directory
cd catalyst

# Check catalyst.json exists
# If not, run: catalyst init

# Check function structure:
# catalyst/functions/convertStyles/index.js must exist

# Try deploying specific function
catalyst deploy --only functions/convertStyles

# Check logs for errors
catalyst logs
```

### Issue: Function deployed but returns errors
**Symptoms:**
- 500 Internal Server Error
- Function not executing

**Solutions:**
```bash
# Check Catalyst logs
catalyst logs

# Common issues:
# 1. Missing module.exports in index.js
# 2. Async/await errors
# 3. Missing error handling

# Test function locally first
cd catalyst/functions/convertStyles
node index.js
```

---

## 🌐 API Integration Issues

### Issue: Frontend can't reach Catalyst function
**Symptoms:**
- CORS errors
- Network errors in console
- "Failed to fetch"

**Solutions:**
```bash
# Check .env file exists
cd frontend
# Should have: VITE_CATALYST_ENDPOINT=your-url

# Rebuild after env changes
npm run build

# Check Catalyst function has CORS enabled
# In index.js response headers:
# response.setHeader('Access-Control-Allow-Origin', '*')

# Test endpoint with curl
curl -X POST your-endpoint-url \
  -H "Content-Type: application/json" \
  -d '{"styles":{},"format":"css"}'
```

### Issue: API calls work locally but not in extension
**Symptoms:**
- Dev server works fine
- Extension shows errors

**Solutions:**
```bash
# Check manifest.json permissions
# Must include: "host_permissions": ["<all_urls>"]

# Rebuild extension
npm run build
# Copy to chrome-dev/
# Reload extension
```

---

## 📦 Build & Package Issues

### Issue: `npm run build` fails
**Symptoms:**
- TypeScript errors
- Vite build errors

**Solutions:**
```bash
# Fix TypeScript errors first
cd frontend
npx tsc --noEmit

# Check for syntax errors
npm run lint

# Clear cache and rebuild
Remove-Item -Recurse -Force dist
npm run build
```

### Issue: Sigma package ZIP is too large
**Symptoms:**
- Upload fails
- File size errors

**Solutions:**
```bash
# Make sure you're not including node_modules
# Check .gitignore

# Build production version (smaller)
cd frontend
npm run build

# Only zip what's needed
cd sigma-package
Compress-Archive -Path "plugin-manifest.json","app" -DestinationPath "../genui-sigma.zip" -Force
```

---

## 🐛 Runtime Errors

### Issue: "chrome is not defined" error
**Symptoms:**
- TypeScript errors
- Runtime errors in browser

**Solutions:**
```bash
# Install Chrome types
cd frontend
npm install --save-dev @types/chrome

# Update tsconfig.app.json
# Add to "types" array: "chrome"

# Use type guards in code
if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Chrome extension code
}
```

### Issue: Styles not extracting correctly
**Symptoms:**
- Wrong values extracted
- Missing properties

**Solutions:**
```javascript
// Check content-script.js
// Make sure using getComputedStyle, not element.style

const cs = window.getComputedStyle(element);
const width = cs.width; // Not element.style.width

// Add more properties to extraction
// Check all 30+ properties are included
```

### Issue: Tailwind conversion gives wrong classes
**Symptoms:**
- Invalid Tailwind classes
- Classes don't match styles

**Solutions:**
```javascript
// Improve conversion logic in catalyst/functions/convertStyles/index.js
// Add more mapping rules
// Test with various inputs

// For custom values, use arbitrary values:
// Instead of: w-100px (invalid)
// Use: w-[100px] (valid Tailwind)
```

---

## 🔍 Debugging Tips

### Enable Verbose Logging
```javascript
// In App.tsx
console.log('Styles received:', styles);
console.log('Conversion result:', data);

// In content-script.js
console.log('Element selected:', element);
console.log('Computed styles:', styles);

// In catalyst function
console.log('Request received:', request.body);
console.log('Conversion output:', output);
```

### Check Browser Console
```
1. Open webpage
2. F12 or Right-click → Inspect
3. Console tab
4. Look for errors (red text)
5. Check Network tab for API calls
```

### Check Extension Console
```
1. Go to chrome://extensions/
2. Find GenUI extension
3. Click "Inspect views: popup" or "service worker"
4. Console shows popup/background errors
```

### Test API Directly
```bash
# PowerShell
$body = @{
    styles = @{width = "100px"}
    format = "tailwind"
} | ConvertTo-Json

Invoke-RestMethod -Uri "your-catalyst-url" -Method Post -Body $body -ContentType "application/json"
```

---

## 📱 Platform-Specific Issues

### Windows
```bash
# PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Path issues - use forward slashes in code
const path = "c:/users/..." # Not "c:\users\..."
```

### macOS/Linux
```bash
# Use npm instead of npx for Catalyst
sudo npm install -g zcatalyst-cli

# Permission issues
sudo chown -R $USER ~/.catalyst
```

---

## 🆘 Last Resort Solutions

### Nuclear Option: Start Fresh
```bash
# Backup your work first!
git add .
git commit -m "backup before reset"

# Clean everything
Remove-Item -Recurse -Force frontend/node_modules
Remove-Item -Recurse -Force frontend/dist
Remove-Item frontend/.env

# Reinstall
cd frontend
npm install
npm run build
```

### Get Help
1. **Check Documentation**
   - BUILD_GUIDE.md
   - FOR_BEGINNERS.md
   - COMMANDS.md

2. **Search Issues**
   - GitHub Issues tab
   - Zoho Catalyst docs
   - Chrome Extension docs

3. **Ask Team**
   - Create GitHub Issue
   - Team chat
   - Code review

4. **External Help**
   - Stack Overflow
   - Zoho forums
   - Chrome extension forums

---

## ✅ Prevention Checklist

Before starting development:
- [ ] Node.js installed and working
- [ ] npm/npx working
- [ ] Git configured
- [ ] VSCode updated
- [ ] Chrome updated

Before committing:
- [ ] `npm run build` succeeds
- [ ] No TypeScript errors
- [ ] No console errors
- [ ] Tested in Chrome
- [ ] Git status clean

Before deploying:
- [ ] All tests pass
- [ ] Extension loads in Chrome
- [ ] Catalyst function tested
- [ ] End-to-end flow works
- [ ] Documentation updated

---

## 📞 Quick Reference

### Kill Processes
```bash
# Port 5173 (Vite)
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process -Force
```

### Clear Caches
```bash
# npm cache
npm cache clean --force

# Browser cache
Ctrl+Shift+Delete → Clear cache

# Catalyst cache
Remove-Item -Recurse ~/.catalyst
```

### Reset Extension
```bash
# Rebuild
cd frontend; npm run build; cd ..

# Recopy
Copy-Item -Path "frontend\dist\*" -Destination "chrome-dev\" -Recurse -Force

# Reload
# chrome://extensions/ → Reload button
```

---

**Still stuck? Create an issue on GitHub with:**
1. What you're trying to do
2. What's happening instead
3. Error messages (full text)
4. What you've tried
5. Your environment (Windows/Mac, Node version)

We're here to help! 🚀
