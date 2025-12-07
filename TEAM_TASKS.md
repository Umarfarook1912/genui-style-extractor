# 👥 GenUI Team Task Distribution

## 🎯 Sprint Plan (Recommended Timeline)

### Week 1: Core Development (Dec 7-14)
### Week 2: Integration & Testing (Dec 15-21)
### Week 3: Polish & Submission (Dec 22-28)

---

## 👤 Member 1: Frontend UI Lead

### Responsibilities:
- [ ] Build React UI in `frontend/src/`
- [ ] Create component for style display
- [ ] Create code copy functionality
- [ ] Add Tailwind conversion toggle
- [ ] Style the interface

### Files to Work On:
```
frontend/
├─ src/
│  ├─ App.tsx              # Main app component
│  ├─ components/
│  │  ├─ StyleDisplay.tsx  # Show extracted styles
│  │  ├─ CodeOutput.tsx    # Display converted code
│  │  └─ CopyButton.tsx    # Copy to clipboard
```

### Key Features:
1. Display extracted CSS properties
2. Toggle between CSS/Tailwind output
3. Copy code button
4. Responsive preview
5. Color picker/display

### Dependencies:
```bash
cd frontend
npm install prismjs react-hot-toast
```

---

## 👤 Member 2: Content Script Lead

### Responsibilities:
- [ ] Element selection logic
- [ ] Style extraction from DOM
- [ ] Send data to popup
- [ ] Handle element highlighting

### Files to Work On:
```
chrome-dev/
├─ content-script.js       # DOM manipulation
├─ background.js           # Message handling
```

### Key Features:
1. Click to select element
2. Extract computed styles
3. Get dimensions, colors, spacing
4. Send to React popup

### Sample Code:
```javascript
// content-script.js
document.addEventListener('click', (e) => {
  if (extractionMode) {
    e.preventDefault();
    const styles = window.getComputedStyle(e.target);
    chrome.runtime.sendMessage({
      type: 'STYLES_EXTRACTED',
      data: extractStyles(styles)
    });
  }
});
```

---

## 👤 Member 3: Backend/Catalyst Lead

### Responsibilities:
- [ ] Write style conversion function
- [ ] px → rem conversion
- [ ] CSS → Tailwind conversion
- [ ] Deploy to Catalyst

### Files to Work On:
```
catalyst/
├─ functions/
│  └─ convertStyles/
│     ├─ index.js          # Main function
│     └─ package.json      # Dependencies
```

### Key Features:
1. Parse CSS properties
2. Convert to Tailwind classes
3. Handle responsive breakpoints
4. Return formatted code

### Sample Function:
```javascript
// catalyst/functions/convertStyles/index.js
exports.handler = async (req, res) => {
  const { styles, format } = req.body;
  
  if (format === 'tailwind') {
    const tailwind = convertToTailwind(styles);
    res.json({ code: tailwind });
  } else {
    res.json({ code: formatCSS(styles) });
  }
};
```

---

## 👤 Member 4: Integration & Testing Lead

### Responsibilities:
- [ ] Test chrome extension
- [ ] Package for Sigma
- [ ] Write documentation
- [ ] Create demo video
- [ ] Handle GitHub PRs

### Files to Work On:
```
sigma-package/
├─ plugin-manifest.json    # Sigma config
├─ README.md              # Documentation
```

### Key Tasks:
1. Test in Chrome developer mode
2. Test Catalyst API integration
3. Build + copy files to sigma-package
4. Create ZIP for submission
5. Test in Sigma sandbox

### Testing Checklist:
- [ ] Style extraction works
- [ ] Conversion API responds
- [ ] Copy button works
- [ ] No console errors
- [ ] Works on different websites

---

## 🔄 Daily Standup (Async on GitHub)

Each member posts daily update:
```markdown
## Dec 7 Update - [Your Name]
✅ Completed: Created StyleDisplay component
🔄 In Progress: Working on Tailwind conversion
🚧 Blocked: Need API endpoint from Member 3
```

---

## 🤝 Collaboration Workflow

### 1. Create Your Branch:
```bash
git checkout -b feature/your-feature-name
```

### 2. Work on Your Task:
```bash
# Make changes
git add .
git commit -m "feat: add style extraction"
```

### 3. Push & Create PR:
```bash
git push origin feature/your-feature-name
# Go to GitHub → Create Pull Request
```

### 4. Review & Merge:
- Other members review
- Fix issues if any
- Merge to main

---

## 📅 Milestone Deadlines

### Milestone 1 (Dec 14):
- [ ] Frontend UI working locally
- [ ] Content script extracts styles
- [ ] Catalyst function deployed
- [ ] Basic integration working

### Milestone 2 (Dec 21):
- [ ] Tailwind conversion working
- [ ] Chrome extension functional
- [ ] Sigma package created
- [ ] Testing complete

### Milestone 3 (Dec 27):
- [ ] All bugs fixed
- [ ] Demo video recorded
- [ ] Documentation complete
- [ ] Submission ready

---

## 🆘 Communication Channels

### For Quick Questions:
- WhatsApp/Telegram group
- GitHub Issues (for bugs)

### For Code Review:
- GitHub Pull Requests

### For Major Decisions:
- Team meeting (video call)

---

## 📚 Resources for Each Member

### Frontend Lead:
- React Docs: https://react.dev
- Vite Docs: https://vitejs.dev
- Tailwind CSS: https://tailwindcss.com

### Content Script Lead:
- Chrome Extension Docs: https://developer.chrome.com/docs/extensions/
- DOM API: https://developer.mozilla.org/en-US/docs/Web/API

### Backend Lead:
- Catalyst Docs: https://catalyst.zoho.com/help/
- Catalyst Functions: https://catalyst.zoho.com/help/functions/

### Testing Lead:
- Sigma Docs: https://www.zoho.com/sigma/
- Chrome DevTools: https://developer.chrome.com/docs/devtools/

---

## 🎯 Success Criteria

By submission date, we must have:
1. ✅ Working extension (Chrome + Sigma)
2. ✅ Style extraction functional
3. ✅ CSS/Tailwind conversion working
4. ✅ Clean, documented code
5. ✅ Demo video
6. ✅ Deployed to Catalyst

---

**Remember**: We're a team! Help each other, ask questions, and celebrate small wins! 🚀
