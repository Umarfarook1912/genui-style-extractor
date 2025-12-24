# Quick Start Guide - Style Conversion Feature

## 🎯 What's New?

Your Figma plugin now converts designs directly to CSS, JSX, or Tailwind code with automatic **px to rem** conversion!

## 🚀 How to Use

### Step 1: Extract Styles
1. Select one or more layers in Figma
2. Run the plugin: **Plugins → GenUI Style Extractor**
3. Click **"🎨 Extract Styles"**

### Step 2: Choose Your Format
After extraction, you'll see three format buttons:
- **CSS** - For standard stylesheets
- **JSX** - For React inline styles
- **Tailwind** - For Tailwind utility classes

Click the format you want!

### Step 3: Convert
Click **"⚡ Convert to Selected Format"**

The code is automatically:
- ✅ Generated with px→rem conversion
- ✅ Copied to your clipboard
- ✅ Displayed in the plugin

### Step 4: Use It!
Paste the code directly into your project - it's ready to go!

---

## 📋 Example Outputs

### Input: A Figma Button
```
Width: 120px
Height: 40px
Background: #667eea
Padding: 8px 16px
Border Radius: 8px
Font Size: 14px
```

### CSS Output
```css
.button {
  width: 7.500rem;
  height: 2.500rem;
  background-color: #667eea;
  padding-top: 0.500rem;
  padding-right: 1.000rem;
  padding-bottom: 0.500rem;
  padding-left: 1.000rem;
  border-radius: 0.500rem;
  font-size: 0.875rem;
}
```

### JSX Output
```jsx
const ButtonStyle = {
  width: '7.500rem',
  height: '2.500rem',
  backgroundColor: '#667eea',
  paddingTop: '0.500rem',
  paddingRight: '1.000rem',
  paddingBottom: '0.500rem',
  paddingLeft: '1.000rem',
  borderRadius: '0.500rem',
  fontSize: '0.875rem',
};

// Usage: <div style={ButtonStyle}>Click me</div>
```

### Tailwind Output
```
className="w-[7.50rem] h-[2.50rem] bg-[#667eea] pt-[0.50rem] pr-[1.00rem] pb-[0.50rem] pl-[1.00rem] rounded-[0.50rem] text-[0.88rem]"
```

---

## 💡 Tips

### Multiple Layers
Select multiple layers to extract and convert them all at once. Each layer gets its own style block.

### Layer Names Matter
- **CSS**: Layer name becomes class name (e.g., "Primary Button" → `.primary-button`)
- **JSX**: Layer name becomes variable name (e.g., "Primary Button" → `PrimaryButtonStyle`)
- **Tailwind**: Layer name appears in comments

### Rem Conversion
All sizes use **16px = 1rem** as the base:
- 8px = 0.5rem
- 16px = 1rem
- 24px = 1.5rem
- 32px = 2rem

### Still Need JSON?
Click **"📋 Copy JSON"** to get the raw extracted data instead of converted code.

---

## 🎨 Supported Properties

All these properties are converted automatically:

### ✅ Layout
- Width & Height
- Position (x, y)
- Display & Flexbox
- Gap/Spacing

### ✅ Typography
- Font Family
- Font Size
- Font Weight
- Line Height
- Letter Spacing
- Text Alignment

### ✅ Colors
- Background Colors
- Border Colors
- Text Colors

### ✅ Spacing
- Padding (all sides)
- Border Radius
- Margins

### ✅ Effects
- Box Shadows
- Drop Shadows
- Blur Effects

---

## 🔧 Installation Reminder

1. Navigate to plugin folder:
   ```bash
   cd figma-plugin
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. Load in Figma:
   - **Plugins → Development → Import plugin from manifest...**
   - Select: `figma-plugin/dist/manifest.json`

---

## 🐛 Troubleshooting

### Format buttons not showing?
Make sure you've clicked "Extract Styles" first!

### Convert button disabled?
Select a format (CSS, JSX, or Tailwind) first!

### Code looks wrong?
- Check that you selected the right layers in Figma
- Verify layer names don't have special characters
- Try re-extracting the styles

### Need help?
- Check the full README.md
- Review CONVERSION_FEATURE.md for technical details
- Look at example-output.json for sample data

---

## 📚 Resources

- **README.md** - Full documentation
- **CONVERSION_FEATURE.md** - Technical implementation details
- **SETUP.md** - Installation guide
- **example-output.json** - Sample extracted data

---

Made with ❤️ for the Zoho Hackathon
Version 1.1.0 - With Style Conversion Features
