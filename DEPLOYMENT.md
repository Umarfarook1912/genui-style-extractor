# GenUI - Deployment Guide

This guide will walk you through deploying GenUI to Zoho Catalyst and Zoho Sigma.

## 📋 Prerequisites

- Zoho Account (test account provided for hackathon)
- Node.js and npm installed
- Zoho CLI installed: `npm install -g zoho-extension-toolkit`
- Catalyst CLI installed: `npm install -g zoho-catalyst-cli`

## 🚀 Step 1: Deploy Catalyst Backend

### 1.1 Login to Catalyst

```bash
catalyst login
```

### 1.2 Initialize Catalyst Project (if not already done)

```bash
cd catalyst
catalyst init
```

Follow the prompts:
- Project Name: `GenUI`
- Runtime: `Node 16` or `Node 18`

### 1.3 Deploy the Function

```bash
catalyst deploy
```

### 1.4 Get Your Function URL

After deployment, you'll receive a URL like:
```
https://genui-12345.catalystserverless.in/server/convertStyles
```

**Important:** Copy this URL - you'll need it for the frontend configuration.

## 🎨 Step 2: Configure Frontend

### 2.1 Update Environment Variables

Create a `.env` file in the `frontend` directory:

```bash
cd frontend
cp .env.example .env
```

Edit `.env` and add your Catalyst function URL:

```env
VITE_CATALYST_ENDPOINT=https://genui-12345.catalystserverless.in/server/convertStyles
```

### 2.2 Build Frontend

```bash
npm run build
```

This will generate the production build in `sigma-package/app`.

## 📦 Step 3: Deploy Sigma Extension

### 3.1 Package the Extension

The `sigma-package` folder is already structured correctly:
- `plugin-manifest.json` - Extension configuration
- `app/` - Built React application

### 3.2 Create Sigma Extension

1. Go to [Zoho Sigma Developer Console](https://sigma.zoho.com/developerconsole)
2. Click **Create New Extension**
3. Choose **Zoho Desk** as the service
4. Fill in:
   - Extension Name: `GenUI Style Extractor`
   - Description: `Extract UI styles and generate Tailwind CSS code`

### 3.3 Upload Extension Files

1. Zip the `sigma-package` contents (not the folder itself):
   ```bash
   cd sigma-package
   # On Windows PowerShell:
   Compress-Archive -Path * -DestinationPath ../genui-extension.zip -Force
   ```

2. In Sigma Console, upload the `genui-extension.zip`

### 3.4 Configure Extension Location

In the Sigma Console, configure where the widget appears in Zoho Desk:
- Location: Sidebar Widget
- Service: Desk
- Pages: Ticket Details (or wherever you want it)

### 3.5 Publish Extension

1. Click **Validate** to check for errors
2. Click **Publish** to make it available
3. Install it in your test Zoho Desk account

## 🧪 Step 4: Test with Chrome Dev Harness

Before deploying, test locally with the Chrome extension:

### 4.1 Load Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode**
3. Click **Load unpacked**
4. Select the `chrome-dev` folder

### 4.2 Test Locally

1. Start local Catalyst function (if testing locally):
   ```bash
   cd catalyst/functions/convertStyles
   node index.js
   ```

2. Navigate to any webpage
3. Click the GenUI extension icon
4. Click "Start Extraction"
5. Click on any element on the page
6. Choose output format and click "Convert Styles"

## 🔧 Step 5: Configure Zoho Desk

### 5.1 Access Test Account

Use the Zoho test account credentials provided for the hackathon.

### 5.2 Install Extension in Desk

1. Login to Zoho Desk
2. Go to **Setup** → **Marketplace** → **Extensions**
3. Find your GenUI extension
4. Click **Install**

### 5.3 Access the Widget

1. Open any ticket in Zoho Desk
2. Look for the GenUI widget in the sidebar
3. Use it to extract styles from web pages

## 📝 Environment Variables Reference

### Frontend (.env)

```env
# Catalyst Function URL
VITE_CATALYST_ENDPOINT=https://your-project.catalystserverless.in/server/convertStyles
```

## 🐛 Troubleshooting

### Issue: Build fails with TypeScript errors

**Solution:** Make sure all dependencies are installed:
```bash
cd frontend
npm install
```

### Issue: Catalyst function returns CORS errors

**Solution:** CORS is automatically allowed for same Zoho organization. Ensure your Desk account and Catalyst project are in the same org.

### Issue: Extension doesn't load in Sigma

**Solution:** 
1. Check `plugin-manifest.json` syntax
2. Ensure `app/index.html` exists in the zip
3. Validate zip structure: files should be at root, not in a subfolder

### Issue: Styles not converting

**Solution:**
1. Check browser console for errors
2. Verify Catalyst function URL is correct in `.env`
3. Test Catalyst function directly with Postman/curl

## 📚 Additional Resources

- [Zoho Catalyst Documentation](https://catalyst.zoho.com/docs)
- [Zoho Sigma Documentation](https://sigma.zoho.com/docs)
- [TanStack React Query Docs](https://tanstack.com/query/latest)

## 🎉 Success!

Your GenUI extension should now be:
- ✅ Deployed to Catalyst
- ✅ Built and packaged for Sigma
- ✅ Installed in Zoho Desk
- ✅ Ready to extract styles!

## 🤝 Support

For hackathon support, contact the Zoho team or check the hackathon Slack/Discord channel.
