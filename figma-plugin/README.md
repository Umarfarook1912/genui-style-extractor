# GenUI Figma Style Extractor Plugin

Extract design styles directly from Figma to use with GenUI code generation.

## 🎯 Overview

This Figma plugin extracts design properties from selected layers and converts them into structured JSON that can be used with GenUI to generate CSS, Tailwind, or JSX code.

## ✨ Features

- **Extract from Multiple Layer Types**: Frame, Rectangle, Text, Component, Ellipse, Polygon, Group, Instance
- **Comprehensive Property Extraction**:
  - Layout (width, height, position, auto-layout)
  - Typography (font, size, weight, line height, letter spacing)
  - Colors (fills, strokes, backgrounds with HEX conversion)
  - Spacing (padding, border radius)
  - Effects (shadows, blur)
- **Clean JSON Output**: Structured, normalized data ready for code generation
- **Copy to Clipboard**: One-click JSON copying

## 🚀 Installation

### Prerequisites
- Node.js installed
- Figma Desktop App or Figma Web

### Steps

1. **Install Dependencies**
   ```bash
   cd figma-plugin
   npm install
   ```

2. **Build the Plugin**
   ```bash
   npm run build
   ```
   This creates a `dist/` folder with the compiled plugin files.

3. **Load in Figma**
   - Open Figma Desktop or Web
   - Go to: **Plugins → Development → Import plugin from manifest...**
   - Navigate to: `figma-plugin/dist/manifest.json`
   - Select the file

## 📖 Usage

### In Figma:

1. **Select Layers**
   - Select one or more layers you want to extract (Frame, Rectangle, Text, Component, etc.)

2. **Run Plugin**
   - Right-click → Plugins → GenUI Style Extractor
   - Or use: Plugins menu → Development → GenUI Style Extractor

3. **Extract Styles**
   - Click the "🎨 Extract Styles" button
   - View the generated JSON in the plugin UI

4. **Convert to Format** (New!)
   - After extraction, choose a format: **CSS**, **JSX**, or **Tailwind**
   - Click "⚡ Convert to Selected Format"
   - The converted code will be automatically copied to your clipboard
   - All pixel values are converted to rem (base 16px)

5. **Copy JSON** (Optional)
   - Click "📋 Copy JSON" to copy raw JSON to clipboard

### Conversion Examples:

#### CSS Output
```css
.button {
  width: 7.500rem;
  height: 2.500rem;
  background-color: #667eea;
  border-radius: 0.500rem;
  padding: 0.500rem 1.000rem;
  font-size: 0.875rem;
  font-weight: 600;
}
```

#### JSX Output
```jsx
const ButtonStyle = {
  width: '7.500rem',
  height: '2.500rem',
  backgroundColor: '#667eea',
  borderRadius: '0.500rem',
  padding: '0.500rem 1.000rem',
  fontSize: '0.875rem',
  fontWeight: '600',
};
// Usage: <div style={ButtonStyle}>Content</div>
```

#### Tailwind Output
```
className="w-[7.50rem] h-[2.50rem] bg-[#667eea] rounded-[0.50rem] px-[1.00rem] py-[0.50rem] text-[0.88rem] font-semibold"
```

## 📊 JSON Structure

The plugin outputs JSON in this format:

```json
{
  "source": "figma",
  "timestamp": "2025-12-23T10:30:00.000Z",
  "nodes": [
    {
      "id": "123:456",
      "name": "Button",
      "nodeType": "FRAME",
      "layout": {
        "width": 120,
        "height": 40,
        "x": 100,
        "y": 200,
        "layoutMode": "HORIZONTAL",
        "itemSpacing": 8,
        "primaryAxisAlignItems": "CENTER",
        "counterAxisAlignItems": "CENTER"
      },
      "typography": {
        "fontFamily": "Inter",
        "fontSize": 14,
        "fontWeight": "SemiBold",
        "lineHeight": "AUTO",
        "letterSpacing": 0,
        "textAlignHorizontal": "CENTER"
      },
      "colors": {
        "fills": ["#667eea"],
        "strokes": [],
        "background": "#667eea"
      },
      "spacing": {
        "paddingTop": 8,
        "paddingRight": 16,
        "paddingBottom": 8,
        "paddingLeft": 16,
        "borderRadius": 8
      },
      "effects": {
        "shadows": [
          {
            "type": "drop-shadow",
            "color": "#00000026",
            "x": 0,
            "y": 2,
            "blur": 4,
            "spread": 0
          }
        ]
      }
    }
  ]
}
```

## 🛠️ Development

### File Structure
```
figma-plugin/
├── src/
│   ├── code.ts        # Main plugin logic
│   └── ui.html        # Plugin UI
├── dist/              # Compiled output (generated)
├── manifest.json      # Plugin configuration
├── package.json       # Dependencies
├── tsconfig.json      # TypeScript config
└── build.js           # Build script
```

### Development Mode

1. **Watch TypeScript**
   ```bash
   npm run watch
   ```

2. **Make Changes**
   - Edit `src/code.ts` or `src/ui.html`
   - TypeScript will automatically recompile

3. **Reload in Figma**
   - In Figma: Plugins → Development → Reload plugin
   - Or use keyboard shortcut (varies by OS)

### Testing

1. Create a test file in Figma with various layer types
2. Add different properties (colors, typography, effects)
3. Select layers and run the plugin
4. Verify JSON output matches expected structure

## 🎨 Supported Properties

### All Layers
- ✅ Width, Height, X, Y positions
- ✅ Fill colors (solid, gradients)
- ✅ Stroke colors
- ✅ Border radius (uniform & individual corners)
- ✅ Padding (auto-layout frames)
- ✅ Drop shadows
- ✅ Inner shadows
- ✅ Layer blur

### Text Nodes
- ✅ Font family
- ✅ Font size
- ✅ Font weight
- ✅ Line height (px, %, auto)
- ✅ Letter spacing
- ✅ Text alignment
- ✅ Text decoration
- ✅ Text case

### Auto-Layout Frames
- ✅ Layout mode (horizontal/vertical)
- ✅ Item spacing
- ✅ Padding (all sides)
- ✅ Alignment properties

## 🔧 Troubleshooting

### Plugin doesn't show up in Figma
- Make sure you built the plugin (`npm run build`)
- Check that `dist/` folder exists with `manifest.json`, `code.js`, and `ui.html`
- Try re-importing the manifest

### "No layers selected" error
- Select at least one layer before running the plugin
- Supported types: Frame, Rectangle, Text, Component, etc.

### Colors look wrong
- The plugin converts Figma RGB (0-1 range) to HEX
- Alpha/opacity is included in 8-digit HEX when < 1

### Mixed values showing
- Occurs when multiple text styles are in one text node
- Try selecting text with consistent formatting

## 📚 Resources

- [Figma Plugin API Docs](https://www.figma.com/plugin-docs/)
- [GenUI Documentation](../README.md)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Make changes to `src/code.ts` or `src/ui.html`
2. Test thoroughly with various layer types
3. Build and verify in Figma
4. Submit pull request

## 📝 License

MIT License - See [LICENSE](../LICENSE) file for details

## 🎉 Example Workflow

1. **Design in Figma**
   - Create your UI components
   - Use proper naming conventions
   - Apply styles consistently

2. **Extract with Plugin**
   - Select component
   - Run GenUI Style Extractor
   - Copy JSON

3. **Generate Code in GenUI**
   - Paste JSON in Figma tab
   - Choose output format (CSS/Tailwind/JSX)
   - Get production-ready code

4. **Implement in Project**
   - Copy generated code
   - Integrate into your codebase
   - Customize as needed

---

Made with ❤️ for Zoho Hackathon
