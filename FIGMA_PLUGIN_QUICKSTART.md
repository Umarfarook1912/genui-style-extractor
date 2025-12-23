# Figma Plugin Quick Start Guide

## 🎯 Goal
Extract design styles from Figma and convert them to CSS/Tailwind/JSX code using GenUI.

## 📦 What You Need
- Node.js installed
- Figma Desktop App or Figma Web access
- Your GenUI app running

## 🚀 Setup (5 minutes)

### Step 1: Build the Plugin
```bash
cd figma-plugin
npm install
npm run build
```

This creates a `dist/` folder with your plugin files.

### Step 2: Load in Figma

1. Open Figma (Desktop or Web)
2. Click **Plugins** in the menu bar
3. Select **Development → Import plugin from manifest...**
4. Navigate to your project folder
5. Select: `figma-plugin/dist/manifest.json`
6. Click **Open**

✅ Plugin is now installed!

## 🎨 Using the Plugin

### In Figma:

1. **Create or Open a Design**
   - Open any Figma file with your designs

2. **Select Layers**
   - Click on a Frame, Button, Text, or any component
   - You can select multiple layers at once

3. **Run the Plugin**
   - Right-click on your selection
   - Navigate to: **Plugins → GenUI Style Extractor**
   - Or use: **Plugins** menu → **Development** → **GenUI Style Extractor**

4. **Extract Styles**
   - A popup window appears with the plugin UI
   - Click **🎨 Extract Styles** button
   - The plugin analyzes your selected layers
   - JSON output appears in the window

5. **Copy JSON**
   - Click **📋 Copy JSON** button
   - The JSON is now in your clipboard

### In GenUI App:

1. **Open GenUI**
   - Launch your GenUI web app
   - Make sure you're logged in

2. **Go to Figma Tab**
   - Click the **🎨 Figma Plugin** tab at the top

3. **Paste JSON**
   - Paste the copied JSON into the textarea
   - Click **✨ Parse Figma JSON**

4. **Convert to Code**
   - Choose your output format:
     - **Tailwind CSS** (recommended)
     - **CSS**
     - **JSX Style**
   - Click **✨ Convert Styles**

5. **Get Your Code**
   - Copy the generated code
   - Use it in your project!

## 💡 Examples

### Example 1: Extract a Button

**In Figma:**
1. Create a Frame: 120×40px
2. Add background color: `#667eea`
3. Add padding: 8px 16px
4. Add border radius: 8px
5. Select the frame
6. Run plugin → Extract → Copy JSON

**In GenUI:**
1. Paste JSON in Figma tab
2. Click Parse
3. Select "Tailwind CSS"
4. Get output like:
```jsx
className="w-30 h-10 bg-purple-500 rounded-lg px-4 py-2"
```

### Example 2: Extract Text Styles

**In Figma:**
1. Create a text layer
2. Set font: Inter, 16px, SemiBold
3. Color: `#1a1a1a`
4. Line height: 24px
5. Select the text
6. Run plugin → Extract → Copy JSON

**In GenUI:**
1. Paste JSON
2. Select "CSS"
3. Get output like:
```css
font-family: Inter;
font-size: 16px;
font-weight: 600;
line-height: 24px;
color: #1a1a1a;
```

### Example 3: Extract Auto-Layout Frame

**In Figma:**
1. Create an auto-layout frame
2. Set direction: Horizontal
3. Gap: 12px
4. Padding: 16px
5. Select the frame
6. Run plugin → Extract → Copy JSON

**In GenUI:**
1. Paste JSON
2. Select "Tailwind CSS"
3. Get output like:
```jsx
className="flex flex-row gap-3 p-4"
```

## 🎯 What Gets Extracted?

### ✅ Supported Properties

**Layout:**
- Width, height
- X, Y positions
- Auto-layout mode (horizontal/vertical)
- Item spacing
- Alignment

**Typography (Text nodes):**
- Font family
- Font size
- Font weight
- Line height
- Letter spacing
- Text alignment

**Colors:**
- Fill colors (converted to HEX)
- Stroke colors
- Background colors
- Opacity/alpha

**Spacing:**
- Padding (all sides)
- Border radius

**Effects:**
- Drop shadows
- Inner shadows
- Layer blur

## 🔧 Troubleshooting

### Plugin not appearing?
- Make sure you ran `npm run build`
- Check that `dist/` folder exists
- Try re-importing the manifest

### "No layers selected" error?
- Select at least one layer before running
- Supported: Frame, Rectangle, Text, Component, etc.

### JSON parse error in GenUI?
- Make sure you copied the complete JSON
- Check for any truncation
- Verify it starts with `{` and ends with `}`

### Colors look different?
- Figma uses RGB 0-1, plugin converts to HEX
- Alpha/opacity is preserved in 8-digit HEX

## 📝 Tips & Best Practices

1. **Name Your Layers**
   - Use descriptive names in Figma
   - They appear in the JSON for reference

2. **Select Smart**
   - Select parent frames for complete components
   - Or select individual elements for specific styles

3. **Use Components**
   - Extract from Figma components for consistency
   - Reuse JSON for similar elements

4. **Test First**
   - Try with simple elements first
   - Then move to complex components

5. **Iterate**
   - Extract → Generate → Refine → Repeat
   - Fine-tune your Figma designs based on output

## 🎉 Next Steps

1. **Try the Examples** - Extract some basic elements
2. **Extract Real Components** - Use your actual designs
3. **Generate Code** - Convert to your preferred format
4. **Integrate** - Use the code in your projects
5. **Share** - Show your team the workflow!

## 📚 More Resources

- Full documentation: [figma-plugin/README.md](figma-plugin/README.md)
- Example output: [figma-plugin/example-output.json](figma-plugin/example-output.json)
- Figma API: https://www.figma.com/plugin-docs/

---

Need help? Check the troubleshooting section or create an issue!
