# 🧪 GenUI Testing Guide

## Quick Testing Checklist

### ✅ Step 1: Test Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

**Test in Browser:**
1. Open http://localhost:5173
2. You should see the GenUI interface with "Start Extraction" button
3. Interface should be responsive and styled correctly

### ✅ Step 2: Test Chrome Extension Locally

**Load Extension:**
1. Open Chrome → `chrome://extensions/`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select the `chrome-dev` folder
5. Extension icon should appear in toolbar

**Test Extraction:**
1. Navigate to any website (e.g., https://example.com)
2. Click GenUI extension icon
3. Click "Start Extraction"
4. Hover over elements - they should highlight with blue border
5. Click any element - styles should be extracted
6. Choose output format (Tailwind/CSS/JSX)
7. Click "Convert Styles" button

**Expected Behavior:**
- Element highlights on hover with crosshair cursor
- Styles appear in extraction panel after click
- Size, color, background, font info displayed
- Conversion options visible (Tailwind/CSS/JSX)

### ✅ Step 3: Test Catalyst Function Locally

**Option A: Manual Test (Node.js)**

Create a test file `test-catalyst.js`:
```javascript
const convertStyles = require('./catalyst/functions/convertStyles/index.js');

const mockContext = {
    request: {
        body: {
            styles: {
                width: '300px',
                height: '200px',
                backgroundColor: 'rgb(59, 130, 246)',
                color: 'rgb(255, 255, 255)',
                fontSize: '16px',
                padding: '20px',
                borderRadius: '8px'
            },
            format: 'tailwind',
            useRem: false
        }
    },
    response: {
        _status: 200,
        _contentType: '',
        _body: '',
        setStatus(code) { this._status = code; },
        setContentType(type) { this._contentType = type; },
        write(data) { this._body = data; }
    },
    log: {
        error: console.error
    }
};

(async () => {
    await convertStyles(mockContext, {});
    console.log('Status:', mockContext.response._status);
    console.log('Response:', mockContext.response._body);
})();
```

Run: `node test-catalyst.js`

**Expected Output:**
```json
{
  "success": true,
  "format": "tailwind",
  "code": "w-[300px] h-[200px] bg-[#3b82f6] text-[#ffffff] text-[16px] p-[20px] rounded-[8px]"
}
```

**Option B: Use Postman/Thunder Client**

**Endpoint:** (After deployment) `https://your-project.catalystserverless.in/server/convertStyles`

**Request:**
```json
POST /convertStyles
Content-Type: application/json

{
  "styles": {
    "width": "300px",
    "height": "200px",
    "backgroundColor": "rgb(59, 130, 246)",
    "color": "rgb(255, 255, 255)",
    "fontSize": "16px",
    "padding": "20px",
    "borderRadius": "8px"
  },
  "format": "tailwind",
  "useRem": false
}
```

**Expected Response:**
```json
{
  "success": true,
  "format": "tailwind",
  "code": "w-[300px] h-[200px] bg-[#3b82f6] text-[#ffffff] text-[16px] p-[20px] rounded-[8px]",
  "originalStyles": { ... }
}
```

### ✅ Step 4: Test Different Output Formats

**Test Tailwind:**
```json
{
  "styles": { ... },
  "format": "tailwind"
}
```

**Test CSS:**
```json
{
  "styles": { ... },
  "format": "css",
  "useRem": true
}
```

**Test JSX:**
```json
{
  "styles": { ... },
  "format": "jsx"
}
```

### ✅ Step 5: Integration Testing

**After Deployment:**

1. **Update Frontend Environment:**
   ```bash
   cd frontend
   echo 'VITE_CATALYST_ENDPOINT=https://your-url/convertStyles' > .env
   npm run build
   ```

2. **Load Extension with Production Build:**
   - Chrome extension should now call deployed Catalyst function
   - Test extraction → conversion flow end-to-end

3. **Verify Network Calls:**
   - Open DevTools → Network tab
   - Extract element styles
   - Click "Convert Styles"
   - Check for POST request to Catalyst endpoint
   - Verify 200 status and proper response

### ✅ Step 6: Sigma Extension Testing

**After Packaging:**

1. **Create Zip:**
   ```powershell
   cd sigma-package
   Compress-Archive -Path * -DestinationPath ../genui-extension.zip -Force
   ```

2. **Upload to Sigma Console:**
   - Go to https://sigma.zoho.com/developerconsole
   - Upload zip
   - Validate manifest
   - Check for errors

3. **Install in Test Desk:**
   - Install extension in your test Zoho Desk account
   - Open any ticket
   - GenUI widget should appear in sidebar
   - Should load React interface correctly

### 🐛 Common Issues & Quick Fixes

**Issue: Extension doesn't extract styles**
- ✅ Check console for errors
- ✅ Verify content script is injected: `chrome://extensions/` → check content scripts
- ✅ Refresh page after loading extension

**Issue: "Failed to convert styles" error**
- ✅ Check network tab for failed requests
- ✅ Verify CATALYST_ENDPOINT in .env
- ✅ Test Catalyst function directly with Postman
- ✅ Check CORS - Catalyst should auto-allow same org

**Issue: Build fails**
- ✅ Delete node_modules and reinstall: `rm -r node_modules; npm install`
- ✅ Clear TypeScript cache: `rm -r dist; npm run build`
- ✅ Check Node version: `node -v` (should be 16+)

**Issue: Sigma extension won't load**
- ✅ Check zip structure - files should be at root, not in subfolder
- ✅ Validate plugin-manifest.json syntax
- ✅ Ensure app/index.html exists
- ✅ Check browser console in Desk for errors

### ✅ Test Scenarios

#### Scenario 1: Button Extraction
1. Go to any website with buttons
2. Extract button styles
3. Convert to Tailwind
4. Verify button classes are generated correctly

#### Scenario 2: Card Component
1. Go to a site with card layouts
2. Extract card container styles
3. Convert to CSS with rem
4. Verify padding, margin, border-radius converted

#### Scenario 3: Flexbox Layout
1. Find element with `display: flex`
2. Extract styles
3. Convert to Tailwind
4. Verify flex classes: `flex`, `flex-row`, `justify-center`, etc.

#### Scenario 4: Typography
1. Extract heading or text element
2. Verify fontSize, fontWeight captured
3. Convert to all three formats (Tailwind, CSS, JSX)
4. Compare outputs

### 📊 Expected Performance

- **Frontend Build:** < 5 seconds
- **Style Extraction:** < 100ms
- **Catalyst Conversion:** < 500ms
- **Total Flow:** < 1 second from click to result

### ✅ Success Criteria

- [ ] Frontend dev server runs without errors
- [ ] Chrome extension loads and icon appears
- [ ] Elements highlight correctly on hover
- [ ] Styles extract on click
- [ ] All three formats work (Tailwind/CSS/JSX)
- [ ] Copy to clipboard works
- [ ] Build completes successfully
- [ ] No TypeScript errors
- [ ] Catalyst function responds correctly
- [ ] Sigma package validates

### 🎉 All Tests Passing?

If all checks pass, you're ready to:
1. Deploy to Catalyst
2. Build production frontend
3. Package for Sigma
4. Submit for hackathon! 🚀

---

## 🆘 Need Help?

- Check `TROUBLESHOOTING.md` for detailed solutions
- Review `DEPLOYMENT.md` for deployment steps
- Refer to `BUILD_GUIDE.md` for development setup

**Happy Testing!** 🧪✨
