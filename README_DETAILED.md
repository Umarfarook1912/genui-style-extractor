# 🎨 GenUI - Style Extractor & Code Generator

> **Turn any UI element into production-ready code instantly!**

GenUI is a smart browser extension built for the Zoho Community Hackathon that bridges the gap between design and development. Extract styles from any webpage and convert them into CSS, Tailwind CSS, or JSX code with a single click.

![GenUI Demo](https://via.placeholder.com/800x400?text=Add+Demo+Screenshot+Here)

---

## ✨ Features

- 🎯 **Click & Extract** - Select any element on a webpage to extract its styles
- 🎨 **Comprehensive Style Detection** - Colors, typography, spacing, dimensions, borders, and more
- 🔄 **Multiple Output Formats** - CSS, Tailwind CSS, or JSX inline styles
- 📏 **Smart Conversions** - Automatic px → rem conversion
- 📋 **One-Click Copy** - Copy generated code directly to clipboard
- ⚡ **Real-time Preview** - See extracted styles instantly
- 🔌 **Zoho Catalyst Powered** - Serverless backend for fast conversions

---

## 🏗️ Architecture

```
Frontend (React + TypeScript)
       ↓
Chrome Extension (Content Script)
       ↓
Background Service Worker
       ↓
Zoho Catalyst Functions (Backend)
       ↓
Zoho Sigma Extension (Deployment)
```

---

## 📦 Project Structure

```
genui-style-extractor/
├── frontend/                 # React UI (Vite + TypeScript)
│   ├── src/
│   │   ├── App.tsx          # Main application
│   │   └── App.css          # Styles
│   └── package.json
├── chrome-dev/               # Chrome extension for testing
│   ├── manifest.json
│   ├── content-script.js    # DOM style extraction
│   └── background.js        # Message handling
├── catalyst/                 # Zoho Catalyst backend
│   └── functions/
│       └── convertStyles/   # Conversion logic
│           ├── index.js
│           └── package.json
├── sigma-package/            # Final Sigma deployment package
│   ├── plugin-manifest.json
│   └── app/
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Chrome browser
- Zoho Catalyst account (from hackathon access)
- Git for version control

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Umarfarook1912/genui-style-extractor
   cd genui-style-extractor
   ```

2. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Install Catalyst CLI**
   ```bash
   npm install -g zcatalyst-cli
   catalyst login
   ```

4. **Setup Environment Variables**
   ```bash
   cd frontend
   cp .env.example .env
   # Edit .env with your Catalyst endpoint
   ```

---

## 💻 Development

### Run Frontend Locally
```bash
cd frontend
npm run dev
# Opens at http://localhost:5173
```

### Test as Chrome Extension
```bash
# 1. Build the frontend
cd frontend
npm run build

# 2. Copy to chrome-dev folder
cd ..
Copy-Item -Path "frontend\dist\*" -Destination "chrome-dev\" -Recurse -Force

# 3. Load in Chrome
# - Go to chrome://extensions/
# - Enable "Developer mode"
# - Click "Load unpacked"
# - Select chrome-dev folder
```

### Deploy Catalyst Function
```bash
cd catalyst
catalyst init
catalyst deploy
# Note the endpoint URL and add to frontend/.env
```

---

## 📖 How to Use

1. **Install Extension** - Load GenUI in Chrome
2. **Open Any Website** - Navigate to any webpage
3. **Click Extension Icon** - Open GenUI popup
4. **Start Extraction** - Click "Start Extraction" button
5. **Select Element** - Click on any element you want to extract styles from
6. **View Styles** - See extracted styles in the popup
7. **Choose Format** - Select CSS, Tailwind, or JSX
8. **Convert** - Click "Convert Styles"
9. **Copy Code** - Use the copy button to get the generated code
10. **Use in Your Project** - Paste the code wherever you need it!

---

## 🎯 Use Cases

- **Rapid Prototyping** - Quickly recreate UI elements from existing websites
- **Design Consistency** - Extract brand colors and typography from design systems
- **Learning Tool** - Understand how professional websites are styled
- **Component Library** - Build your component library faster
- **Responsive Design** - Extract and analyze responsive breakpoints

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **CSS3** - Styling

### Browser Extension
- **Manifest V3** - Chrome extension standard
- **Content Scripts** - DOM manipulation
- **Background Service Worker** - Message handling

### Backend
- **Zoho Catalyst** - Serverless functions
- **Node.js** - Runtime environment

### Deployment
- **Zoho Sigma** - Extension marketplace
- **GitHub** - Version control

---

## 👥 Team

- **Member 1** - Frontend Development
- **Member 2** - Content Script & Extension Logic
- **Member 3** - Backend Catalyst Functions
- **Member 4** - Testing & Integration

---

## 📝 Development Roadmap

### ✅ Phase 1 (Week 1)
- [x] Basic React UI
- [x] Content script for style extraction
- [x] Catalyst function setup
- [ ] Chrome extension integration

### 🔄 Phase 2 (Week 2)
- [ ] Tailwind conversion logic
- [ ] Multiple format support
- [ ] Copy to clipboard functionality
- [ ] Catalyst deployment

### 🎯 Phase 3 (Week 3)
- [ ] Sigma package preparation
- [ ] Testing on multiple websites
- [ ] Demo video creation
- [ ] Final submission

---

## 🐛 Known Issues & Limitations

- Some complex CSS properties may not convert perfectly to Tailwind
- Pseudo-elements (::before, ::after) are not extracted
- Browser-specific prefixes may need manual adjustment
- Very complex gradients might need refinement

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Zoho** - For hosting the hackathon and providing Catalyst/Sigma access
- **React Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework inspiration
- **Our Team** - For the hard work and dedication!

---

## 📞 Support

- **GitHub Issues**: [Report a bug](https://github.com/Umarfarook1912/genui-style-extractor/issues)
- **Documentation**: See [BUILD_GUIDE.md](BUILD_GUIDE.md) for detailed setup
- **Commands**: See [COMMANDS.md](COMMANDS.md) for quick reference

---

## 🎥 Demo Video

[![Watch Demo](https://via.placeholder.com/800x400?text=Demo+Video+Thumbnail)](https://youtube.com/your-demo-video)

---

## 📊 Project Stats

- **Lines of Code**: ~1500+
- **Components**: 1 main + utility functions
- **Supported Formats**: 3 (CSS, Tailwind, JSX)
- **Extracted Properties**: 30+
- **Development Time**: 3 weeks

---

## 🏆 Hackathon Submission

**Event**: Zoho Community Hackathon 2024  
**Category**: Developer Tools / Productivity  
**Team**: GenUI  
**Submission Date**: [Add Date]

---

## 📸 Screenshots

### Extension Popup
![Popup](https://via.placeholder.com/400x300?text=Popup+Screenshot)

### Style Extraction
![Extraction](https://via.placeholder.com/400x300?text=Extraction+Screenshot)

### Code Output
![Output](https://via.placeholder.com/400x300?text=Output+Screenshot)

---

**Made with ❤️ by the GenUI Team for Zoho Community Hackathon**

⭐ Star this repo if you find it useful!
