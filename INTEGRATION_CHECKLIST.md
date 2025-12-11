# ✅ GenUI + Catalyst Integration Checklist

Use this checklist to track your progress. Check off each item as you complete it!

---

## 📚 Phase 0: Preparation (5 minutes)

- [ ] Read `README_CATALYST.md` (overview)
- [ ] Open `QUICKSTART_CATALYST.md` (step-by-step guide)
- [ ] Have Catalyst dashboard open: https://console.catalyst.zoho.com/
- [ ] Have VS Code open with project
- [ ] Have PowerShell/Terminal ready

---

## 🖱️ Phase 1: Catalyst Dashboard Setup (Manual - 5 minutes)

- [ ] Logged into Catalyst dashboard
- [ ] Clicked "Create New Project"
- [ ] Named project: `genui-backend`
- [ ] Selected domain: "Web Client"
- [ ] Project created successfully
- [ ] Copied Project ID (e.g., `908193831_0000012115`)
- [ ] Project ID saved somewhere safe

---

## 💻 Phase 2: CLI Installation (Terminal - 5 minutes)

Open PowerShell and run these commands:

- [ ] Ran: `node --version` (verified Node.js is installed)
- [ ] Ran: `npm --version` (verified npm is installed)
- [ ] Ran: `npm install -g zcatalyst-cli`
- [ ] CLI installation completed successfully
- [ ] Ran: `catalyst --version` (verified CLI installed)
- [ ] Ran: `catalyst login`
- [ ] Browser opened for authentication
- [ ] Logged in with Zoho account
- [ ] Received success message: "Successfully logged in"

---

## 🔗 Phase 3: Project Linking (Terminal - 3 minutes)

- [ ] Navigated to project: `cd d:\genui-style-extractor\catalyst`
- [ ] Ran: `catalyst link`
- [ ] Selected project: `genui-backend`
- [ ] Selected environment: `Development`
- [ ] Project linked successfully
- [ ] Verified with: `catalyst status`

---

## 🚀 Phase 4: Function Deployment (Terminal - 5 minutes)

- [ ] Still in `d:\genui-style-extractor\catalyst` directory
- [ ] Ran: `catalyst deploy`
- [ ] Deployment started
- [ ] Function `convertStyles` deployed successfully
- [ ] No errors in deployment output
- [ ] Ran: `catalyst function:list`
- [ ] Confirmed `convertStyles` appears in list

---

## 🌐 Phase 5: Get Function URL (Terminal - 2 minutes)

- [ ] Ran: `catalyst serve:info`
- [ ] Function URL displayed (looks like: `https://...catalystserverless.com/...`)
- [ ] Copied full function URL
- [ ] URL saved in notepad/somewhere safe

Example URL format:
```
https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles_function/convertStyles
```

---

## ⚙️ Phase 6: Configuration Update (VS Code - 3 minutes)

- [ ] Opened file: `chrome-dev/config.js` in VS Code
- [ ] Found line: `functionUrl: 'http://localhost:9000/...'`
- [ ] Replaced with actual URL from Phase 5
- [ ] Found line: `projectId: 'YOUR_PROJECT_ID_HERE'`
- [ ] Replaced with actual Project ID from Phase 1
- [ ] Saved file (`Ctrl+S`)
- [ ] Verified no typos in URLs

Your `config.js` should now look like:
```javascript
const CATALYST_CONFIG = {
  functionUrl: 'https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles_function/convertStyles',
  projectId: '908193831_0000012115',
  environment: 'development',
  timeout: 10000,
  enableLogs: true
};
```

---

## 🔄 Phase 7: Extension Reload (Chrome - 2 minutes)

- [ ] Opened Chrome browser
- [ ] Navigated to: `chrome://extensions/`
- [ ] Found "GenUI - Style Extractor"
- [ ] Clicked "Reload" button (🔄)
- [ ] Extension reloaded without errors
- [ ] No error messages visible

---

## 🧪 Phase 8: Testing (Chrome - 5 minutes)

### Test 1: Basic Functionality
- [ ] Went to a test website (e.g., https://google.com)
- [ ] Clicked GenUI extension icon
- [ ] Popup opened successfully
- [ ] Clicked "Start Extraction" button
- [ ] Cursor changed to crosshair

### Test 2: Element Selection
- [ ] Hovered over an element (e.g., button, div)
- [ ] Element highlighted with blue border
- [ ] Clicked on the element
- [ ] Popup displayed extracted styles

### Test 3: Conversion Results
- [ ] Popup shows CSS code
- [ ] Popup shows Tailwind classes
- [ ] Popup shows JSX code
- [ ] All three formats have content
- [ ] No error messages visible

### Test 4: Copy Functionality
- [ ] Clicked "Copy CSS" button
- [ ] Pasted into notepad - code appeared
- [ ] Clicked "Copy Tailwind" button
- [ ] Pasted into notepad - code appeared
- [ ] Copy works correctly

---

## 📊 Phase 9: Verification (Dashboard & Logs - 5 minutes)

### Check Catalyst Dashboard
- [ ] Went to: https://console.catalyst.zoho.com/
- [ ] Opened project: `genui-backend`
- [ ] Clicked on "Functions"
- [ ] Clicked on "convertStyles"
- [ ] Saw execution count > 0
- [ ] Saw recent execution timestamp
- [ ] No errors in error log

### Check Terminal Logs
- [ ] In PowerShell, navigated to: `cd d:\genui-style-extractor\catalyst`
- [ ] Ran: `catalyst logs --function convertStyles`
- [ ] Saw log entries from recent test
- [ ] Logs show successful executions
- [ ] No error messages in logs

### Check Browser Console
- [ ] Opened Chrome DevTools (F12)
- [ ] Went to Console tab
- [ ] Saw GenUI log messages
- [ ] Saw "Styles extracted, sending to Catalyst..."
- [ ] Saw successful response messages
- [ ] No red error messages

---

## 🎯 Phase 10: Comprehensive Testing (10 minutes)

Test on multiple websites to ensure reliability:

### Test Website 1: Google
- [ ] URL: https://google.com
- [ ] Selected search button
- [ ] Conversion worked
- [ ] All formats generated

### Test Website 2: GitHub
- [ ] URL: https://github.com
- [ ] Selected navigation button
- [ ] Conversion worked
- [ ] All formats generated

### Test Website 3: Your Choice
- [ ] URL: _______________
- [ ] Selected element: _______________
- [ ] Conversion worked
- [ ] All formats generated

---

## ✅ Final Verification Checklist

### Technical Verification
- [ ] Catalyst function deployed
- [ ] Function URL configured correctly
- [ ] Extension loads without errors
- [ ] Element selection works
- [ ] Style extraction works
- [ ] Catalyst API calls successful
- [ ] CSS conversion works
- [ ] Tailwind conversion works
- [ ] JSX conversion works
- [ ] Copy to clipboard works
- [ ] Logs show in dashboard
- [ ] No console errors

### Feature Verification
- [ ] Can select any element
- [ ] Extraction mode toggles on/off
- [ ] Element highlighting works
- [ ] Popup shows results
- [ ] All three formats display
- [ ] Code is properly formatted
- [ ] Can copy each format
- [ ] Works on multiple websites
- [ ] Responsive and fast (< 1 second)

### Documentation Verification
- [ ] Read README_CATALYST.md
- [ ] Read QUICKSTART_CATALYST.md
- [ ] Understand architecture (ARCHITECTURE_CATALYST.md)
- [ ] Know how to deploy updates
- [ ] Know how to check logs
- [ ] Know how to troubleshoot

---

## 🐛 Troubleshooting Checklist

If something doesn't work, check these:

### Deployment Issues
- [ ] Verified internet connection
- [ ] Confirmed logged into Catalyst: `catalyst status`
- [ ] Checked function deployed: `catalyst function:list`
- [ ] Tried re-deploying: `catalyst deploy --force`

### Configuration Issues
- [ ] Verified `config.js` has correct URL
- [ ] Verified URL has no typos
- [ ] Verified URL starts with `https://`
- [ ] Verified Project ID is correct

### Extension Issues
- [ ] Reloaded extension in Chrome
- [ ] Checked Chrome DevTools Console for errors
- [ ] Verified manifest.json has no errors
- [ ] Tried removing and re-adding extension

### API Issues
- [ ] Tested locally: `catalyst serve`
- [ ] Checked Catalyst logs: `catalyst logs --function convertStyles`
- [ ] Verified function URL returns response
- [ ] Checked network tab in DevTools

---

## 📈 Next Steps (After Everything Works)

Now that basic integration works, consider:

### Immediate Enhancements (1-2 hours)
- [ ] Improve UI styling
- [ ] Add loading indicators
- [ ] Add error messages for users
- [ ] Add keyboard shortcuts
- [ ] Test edge cases

### Future Features (Optional)
- [ ] Read AUTHENTICATION_GUIDE.md
- [ ] Add user login/logout
- [ ] Store user preferences
- [ ] Save design tokens
- [ ] Add conversion history
- [ ] Integrate Zia AI
- [ ] Build analytics dashboard

### Hackathon Preparation
- [ ] Create demo video
- [ ] Take screenshots
- [ ] Write project description
- [ ] Update GitHub README
- [ ] Test demo flow
- [ ] Prepare presentation

---

## 📊 Success Metrics

You've successfully integrated when:

✅ **All items in Phase 1-10 are checked**  
✅ **Extension works on 3+ websites**  
✅ **No console errors**  
✅ **Catalyst dashboard shows executions**  
✅ **You understand the architecture**  
✅ **You can deploy updates confidently**  

---

## 🎉 Completion Status

**Total Items:** ~150 checkboxes  
**Completed:** _____ / 150  
**Percentage:** _____%  

When you reach 100%, you're ready for the hackathon! 🚀

---

## 💾 Save Your Progress

As you complete sections, save this file with your checkmarks!

**Started:** ____________ (date/time)  
**Completed:** ____________ (date/time)  
**Total Time:** ____________ hours  

---

## 📞 Quick Reference

**Important Commands:**
```powershell
catalyst deploy          # Deploy changes
catalyst logs            # View logs
catalyst function:list   # List functions
catalyst serve          # Test locally
catalyst status         # Check login
```

**Important Files:**
- `chrome-dev/config.js` - Configuration
- `catalyst/functions/convertStyles/index.js` - Conversion logic
- `chrome-dev/background.js` - API calls

**Important Links:**
- Dashboard: https://console.catalyst.zoho.com/
- Docs: https://catalyst.zoho.com/help

---

🎯 **Good luck!** Check off each item as you complete it, and you'll have GenUI + Catalyst working smoothly!
