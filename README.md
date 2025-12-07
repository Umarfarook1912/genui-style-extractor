# 🎨 GenUI - Style Extractor & Code Generator

<div align="center">

![GenUI Logo](https://via.placeholder.com/200x200?text=GenUI)

**Turn any UI element into production-ready code instantly!**

[![Made for Zoho Hackathon](https://img.shields.io/badge/Made%20for-Zoho%20Hackathon-blue)](https://zoho.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Demo Video](#) | [Documentation](./BUILD_GUIDE.md) | [Team](#team)

</div>

---

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/Umarfarook1912/genui-style-extractor
cd genui-style-extractor

# Use the helper script (recommended)
.\dev-helper.ps1 setup    # Install everything
.\dev-helper.ps1 dev      # Start development

# Or manually
cd frontend
npm install
npm run dev
```

Visit http://localhost:5173 to see the UI!

---

## ✨ What is GenUI?

GenUI is a smart browser extension that bridges the gap between design and development. Select any element on a webpage and instantly convert it into:

- 🎨 **Clean CSS** with optional px → rem conversion
- ⚡ **Tailwind Classes** with smart utility mapping
- ⚛️ **JSX Styles** ready for React components

Perfect for developers who want to:
- 🚀 Speed up frontend development
- 🎯 Learn from existing designs
- 📐 Maintain design consistency
- 🔄 Recreate UI components quickly

---

## 📸 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/800x400?text=Add+Screenshot+1" alt="Extension UI" width="400"/>
  <img src="https://via.placeholder.com/800x400?text=Add+Screenshot+2" alt="Style Extraction" width="400"/>
</div>

---

## 🎯 Features

### Core Features
- ✅ Click to select any webpage element
- ✅ Extract 30+ CSS properties automatically
- ✅ Convert to CSS, Tailwind, or JSX format
- ✅ Visual overlay highlights selected elements
- ✅ One-click copy to clipboard
- ✅ Real-time style preview

### Advanced Features
- ✅ Smart px → rem conversion
- ✅ Intelligent Tailwind class mapping
- ✅ Flex/Grid layout detection
- ✅ Color format conversion
- ✅ Typography extraction
- ✅ Spacing and border analysis

---

## 🏗️ Tech Stack

<table>
<tr>
<td width="50%">

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **CSS3** - Styling

</td>
<td width="50%">

### Backend
- **Zoho Catalyst** - Serverless functions
- **Node.js** - Runtime
- **Chrome APIs** - Extension integration

</td>
</tr>
</table>

---

## 📦 Project Structure

```
genui-style-extractor/
├── 📘 Documentation/
│   ├── BUILD_GUIDE.md       # Complete build instructions
│   ├── FOR_BEGINNERS.md     # Understanding Zoho
│   ├── TEAM_TASKS.md        # Task distribution
│   ├── COMMANDS.md          # Quick reference
│   ├── CHECKLIST.md         # Development checklist
│   └── SETUP_COMPLETE.md    # Setup summary
│
├── 🎨 frontend/             # React application
│   ├── src/
│   │   ├── App.tsx         # Main UI component
│   │   └── App.css         # Styling
│   └── package.json
│
├── 🔧 chrome-dev/           # Extension testing
│   ├── manifest.json       # Extension config
│   ├── content-script.js   # Style extraction
│   └── background.js       # Message handling
│
├── ☁️ catalyst/             # Backend functions
│   └── functions/
│       └── convertStyles/
│
└── 📦 sigma-package/        # Deployment package
```

---

## 📖 How to Use

### For Developers

1. **Install the Extension**
   ```bash
   .\dev-helper.ps1 extension
   # Then load in chrome://extensions/
   ```

2. **Navigate to Any Website**
   - Open any webpage you want to extract styles from

3. **Extract Styles**
   - Click the GenUI extension icon
   - Click "Start Extraction"
   - Click on any element

4. **Convert & Copy**
   - Choose your format (CSS/Tailwind/JSX)
   - Click "Convert Styles"
   - Click "Copy" button
   - Paste in your project!

### For Team Members

📚 **Start Here:**
1. Read [FOR_BEGINNERS.md](./FOR_BEGINNERS.md) first
2. Check your task in [TEAM_TASKS.md](./TEAM_TASKS.md)
3. Follow [BUILD_GUIDE.md](./BUILD_GUIDE.md) for setup
4. Use [COMMANDS.md](./COMMANDS.md) as reference

---

## 🛠️ Development

### Prerequisites
- Node.js 18+
- Chrome browser
- Zoho Catalyst account
- Git

### Setup
```bash
# Install dependencies
.\dev-helper.ps1 setup

# Start dev server
.\dev-helper.ps1 dev

# Build for production
.\dev-helper.ps1 build

# Create extension
.\dev-helper.ps1 extension

# Deploy to Catalyst
.\dev-helper.ps1 deploy

# Create Sigma package
.\dev-helper.ps1 package
```

For detailed instructions, see [BUILD_GUIDE.md](./BUILD_GUIDE.md)

---

## 🎥 Demo Video

[![GenUI Demo](https://via.placeholder.com/800x450?text=Click+to+Watch+Demo)](https://youtube.com/your-video-link)

---

## 👥 Team

<table>
<tr>
<td align="center" width="25%">
<img src="https://via.placeholder.com/100" width="100px;" alt="Member 1"/><br />
<sub><b>Frontend Lead</b></sub><br />
<sub>UI Development</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/100" width="100px;" alt="Member 2"/><br />
<sub><b>Extension Lead</b></sub><br />
<sub>Content Scripts</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/100" width="100px;" alt="Member 3"/><br />
<sub><b>Backend Lead</b></sub><br />
<sub>Catalyst Functions</sub>
</td>
<td align="center" width="25%">
<img src="https://via.placeholder.com/100" width="100px;" alt="Member 4"/><br />
<sub><b>Integration Lead</b></sub><br />
<sub>Testing & Docs</sub>
</td>
</tr>
</table>

---

## 📋 Roadmap

### ✅ Phase 1 (Complete)
- [x] Project structure setup
- [x] React UI with TypeScript
- [x] Content script with style extraction
- [x] Catalyst function for conversion
- [x] Complete documentation

### 🔄 Phase 2 (In Progress)
- [ ] Chrome extension integration
- [ ] Catalyst deployment
- [ ] End-to-end testing
- [ ] Multi-website testing

### 🎯 Phase 3 (Planned)
- [ ] Sigma package creation
- [ ] Demo video production
- [ ] Final polish
- [ ] Hackathon submission

### 🚀 Future (v2.0)
- [ ] Screenshot upload support
- [ ] Multiple element selection
- [ ] Component library export
- [ ] Figma integration
- [ ] VS Code extension

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

See [TEAM_TASKS.md](./TEAM_TASKS.md) for task ideas.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🏆 Acknowledgments

- **Zoho** - For hosting the hackathon and providing platform access
- **React Team** - For the amazing framework
- **Tailwind CSS** - For utility-first CSS inspiration
- **Chrome Extensions Team** - For comprehensive documentation

---

## 📞 Support & Links

- 📖 [Complete Documentation](./BUILD_GUIDE.md)
- 🐛 [Report Bug](https://github.com/Umarfarook1912/genui-style-extractor/issues)
- 💡 [Request Feature](https://github.com/Umarfarook1912/genui-style-extractor/issues)
- 💬 [Discussions](https://github.com/Umarfarook1912/genui-style-extractor/discussions)

---

## 📊 Project Stats

![GitHub last commit](https://img.shields.io/github/last-commit/Umarfarook1912/genui-style-extractor)
![GitHub issues](https://img.shields.io/github/issues/Umarfarook1912/genui-style-extractor)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Umarfarook1912/genui-style-extractor)
![GitHub stars](https://img.shields.io/github/stars/Umarfarook1912/genui-style-extractor)

---

<div align="center">

**Made with ❤️ for Zoho Community Hackathon 2024**

⭐ Star this repo if you find it useful!

[⬆ Back to Top](#-genui---style-extractor--code-generator)

</div>
