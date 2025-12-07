# 🚀 Quick Start Commands

## Initial Setup (One-time)
```bash
# Install Catalyst CLI globally
npm install -g zcatalyst-cli

# Install Chrome types for frontend
cd frontend
npm install --save-dev @types/chrome
cd ..

# Login to Zoho Catalyst
catalyst login
```

---

## Development Workflow

### 1. Frontend Development
```bash
cd frontend
npm install
npm run dev
# Opens at http://localhost:5173
```

### 2. Build Frontend
```bash
cd frontend
npm run build
# Creates dist/ folder
```

### 3. Test as Chrome Extension
```bash
# 1. Build frontend first
cd frontend
npm run build

# 2. Copy files to chrome-dev (Windows PowerShell)
cd ..
Copy-Item -Path "frontend\dist\*" -Destination "chrome-dev\" -Recurse -Force

# 3. Load in Chrome
# - Navigate to chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select the chrome-dev folder
```

### 4. Deploy Catalyst Function
```bash
cd catalyst
catalyst init    # First time only
catalyst deploy  # Deploy your functions

# Note the endpoint URL you get
# Update VITE_CATALYST_ENDPOINT in frontend/.env
```

### 5. Package for Sigma
```bash
# 1. Build production version
cd frontend
npm run build

# 2. Copy to sigma-package
cd ..
Copy-Item -Path "frontend\dist\*" -Destination "sigma-package\app\" -Recurse -Force

# 3. Create ZIP
Compress-Archive -Path "sigma-package\*" -DestinationPath "genui-sigma.zip" -Force

# 4. Upload to Sigma dashboard
```

---

## Git Workflow

### First Time Setup
```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### Daily Work
```bash
# 1. Pull latest changes
git pull origin main

# 2. Create feature branch
git checkout -b feature/your-feature

# 3. Make changes, then commit
git add .
git commit -m "feat: add style extraction feature"

# 4. Push to GitHub
git push origin feature/your-feature

# 5. Create Pull Request on GitHub
```

### Update from main
```bash
git checkout main
git pull origin main
git checkout feature/your-feature
git merge main
```

---

## Testing

### Test Content Script
```bash
# Load extension in Chrome
# Open any website
# Open DevTools console
# Click on an element
# Check console for extracted styles
```

### Test Catalyst Function (Local)
```bash
cd catalyst/functions/convertStyles
node -e "
const handler = require('./index.js');
const mockContext = {
  request: { body: { styles: { width: '100px' }, format: 'tailwind' } },
  response: {
    setStatus: (s) => console.log('Status:', s),
    setContentType: (t) => console.log('Type:', t),
    write: (d) => console.log('Response:', d)
  },
  log: { error: console.error }
};
handler(mockContext);
"
```

---

## Useful Catalyst Commands

```bash
# Login
catalyst login

# Initialize project
catalyst init

# Deploy all functions
catalyst deploy

# Deploy specific function
catalyst deploy --only functions/convertStyles

# View logs
catalyst logs

# List projects
catalyst projects

# List functions
catalyst functions

# Delete function
catalyst functions delete convertStyles
```

---

## Environment Variables

### Create `.env` in frontend/
```env
VITE_CATALYST_ENDPOINT=https://your-project-id.catalyst.zohoapis.com/functions/convertStyles
```

---

## Build & Deploy Checklist

- [ ] Frontend builds without errors (`npm run build`)
- [ ] Chrome extension loads without errors
- [ ] Catalyst function deployed successfully
- [ ] Can extract styles from webpage
- [ ] Can convert to Tailwind/CSS
- [ ] Copy button works
- [ ] Tested on multiple websites
- [ ] Updated `plugin-manifest.json` for Sigma
- [ ] Created ZIP for Sigma upload
- [ ] Tested in Sigma sandbox

---

## Troubleshooting

### Chrome Extension Not Working
```bash
# Check console errors
# Reload extension
# Re-build frontend
npm run build
```

### Catalyst Function Errors
```bash
# Check logs
catalyst logs

# Redeploy
catalyst deploy
```

### TypeScript Errors
```bash
# Install missing types
npm install --save-dev @types/chrome

# Add to tsconfig.app.json "types" array
"types": ["vite/client", "chrome"]
```

---

## For Demo Video

### Script:
1. Open GenUI extension
2. Click "Start Extraction"
3. Select an element on webpage
4. Show extracted styles
5. Convert to Tailwind
6. Copy code
7. Paste in your project
8. Show it works!

### Record:
- Use OBS Studio or Loom
- 1920x1080 resolution
- Clear audio
- 2-3 minutes max

---

## Team Communication

### Daily Standups (GitHub Issues)
```markdown
## Daily Update - Dec 7
**Name**: Your Name
**Completed**: Built React UI components
**In Progress**: Integrating Catalyst API
**Blocked**: Need API endpoint from backend team
**Tomorrow**: Test full flow
```

### Code Review Checklist
- [ ] Code follows project style
- [ ] No console.errors
- [ ] TypeScript types correct
- [ ] Functions documented
- [ ] Tested locally

---

## Important URLs

- **GitHub Repo**: https://github.com/Umarfarook1912/genui-style-extractor
- **Catalyst Dashboard**: https://catalyst.zoho.com/
- **Sigma Dashboard**: https://www.zoho.com/sigma/
- **Chrome Extensions**: chrome://extensions/

---

## Before Submission

1. **Code Quality**
   - [ ] Remove console.logs
   - [ ] Fix all TypeScript errors
   - [ ] Format code
   - [ ] Update README.md

2. **Testing**
   - [ ] Test on 5+ different websites
   - [ ] Test all conversion formats
   - [ ] Test copy functionality
   - [ ] Check mobile responsiveness

3. **Documentation**
   - [ ] Update README with screenshots
   - [ ] Add usage instructions
   - [ ] Document Catalyst setup
   - [ ] Add team member credits

4. **Submission**
   - [ ] Create demo video
   - [ ] Prepare presentation
   - [ ] Test Sigma package
   - [ ] Submit before deadline!

---

Good luck! 🚀
