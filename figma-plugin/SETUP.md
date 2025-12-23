# 🎨 GenUI Figma Plugin - Installation & Usage Guide

## 🚀 Quick Start (2 Minutes)

### Step 1: Build the Plugin

```bash
cd figma-plugin
npm install
npm run build
```

✅ You should see: "Build complete! Plugin files copied to dist/"

### Step 2: Load in Figma

1. Open **Figma Desktop** or go to **figma.com**
2. In the menu bar, click **Plugins**
3. Select **Development** → **Import plugin from manifest...**
4. Navigate to: `genui-style-extractor/figma-plugin/dist/`
5. Select **manifest.json**
6. Click **Open**

✅ Plugin is now installed!

## 📖 How to Use

### Extract Styles from Figma

1. **In Figma:**
   - Select any layer (Frame, Text, Rectangle, etc.)
   - Right-click → **Plugins** → **GenUI Style Extractor**
   - Click **🎨 Extract Styles**
   - Click **📋 Copy JSON**

2. **In GenUI App:**
   - Open your GenUI web app
   - Click the **🎨 Figma Plugin** tab (third tab)
   - Paste the JSON into the textarea
   - Click **✨ Parse Figma JSON**
   - Choose format (Tailwind/CSS/JSX)
   - Click **✨ Convert Styles**
   - Copy the generated code!

## 🎯 What Can You Extract?

### ✅ All Node Types
- Frames
- Components
- Rectangles
- Text
- Ellipses
- Polygons
- Groups
- Instances

### ✅ All Properties
- **Layout**: width, height, position, auto-layout
- **Typography**: font, size, weight, line-height, spacing
- **Colors**: fills, strokes, background (auto-converted to HEX)
- **Spacing**: padding, border radius
- **Effects**: shadows, blur

## 💡 Example Workflow

### Example 1: Button Component

**In Figma:**
```
1. Create a Frame (120×40px)
2. Fill: #667eea
3. Border radius: 8px
4. Padding: 8px 16px
5. Select it
6. Run plugin → Extract → Copy JSON
```

**In GenUI:**
```
1. Paste JSON in Figma tab
2. Click "Parse Figma JSON"
3. Select "Tailwind CSS"
4. Get: className="w-30 h-10 bg-purple-500 rounded-lg px-4 py-2"
```

### Example 2: Text Style

**In Figma:**
```
1. Create text: "Hello World"
2. Font: Inter, 16px, SemiBold
3. Color: #1a1a1a
4. Line height: 24px
5. Select it
6. Run plugin → Extract → Copy JSON
```

**In GenUI:**
```
1. Paste JSON
2. Select "CSS"
3. Get:
   font-family: Inter;
   font-size: 16px;
   font-weight: 600;
   line-height: 24px;
   color: #1a1a1a;
```

## 🔧 Development

### Watch Mode (for plugin development)

```bash
cd figma-plugin
npm run watch
```

This will automatically recompile when you edit `src/code.ts`.

After making changes:
1. Save your file
2. In Figma: **Plugins** → **Development** → **GenUI Style Extractor** (right-click) → **Reload**

### File Structure

```
figma-plugin/
├── src/
│   ├── code.ts       # Main plugin logic (edit this)
│   └── ui.html       # Plugin UI (edit this)
├── dist/             # Compiled output (auto-generated)
│   ├── code.js
│   ├── manifest.json
│   └── ui.html
├── manifest.json     # Plugin config
├── package.json      # Dependencies
├── tsconfig.json     # TypeScript config
├── build.js          # Build script
└── README.md         # Full documentation
```

## 🐛 Troubleshooting

### Plugin doesn't appear in Figma
**Solution:** Make sure you ran `npm run build` and the `dist/` folder exists.

### "No layers selected" error
**Solution:** Select at least one layer before running the plugin.

### Build errors
**Solution:**
```bash
rm -rf node_modules
npm install
npm run build
```

### JSON parse error in GenUI
**Solution:** 
- Copy the complete JSON from the plugin
- Check it starts with `{` and ends with `}`
- Verify no text was truncated

### Colors look different
**Note:** Figma uses RGB 0-1, which is converted to HEX. This is normal.

## 📚 More Resources

- **Full Documentation**: [figma-plugin/README.md](README.md)
- **Example Output**: [example-output.json](example-output.json)
- **Quick Start**: [FIGMA_PLUGIN_QUICKSTART.md](../FIGMA_PLUGIN_QUICKSTART.md)

## ✨ Features

- ✅ **No API Keys** - Runs entirely in Figma
- ✅ **No Network Calls** - All processing is local
- ✅ **Privacy First** - No data leaves your machine
- ✅ **Production Ready** - Clean, tested code
- ✅ **Beautiful UI** - Modern, intuitive interface
- ✅ **Copy to Clipboard** - One-click JSON copying

## 🎉 You're Ready!

Now you can:
1. Design in Figma
2. Extract with plugin
3. Convert in GenUI
4. Use in your code

Happy coding! 🚀

---

**Need help?** Check the [README.md](README.md) or [FIGMA_PLUGIN_QUICKSTART.md](../FIGMA_PLUGIN_QUICKSTART.md)

Made with ❤️ for Zoho Hackathon
