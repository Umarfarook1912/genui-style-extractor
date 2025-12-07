# 🚀 GenUI - Complete Build Guide for Beginners

## 📚 Understanding the Architecture

### Where Each Tool Fits:
- **VSCode + GitHub** → Your main development environment (YES, use these!)
- **Zoho Catalyst** → Backend serverless functions (replaces Node.js server)
- **Zoho Sigma** → Distribution platform (like Chrome Web Store, but for Zoho)

---

## 🏗️ Project Structure Explained

```
genui-style-extractor/
├─ frontend/              # Your React UI (what users see)
├─ chrome-dev/            # For testing as Chrome extension
├─ catalyst/              # Backend functions (deployed to Zoho)
└─ sigma-package/         # Final package for Zoho Sigma
```

---

## 📝 Development Workflow (Step-by-Step)

### **PHASE 1: Build Core Features Locally** ✅ (Current Phase)

#### Step 1.1: Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
- Runs on http://localhost:5173
- Build your React UI here
- Use VSCode as normal

#### Step 1.2: Test as Chrome Extension (Developer Mode)
1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```
2. Copy dist files to chrome-dev folder
3. Load in Chrome:
   - Go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select `chrome-dev` folder

#### Step 1.3: Setup Catalyst Functions
```bash
cd catalyst/functions/convertStyles
npm install
# Test function locally
node index.js
```

---

### **PHASE 2: Deploy Backend to Zoho Catalyst**

#### Prerequisites:
1. Install Zoho Catalyst CLI:
   ```bash
   npm install -g zcatalyst-cli
   ```

2. Login to Catalyst:
   ```bash
   catalyst login
   ```

3. Initialize Catalyst Project:
   ```bash
   cd catalyst
   catalyst init
   ```

4. Deploy Functions:
   ```bash
   catalyst deploy
   ```

#### What This Does:
- Uploads your `convertStyles` function to Zoho cloud
- Gives you an API endpoint URL
- No need for VPS/Render deployment!

---

### **PHASE 3: Package for Sigma Extension**

#### Step 3.1: Build Frontend for Production
```bash
cd frontend
npm run build
```

#### Step 3.2: Copy to Sigma Package
```bash
# Copy built files to sigma-package/app/
cp -r frontend/dist/* sigma-package/app/
```

#### Step 3.3: Configure plugin-manifest.json
- Set correct entry points
- Define permissions
- Add Zoho service integrations

#### Step 3.4: Zip for Upload
```bash
cd sigma-package
# Zip everything
zip -r genui-sigma.zip .
```

#### Step 3.5: Upload to Sigma
1. Go to Zoho Sigma Dashboard
2. Click "Upload Extension"
3. Upload `genui-sigma.zip`
4. Test in sandbox environment

---

## 👥 Team Collaboration

### Using GitHub (Recommended):
```bash
# Add collaborators in GitHub
# Each member clones:
git clone https://github.com/Umarfarook1912/genui-style-extractor
cd genui-style-extractor

# Create feature branches
git checkout -b feature/style-extractor
# Work on your part
git add .
git commit -m "Add style extraction logic"
git push origin feature/style-extractor
# Create Pull Request
```

### Division of Work:
- **Member 1**: Frontend React UI (frontend/)
- **Member 2**: Content Script + Style Extraction (chrome-dev/content-script.js)
- **Member 3**: Catalyst Functions (catalyst/functions/)
- **Member 4**: Testing + Integration (sigma-package/)

---

## 🔄 Development Cycle

```
1. Code in VSCode (frontend/ or catalyst/)
2. Test locally (localhost or chrome-dev)
3. Commit to GitHub (version control)
4. Deploy backend (catalyst deploy)
5. Build + Package (sigma-package)
6. Test in Sigma sandbox
7. Submit to hackathon
```

---

## 🛠️ Key Commands Cheat Sheet

### Frontend Development:
```bash
cd frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview build
```

### Catalyst Backend:
```bash
catalyst login       # One-time setup
catalyst deploy      # Deploy functions
catalyst logs        # View function logs
```

### Testing:
```bash
# Chrome extension test
cd chrome-dev
# Then load in chrome://extensions/

# Sigma package test
cd sigma-package
zip -r genui.zip .
# Upload to Sigma dashboard
```

---

## 📦 What You Need Installed

### On Your Machine:
- ✅ Node.js (you have this)
- ✅ VSCode (you have this)
- ✅ Git (you have this)
- ⬜ Zoho Catalyst CLI: `npm install -g zcatalyst-cli`

### In the Cloud:
- Zoho Catalyst account (from hackathon access)
- Zoho Sigma access (you mentioned you have this)

---

## 🎯 For Hackathon Submission

### Requirements:
1. ✅ Use at least one Zoho product → **Catalyst** (backend) ✅
2. ✅ Deploy as Sigma extension → **sigma-package/** ✅
3. ✅ Working demo
4. ✅ GitHub repository (shareable)

### What to Submit:
- Sigma extension package (genui-sigma.zip)
- GitHub repository link
- Demo video
- Documentation (README.md)

---

## 🚨 Common Questions

### Q: Do I use GitHub or Zoho's tools?
**A:** Use BOTH! GitHub for code collaboration, Zoho Catalyst for backend hosting.

### Q: Can I use my VPS?
**A:** No need! Catalyst replaces your VPS. It's serverless (free tier available).

### Q: How do teammates see my changes?
**A:** Push to GitHub → teammates pull → everyone works on same codebase.

### Q: Where does the app run?
**A:** 
- Development: Your local machine
- Testing: Chrome browser (developer mode)
- Production: Zoho Sigma marketplace

---

## 📞 Next Steps

1. **Now**: Finish core features locally
2. **Week 2**: Deploy to Catalyst
3. **Week 3**: Package for Sigma + test
4. **Before deadline**: Submit to hackathon

---

## 🔗 Useful Links

- Catalyst Docs: https://catalyst.zoho.com/help/
- Sigma Docs: https://www.zoho.com/sigma/
- Your GitHub: https://github.com/Umarfarook1912/genui-style-extractor

---

**Remember**: You're building 3 things:
1. React UI (frontend/)
2. Backend logic (catalyst/)
3. Sigma package (sigma-package/)

Keep coding in VSCode, use GitHub for teamwork, and Zoho only for deployment! 🚀
