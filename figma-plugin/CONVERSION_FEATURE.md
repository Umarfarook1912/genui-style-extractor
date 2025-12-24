# Style Conversion Feature

## Overview

The Figma plugin now supports direct conversion from extracted Figma designs to CSS, JSX, or Tailwind formats with automatic px to rem conversion.

## Features Added

### 1. Format Selection Buttons
After extracting styles from Figma layers, users can choose from three output formats:
- **CSS** - Standard CSS stylesheet format
- **JSX** - React inline style objects
- **Tailwind** - Tailwind CSS utility classes

### 2. Automatic px to rem Conversion
All pixel-based measurements are automatically converted to rem units using a 16px base:
- Width/Height
- Padding/Margin
- Font sizes
- Border radius
- Shadows
- Gap/Spacing
- Letter spacing
- Line height (when in px)

### 3. One-Click Conversion
After selecting a format and clicking "Convert", the code is:
1. Generated with all conversions applied
2. Automatically copied to clipboard
3. Displayed in the plugin UI

## Implementation Details

### New UI Components

#### Format Selection Buttons
```html
<div class="format-buttons">
  <button class="format-btn" id="cssBtn">CSS</button>
  <button class="format-btn" id="jsxBtn">JSX</button>
  <button class="format-btn" id="tailwindBtn">Tailwind</button>
</div>
<button class="primary-btn" id="convertBtn">
  ⚡ Convert to Selected Format
</button>
```

### Conversion Functions

#### 1. `pxToRem(px: number): string`
Utility function that converts pixels to rem:
```typescript
function pxToRem(px: number): string {
  return `${(px / 16).toFixed(3)}rem`;
}
```

#### 2. `convertToCSS(data: ExtractedStyle): string`
Generates standard CSS with class names derived from layer names:
- Layout properties (width, height)
- Colors (background, borders)
- Spacing (padding, border-radius)
- Typography (font-family, font-size, font-weight, line-height, letter-spacing)
- Effects (box-shadow)
- Flexbox (display, flex-direction, gap, justify-content, align-items)

Example output:
```css
.button {
  width: 7.500rem;
  height: 2.500rem;
  background-color: #667eea;
  border-radius: 0.500rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.500rem;
}
```

#### 3. `convertToJSX(data: ExtractedStyle): string`
Generates React inline style objects:
- PascalCase component names from layer names
- camelCase property names
- String values with rem units
- Usage example included

Example output:
```jsx
const ButtonStyle = {
  width: '7.500rem',
  height: '2.500rem',
  backgroundColor: '#667eea',
  borderRadius: '0.500rem',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '0.500rem',
};
// Usage: <div style={ButtonStyle}>Content</div>
```

#### 4. `convertToTailwind(data: ExtractedStyle): string`
Generates Tailwind utility classes:
- Arbitrary values for exact measurements
- Standard utilities where applicable
- Flexbox utilities
- Custom shadow values

Example output:
```
// Button
className="w-[7.50rem] h-[2.50rem] bg-[#667eea] rounded-[0.50rem] flex justify-center items-center gap-[0.50rem]"
```

## User Workflow

1. **Select layers in Figma**
2. **Click "Extract Styles"** - Extracts design properties to JSON
3. **Choose format** - Click CSS, JSX, or Tailwind button
4. **Click "Convert"** - Generates code and copies to clipboard
5. **Paste in your project** - Ready to use!

## Benefits

### 🚀 Speed
- No manual conversion needed
- Instant clipboard copy
- No intermediate steps required

### 🎯 Accuracy
- Consistent rem conversion (16px base)
- Proper property mapping
- Handles complex properties (shadows, flexbox)

### 💪 Flexibility
- Three popular output formats
- Can still access raw JSON if needed
- Works with single or multiple layers

### 🎨 Design Consistency
- Preserves exact Figma measurements
- Maintains color values
- Keeps typography settings

## Technical Notes

### Base Font Size
The conversion uses 16px as the base font size for rem calculations:
- 16px = 1rem
- 8px = 0.5rem
- 24px = 1.5rem

### Class/Variable Naming
- **CSS**: kebab-case (.button, .text-container)
- **JSX**: PascalCase (ButtonStyle, TextContainerStyle)
- **Tailwind**: Comments with PascalCase

### Property Mapping
All properties are intelligently mapped to their format-specific equivalents:
- `paddingTop` (Figma) → `padding-top` (CSS) → `paddingTop` (JSX) → `pt-[value]` (Tailwind)
- `fills` (Figma) → `background-color` (CSS) → `backgroundColor` (JSX) → `bg-[color]` (Tailwind)

### Edge Cases Handled
- Mixed font values
- Complex border radius (individual corners)
- Multiple shadows
- Auto layout properties
- Text decorations and transformations

## Future Enhancements

Potential improvements:
- Custom base font size selection
- SCSS/LESS output formats
- Styled-components output
- CSS modules format
- Export to file option
- Batch conversion with file structure
- Custom naming conventions
- Design token generation

## Files Modified

1. **ui.html** - Added format buttons, convert button, and selection logic
2. **code.ts** - Added conversion functions and message handler
3. **README.md** - Updated documentation with new features

## Testing

To test the new feature:
1. Build the plugin: `npm run build`
2. Load plugin in Figma
3. Select any layer (Frame, Rectangle, Text, etc.)
4. Extract styles
5. Choose CSS/JSX/Tailwind
6. Click Convert
7. Paste in code editor to verify output

## Version
Feature added: December 24, 2025
Plugin Version: 1.1.0 (with conversion features)
