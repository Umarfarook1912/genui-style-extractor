# 🚀 GenUI + Catalyst Integration Guide (Beginner-Friendly)

Welcome! This guide will help you integrate your GenUI Chrome extension with Zoho Catalyst step by step.

## 📋 What You'll Learn

1. Understanding what Catalyst does for GenUI
2. Creating a new Catalyst project (Manual Steps)
3. Setting up Catalyst CLI on your computer
4. Deploying serverless functions
5. Connecting your Chrome extension to Catalyst

---

## 🎯 Part 1: Why Catalyst for GenUI?

Your Chrome extension currently works locally. But with Catalyst, you get:

✅ **Cloud Functions** - Convert styles (px→rem, CSS→Tailwind) on the server  
✅ **Data Store** - Save user preferences and design tokens  
✅ **Authentication** - Let users log in and save their work  
✅ **Zia AI** (Optional) - Smart code generation and suggestions  

**Simple Flow:**
```
Chrome Extension → Extracts Styles → Sends to Catalyst → Gets Converted Code → Shows to User
```

---

## 🖱️ Part 2: Creating a Catalyst Project (Manual - Dashboard)

### Step 1: Go to Catalyst Dashboard

Open your Catalyst dashboard: https://console.catalyst.zoho.com/

You should see the screen from your screenshot with:
- "Create New Project" button
- "Polls" demo app (ignore this)

### Step 2: Create Your Project

1. **Click "Create New Project"**
2. **Fill in the details:**
   - **Project Name:** `genui-backend`
   - **Description:** `Backend services for GenUI style extraction`
   - **Domain:** Choose `Web Client` (since you have a Chrome extension)
   
3. **Click "Create"**

### Step 3: Note Your Project ID

After creation, you'll see a Project ID (PID) like: `908193831_0000012115`

**IMPORTANT:** Copy this somewhere safe. You'll need it!

---

## 💻 Part 3: Setting Up Catalyst CLI (On Your Computer)

### Step 1: Install Node.js (if not already)

You already have Node.js since your frontend works. Check version:

```powershell
node --version
```

Should be 14+ (you probably have 18+)

### Step 2: Install Catalyst CLI

Open PowerShell (as Administrator if possible) and run:

```powershell
npm install -g zcatalyst-cli
```

Wait for installation to complete.

### Step 3: Login to Catalyst

Run this command:

```powershell
catalyst login
```

This will:
1. Open your browser
2. Ask you to log in to Zoho
3. Authenticate your CLI

Once done, you'll see: ✅ "Successfully logged in"

### Step 4: Link Your Local Project

Navigate to your project folder:

```powershell
cd d:\genui-style-extractor
```

Now connect this folder to your Catalyst project:

```powershell
catalyst init
```

When prompted:
- **Select existing project:** Yes
- **Choose project:** Select `genui-backend` (the one you created)
- **Project structure:** Select `functions` (we'll use serverless functions)

---

## 📁 Part 4: Understanding the Catalyst Folder Structure

After running `catalyst init`, you'll see a new folder structure:

```
d:\genui-style-extractor\
├── catalyst/
│   ├── catalyst.json          ← Main config file
│   └── functions/
│       ├── convertStyles/     ← Your serverless function
│       │   ├── index.js       ← Function code
│       │   └── package.json
```

**What each file does:**

- **catalyst.json** - Tells Catalyst about your project setup
- **functions/** - Contains serverless functions (like mini APIs)
- **convertStyles/index.js** - Where you write conversion logic

---

## ⚡ Part 5: Your First Catalyst Function

Let's create a function to convert styles!

### Function Purpose:

**Input:** Extracted CSS styles from Chrome extension  
**Output:** Converted Tailwind classes + Responsive code

### The Code (Already prepared for you):

Check `catalyst/functions/convertStyles/index.js` - I'll create this for you automatically.

### What the Function Does:

```javascript
// Receives extracted styles like:
{
  "width": "300px",
  "height": "200px",
  "backgroundColor": "#3b82f6",
  "fontSize": "16px"
}

// Returns converted code:
{
  "css": "width: 18.75rem; height: 12.5rem; ...",
  "tailwind": "w-[300px] h-[200px] bg-blue-500 text-base",
  "jsx": "<div className='w-[300px] h-[200px] bg-blue-500'>..."
}
```

---

## 🚀 Part 6: Deploying to Catalyst

### Step 1: Navigate to Catalyst folder

```powershell
cd d:\genui-style-extractor\catalyst
```

### Step 2: Deploy your functions

```powershell
catalyst deploy
```

This uploads your code to Catalyst cloud!

You'll see:
```
✓ Deploying functions...
✓ convertStyles deployed successfully
```

### Step 3: Get Your Function URL

After deployment, run:

```powershell
catalyst serve:info
```

You'll get a URL like:
```
https://genui-backend-908193831.development.catalystserverless.com/server/convertStyles
```

**Copy this URL!** You'll use it in your Chrome extension.

---

## 🔌 Part 7: Connecting Chrome Extension to Catalyst

### Update Your Extension's API Endpoint

In your Chrome extension code, you'll make API calls to Catalyst:

**File:** `chrome-dev/content-script.js`

```javascript
// After extracting styles from selected element
const extractedStyles = {
  width: element.offsetWidth + 'px',
  height: element.offsetHeight + 'px',
  backgroundColor: computedStyle.backgroundColor,
  // ... more styles
};

// Send to Catalyst for conversion
const response = await fetch('YOUR_CATALYST_FUNCTION_URL', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ styles: extractedStyles })
});

const converted = await response.json();
console.log(converted.tailwind); // Your Tailwind classes!
```

I'll update this for you automatically.

---

## 🧪 Part 8: Testing Everything

### Test 1: Test Function Locally

Before deploying, test locally:

```powershell
cd d:\genui-style-extractor\catalyst
catalyst serve
```

This runs a local server at `http://localhost:9000`

### Test 2: Test with Chrome Extension

1. Load your Chrome extension (unpacked)
2. Select an element on any webpage
3. Click "Convert Styles"
4. Check if it calls Catalyst and shows results

### Test 3: Check Catalyst Dashboard

Go to your Catalyst dashboard → Functions → convertStyles  
You can see:
- Execution logs
- API call count
- Errors (if any)

---

## 🎨 Part 9: Next Steps (Optional Enhancements)

### 1. Add User Authentication

Allow users to log in and save preferences:

```powershell
catalyst auth:create
```

### 2. Add Database (Data Store)

Save design tokens and user history:

```powershell
catalyst datastore:create
```

### 3. Use Zia AI (Smart Features)

Add intelligent code suggestions:

```javascript
const zia = catalyst.zia();
const suggestion = await zia.generateComponent(extractedStyles);
```

---

## ❓ Troubleshooting

### Problem: "catalyst: command not found"

**Solution:** Reinstall CLI:
```powershell
npm install -g zcatalyst-cli --force
```

### Problem: "Authentication failed"

**Solution:** Re-login:
```powershell
catalyst logout
catalyst login
```

### Problem: "Function deployment failed"

**Solution:** Check your `catalyst.json` file for errors.

---

## 📞 Need Help?

- **Catalyst Docs:** https://catalyst.zoho.com/help
- **Community:** https://help.catalyst.zoho.com/community
- **Your Project Readme:** Check `README.md` for project-specific help

---

## ✅ Quick Checklist

- [ ] Created Catalyst project in dashboard
- [ ] Installed Catalyst CLI
- [ ] Logged in via `catalyst login`
- [ ] Initialized project via `catalyst init`
- [ ] Created conversion functions
- [ ] Deployed via `catalyst deploy`
- [ ] Updated Chrome extension API endpoints
- [ ] Tested end-to-end flow

---

🎉 **You're all set!** Your GenUI extension now has cloud-powered style conversion!
