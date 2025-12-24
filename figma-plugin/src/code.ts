/**
 * GenUI Figma Style Extractor
 * Extracts design properties from selected Figma layers
 */

// Type definitions for extracted data
interface ExtractedStyle {
  source: string;
  timestamp: string;
  nodes: NodeStyle[];
}

interface NodeStyle {
  id: string;
  name: string;
  nodeType: string;
  layout: LayoutProperties;
  typography?: TypographyProperties;
  colors: ColorProperties;
  spacing: SpacingProperties;
  effects: EffectProperties;
}

interface LayoutProperties {
  width: number | string;
  height: number | string;
  x: number;
  y: number;
  layoutMode?: string;
  primaryAxisAlignItems?: string;
  counterAxisAlignItems?: string;
  itemSpacing?: number;
}

interface TypographyProperties {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlignHorizontal?: string;
  textDecoration?: string;
  textCase?: string;
}

interface ColorProperties {
  fills: string[];
  strokes: string[];
  background?: string;
}

interface SpacingProperties {
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  borderRadius?: number | string;
}

interface EffectProperties {
  shadows: Shadow[];
  blur?: string;
}

interface Shadow {
  type: string;
  color: string;
  x: number;
  y: number;
  blur: number;
  spread?: number;
}

// Utility: Convert Figma RGB (0-1) to HEX
function rgbToHex(r: number, g: number, b: number, a: number = 1): string {
  const toHex = (value: number) => {
    const hex = Math.round(value * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const hexColor = `#${toHex(r)}${toHex(g)}${toHex(b)}`;

  if (a < 1) {
    return `${hexColor}${toHex(a)}`;
  }

  return hexColor;
}

// Extract fill colors from node
function extractFills(node: SceneNode): string[] {
  const fills: string[] = [];

  if ('fills' in node && node.fills !== figma.mixed) {
    const fillArray = Array.isArray(node.fills) ? node.fills : [node.fills];

    fillArray.forEach(fill => {
      if (fill.type === 'SOLID' && fill.visible !== false) {
        const { r, g, b } = fill.color;
        const alpha = (fill.opacity !== undefined && fill.opacity !== null) ? fill.opacity : 1;
        fills.push(rgbToHex(r, g, b, alpha));
      } else if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL') {
        fills.push(`gradient-${fill.type.toLowerCase()}`);
      }
    });
  }

  return fills;
}

// Extract stroke colors
function extractStrokes(node: SceneNode): string[] {
  const strokes: string[] = [];

  if ('strokes' in node) {
    const nodeStrokes = node.strokes;
    if (Array.isArray(nodeStrokes)) {
      nodeStrokes.forEach(stroke => {
        if (stroke.type === 'SOLID' && stroke.visible !== false) {
          const { r, g, b } = stroke.color;
          const alpha = (stroke.opacity !== undefined && stroke.opacity !== null) ? stroke.opacity : 1;
          strokes.push(rgbToHex(r, g, b, alpha));
        }
      });
    }
  }

  return strokes;
}

// Extract layout properties
function extractLayout(node: SceneNode): LayoutProperties {
  const layout: LayoutProperties = {
    width: 'width' in node ? node.width : 0,
    height: 'height' in node ? node.height : 0,
    x: 'x' in node ? node.x : 0,
    y: 'y' in node ? node.y : 0,
  };

  // Auto Layout properties
  if ('layoutMode' in node && node.layoutMode !== 'NONE') {
    layout.layoutMode = node.layoutMode;
    layout.itemSpacing = node.itemSpacing;
    layout.primaryAxisAlignItems = node.primaryAxisAlignItems;
    layout.counterAxisAlignItems = node.counterAxisAlignItems;
  }

  return layout;
}

// Extract typography (Text nodes only)
function extractTypography(node: TextNode): TypographyProperties {
  const typography: TypographyProperties = {};

  try {
    typography.fontFamily = node.fontName !== figma.mixed ? node.fontName.family : 'mixed';
    typography.fontSize = node.fontSize !== figma.mixed ? node.fontSize : undefined;
    typography.fontWeight = node.fontName !== figma.mixed ? node.fontName.style : 'mixed';
    typography.textAlignHorizontal = node.textAlignHorizontal;

    // Line height
    if (node.lineHeight !== figma.mixed) {
      if (node.lineHeight.unit === 'PIXELS') {
        typography.lineHeight = node.lineHeight.value;
      } else if (node.lineHeight.unit === 'PERCENT') {
        typography.lineHeight = `${node.lineHeight.value}%`;
      } else {
        typography.lineHeight = 'AUTO';
      }
    }

    // Letter spacing
    if (node.letterSpacing !== figma.mixed) {
      if (node.letterSpacing.unit === 'PIXELS') {
        typography.letterSpacing = node.letterSpacing.value;
      } else {
        typography.letterSpacing = `${node.letterSpacing.value}%`;
      }
    }

    typography.textDecoration = node.textDecoration !== figma.mixed ? node.textDecoration : 'NONE';
    typography.textCase = node.textCase !== figma.mixed ? node.textCase : 'ORIGINAL';
  } catch (error) {
    console.error('Error extracting typography:', error);
  }

  return typography;
}

// Extract spacing and border radius
function extractSpacing(node: SceneNode): SpacingProperties {
  const spacing: SpacingProperties = {};

  if ('paddingTop' in node) {
    spacing.paddingTop = node.paddingTop;
  }
  if ('paddingRight' in node) {
    spacing.paddingRight = node.paddingRight;
  }
  if ('paddingBottom' in node) {
    spacing.paddingBottom = node.paddingBottom;
  }
  if ('paddingLeft' in node) {
    spacing.paddingLeft = node.paddingLeft;
  }

  if ('cornerRadius' in node && node.cornerRadius !== figma.mixed) {
    spacing.borderRadius = node.cornerRadius;
  } else if ('topLeftRadius' in node) {
    spacing.borderRadius = `${node.topLeftRadius} ${node.topRightRadius} ${node.bottomRightRadius} ${node.bottomLeftRadius}`;
  }

  return spacing;
}

// Extract effects (shadows, blur)
function extractEffects(node: SceneNode): EffectProperties {
  const effects: EffectProperties = { shadows: [] };

  if ('effects' in node && node.effects.length > 0) {
    node.effects.forEach(effect => {
      if (effect.visible !== false) {
        if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
          const { r, g, b, a } = effect.color;
          effects.shadows.push({
            type: effect.type === 'DROP_SHADOW' ? 'drop-shadow' : 'inner-shadow',
            color: rgbToHex(r, g, b, a),
            x: effect.offset.x,
            y: effect.offset.y,
            blur: effect.radius,
            spread: effect.spread || 0,
          });
        } else if (effect.type === 'LAYER_BLUR') {
          effects.blur = `${effect.radius}px`;
        }
      }
    });
  }

  return effects;
}

// Main extraction function
function extractNodeStyles(node: SceneNode): NodeStyle {
  const nodeStyle: NodeStyle = {
    id: node.id,
    name: node.name,
    nodeType: node.type,
    layout: extractLayout(node),
    colors: {
      fills: extractFills(node),
      strokes: extractStrokes(node),
    },
    spacing: extractSpacing(node),
    effects: extractEffects(node),
  };

  // Add typography for text nodes
  if (node.type === 'TEXT') {
    nodeStyle.typography = extractTypography(node as TextNode);
  }

  return nodeStyle;
}

// Plugin initialization
figma.showUI(__html__, { width: 400, height: 600 });

// Utility: Convert px to rem (assuming 16px base)
function pxToRem(px: number): string {
  return `${(px / 16).toFixed(3)}rem`;
}

// Utility: Format value based on pxToRem flag
function formatValue(px: number, usePxToRem: boolean): string {
  return usePxToRem ? pxToRem(px) : `${px}px`;
}

// Convert JSON to CSS
function convertToCSS(data: ExtractedStyle, usePxToRem: boolean = true): string {
  let css = '/* Generated CSS from Figma */\n\n';

  data.nodes.forEach(node => {
    const className = node.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    css += `.${className} {\n`;

    // Layout
    if (node.layout.width !== 'auto') {
      css += `  width: ${formatValue(node.layout.width as number, usePxToRem)};\n`;
    }
    if (node.layout.height !== 'auto') {
      css += `  height: ${formatValue(node.layout.height as number, usePxToRem)};\n`;
    }

    // Colors
    if (node.colors.fills.length > 0) {
      css += `  background-color: ${node.colors.fills[0]};\n`;
    }
    if (node.colors.strokes.length > 0) {
      css += `  border: 1px solid ${node.colors.strokes[0]};\n`;
    }

    // Spacing
    if (node.spacing.paddingTop !== undefined) {
      css += `  padding-top: ${formatValue(node.spacing.paddingTop, usePxToRem)};\n`;
    }
    if (node.spacing.paddingRight !== undefined) {
      css += `  padding-right: ${formatValue(node.spacing.paddingRight, usePxToRem)};\n`;
    }
    if (node.spacing.paddingBottom !== undefined) {
      css += `  padding-bottom: ${formatValue(node.spacing.paddingBottom, usePxToRem)};\n`;
    }
    if (node.spacing.paddingLeft !== undefined) {
      css += `  padding-left: ${formatValue(node.spacing.paddingLeft, usePxToRem)};\n`;
    }
    if (node.spacing.borderRadius !== undefined) {
      const radius = typeof node.spacing.borderRadius === 'number'
        ? formatValue(node.spacing.borderRadius, usePxToRem)
        : node.spacing.borderRadius.split(' ').map(r => formatValue(parseFloat(r), usePxToRem)).join(' ');
      css += `  border-radius: ${radius};\n`;
    }

    // Typography
    if (node.typography) {
      if (node.typography.fontFamily) {
        css += `  font-family: '${node.typography.fontFamily}', sans-serif;\n`;
      }
      if (node.typography.fontSize) {
        css += `  font-size: ${formatValue(node.typography.fontSize, usePxToRem)};\n`;
      }
      if (node.typography.fontWeight) {
        css += `  font-weight: ${node.typography.fontWeight};\n`;
      }
      if (node.typography.lineHeight) {
        const lineHeight = typeof node.typography.lineHeight === 'number'
          ? formatValue(node.typography.lineHeight, usePxToRem)
          : node.typography.lineHeight;
        css += `  line-height: ${lineHeight};\n`;
      }
      if (node.typography.letterSpacing) {
        const letterSpacing = typeof node.typography.letterSpacing === 'number'
          ? formatValue(node.typography.letterSpacing, usePxToRem)
          : node.typography.letterSpacing;
        css += `  letter-spacing: ${letterSpacing};\n`;
      }
      if (node.typography.textAlignHorizontal) {
        css += `  text-align: ${node.typography.textAlignHorizontal.toLowerCase()};\n`;
      }
    }

    // Effects
    if (node.effects.shadows.length > 0) {
      const shadows = node.effects.shadows.map(shadow => {
        const x = formatValue(shadow.x, usePxToRem);
        const y = formatValue(shadow.y, usePxToRem);
        const blur = formatValue(shadow.blur, usePxToRem);
        const spread = shadow.spread ? formatValue(shadow.spread, usePxToRem) + ' ' : '';
        return `${x} ${y} ${blur} ${spread}${shadow.color}`;
      }).join(', ');
      css += `  box-shadow: ${shadows};\n`;
    }

    // Flexbox
    if (node.layout.layoutMode) {
      css += `  display: flex;\n`;
      css += `  flex-direction: ${node.layout.layoutMode === 'HORIZONTAL' ? 'row' : 'column'};\n`;
      if (node.layout.itemSpacing) {
        css += `  gap: ${formatValue(node.layout.itemSpacing, usePxToRem)};\n`;
      }
      if (node.layout.primaryAxisAlignItems) {
        const justify = node.layout.primaryAxisAlignItems.toLowerCase().replace('_', '-');
        css += `  justify-content: ${justify};\n`;
      }
      if (node.layout.counterAxisAlignItems) {
        const align = node.layout.counterAxisAlignItems.toLowerCase().replace('_', '-');
        css += `  align-items: ${align};\n`;
      }
    }

    css += '}\n\n';
  });

  return css;
}

// Convert JSON to JSX inline styles
function convertToJSX(data: ExtractedStyle, usePxToRem: boolean = true): string {
  let jsx = '/* Generated JSX styles from Figma */\n\n';

  data.nodes.forEach(node => {
    const componentName = node.name
      .split(/[\s-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    jsx += `const ${componentName}Style = {\n`;

    // Layout
    if (node.layout.width !== 'auto') {
      jsx += `  width: '${formatValue(node.layout.width as number, usePxToRem)}',\n`;
    }
    if (node.layout.height !== 'auto') {
      jsx += `  height: '${formatValue(node.layout.height as number, usePxToRem)}',\n`;
    }

    // Colors
    if (node.colors.fills.length > 0) {
      jsx += `  backgroundColor: '${node.colors.fills[0]}',\n`;
    }
    if (node.colors.strokes.length > 0) {
      jsx += `  border: '1px solid ${node.colors.strokes[0]}',\n`;
    }

    // Spacing
    if (node.spacing.paddingTop !== undefined) {
      jsx += `  paddingTop: '${formatValue(node.spacing.paddingTop, usePxToRem)}',\n`;
    }
    if (node.spacing.paddingRight !== undefined) {
      jsx += `  paddingRight: '${formatValue(node.spacing.paddingRight, usePxToRem)}',\n`;
    }
    if (node.spacing.paddingBottom !== undefined) {
      jsx += `  paddingBottom: '${formatValue(node.spacing.paddingBottom, usePxToRem)}',\n`;
    }
    if (node.spacing.paddingLeft !== undefined) {
      jsx += `  paddingLeft: '${formatValue(node.spacing.paddingLeft, usePxToRem)}',\n`;
    }
    if (node.spacing.borderRadius !== undefined) {
      const radius = typeof node.spacing.borderRadius === 'number'
        ? formatValue(node.spacing.borderRadius, usePxToRem)
        : node.spacing.borderRadius.split(' ').map(r => formatValue(parseFloat(r), usePxToRem)).join(' ');
      jsx += `  borderRadius: '${radius}',\n`;
    }

    // Typography
    if (node.typography) {
      if (node.typography.fontFamily) {
        jsx += `  fontFamily: '${node.typography.fontFamily}, sans-serif',\n`;
      }
      if (node.typography.fontSize) {
        jsx += `  fontSize: '${formatValue(node.typography.fontSize, usePxToRem)}',\n`;
      }
      if (node.typography.fontWeight) {
        jsx += `  fontWeight: '${node.typography.fontWeight}',\n`;
      }
      if (node.typography.lineHeight) {
        const lineHeight = typeof node.typography.lineHeight === 'number'
          ? formatValue(node.typography.lineHeight, usePxToRem)
          : node.typography.lineHeight;
        jsx += `  lineHeight: '${lineHeight}',\n`;
      }
      if (node.typography.letterSpacing) {
        const letterSpacing = typeof node.typography.letterSpacing === 'number'
          ? formatValue(node.typography.letterSpacing, usePxToRem)
          : node.typography.letterSpacing;
        jsx += `  letterSpacing: '${letterSpacing}',\n`;
      }
      if (node.typography.textAlignHorizontal) {
        jsx += `  textAlign: '${node.typography.textAlignHorizontal.toLowerCase()}',\n`;
      }
    }

    // Effects
    if (node.effects.shadows.length > 0) {
      const shadows = node.effects.shadows.map(shadow => {
        const x = formatValue(shadow.x, usePxToRem);
        const y = formatValue(shadow.y, usePxToRem);
        const blur = formatValue(shadow.blur, usePxToRem);
        const spread = shadow.spread ? formatValue(shadow.spread, usePxToRem) + ' ' : '';
        return `${x} ${y} ${blur} ${spread}${shadow.color}`;
      }).join(', ');
      jsx += `  boxShadow: '${shadows}',\n`;
    }

    // Flexbox
    if (node.layout.layoutMode) {
      jsx += `  display: 'flex',\n`;
      jsx += `  flexDirection: '${node.layout.layoutMode === 'HORIZONTAL' ? 'row' : 'column'}',\n`;
      if (node.layout.itemSpacing) {
        jsx += `  gap: '${formatValue(node.layout.itemSpacing, usePxToRem)}',\n`;
      }
      if (node.layout.primaryAxisAlignItems) {
        const justify = node.layout.primaryAxisAlignItems.toLowerCase().replace('_', '-');
        jsx += `  justifyContent: '${justify}',\n`;
      }
      if (node.layout.counterAxisAlignItems) {
        const align = node.layout.counterAxisAlignItems.toLowerCase().replace('_', '-');
        jsx += `  alignItems: '${align}',\n`;
      }
    }

    jsx += '};\n\n';
    jsx += `// Usage: <div style={${componentName}Style}>Content</div>\n\n`;
  });

  return jsx;
}

// Convert JSON to Tailwind classes
function convertToTailwind(data: ExtractedStyle, usePxToRem: boolean = true): string {
  let tailwind = '/* Generated Tailwind classes from Figma */\n\n';

  data.nodes.forEach(node => {
    const componentName = node.name
      .split(/[\s-_]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');

    tailwind += `// ${componentName}\n`;
    let classes: string[] = [];

    // Layout - Tailwind uses fixed values, so we'll use arbitrary values
    if (node.layout.width !== 'auto') {
      const width = usePxToRem
        ? `${((node.layout.width as number) / 16).toFixed(2)}rem`
        : `${node.layout.width}px`;
      classes.push(`w-[${width}]`);
    }
    if (node.layout.height !== 'auto') {
      const height = usePxToRem
        ? `${((node.layout.height as number) / 16).toFixed(2)}rem`
        : `${node.layout.height}px`;
      classes.push(`h-[${height}]`);
    }

    // Colors - using arbitrary values for exact colors
    if (node.colors.fills.length > 0) {
      classes.push(`bg-[${node.colors.fills[0]}]`);
    }
    if (node.colors.strokes.length > 0) {
      classes.push(`border`, `border-[${node.colors.strokes[0]}]`);
    }

    // Spacing
    if (node.spacing.paddingTop !== undefined) {
      const padding = usePxToRem
        ? `${(node.spacing.paddingTop / 16).toFixed(2)}rem`
        : `${node.spacing.paddingTop}px`;
      classes.push(`pt-[${padding}]`);
    }
    if (node.spacing.paddingRight !== undefined) {
      const padding = usePxToRem
        ? `${(node.spacing.paddingRight / 16).toFixed(2)}rem`
        : `${node.spacing.paddingRight}px`;
      classes.push(`pr-[${padding}]`);
    }
    if (node.spacing.paddingBottom !== undefined) {
      const padding = usePxToRem
        ? `${(node.spacing.paddingBottom / 16).toFixed(2)}rem`
        : `${node.spacing.paddingBottom}px`;
      classes.push(`pb-[${padding}]`);
    }
    if (node.spacing.paddingLeft !== undefined) {
      const padding = usePxToRem
        ? `${(node.spacing.paddingLeft / 16).toFixed(2)}rem`
        : `${node.spacing.paddingLeft}px`;
      classes.push(`pl-[${padding}]`);
    }
    if (node.spacing.borderRadius !== undefined) {
      if (typeof node.spacing.borderRadius === 'number') {
        const radius = usePxToRem
          ? `${(node.spacing.borderRadius / 16).toFixed(2)}rem`
          : `${node.spacing.borderRadius}px`;
        classes.push(`rounded-[${radius}]`);
      }
    }

    // Typography
    if (node.typography) {
      if (node.typography.fontSize) {
        const size = usePxToRem
          ? `${(node.typography.fontSize / 16).toFixed(2)}rem`
          : `${node.typography.fontSize}px`;
        classes.push(`text-[${size}]`);
      }
      if (node.typography.fontWeight) {
        const weight = String(node.typography.fontWeight).toLowerCase();
        if (weight.includes('bold')) classes.push('font-bold');
        else if (weight.includes('semi')) classes.push('font-semibold');
        else if (weight.includes('medium')) classes.push('font-medium');
        else if (weight.includes('light')) classes.push('font-light');
        else classes.push('font-normal');
      }
      if (node.typography.textAlignHorizontal) {
        const align = node.typography.textAlignHorizontal.toLowerCase();
        if (align === 'center') classes.push('text-center');
        else if (align === 'right') classes.push('text-right');
        else if (align === 'left') classes.push('text-left');
      }
    }

    // Flexbox
    if (node.layout.layoutMode) {
      classes.push('flex');
      if (node.layout.layoutMode === 'VERTICAL') {
        classes.push('flex-col');
      }
      if (node.layout.itemSpacing) {
        const gap = usePxToRem
          ? `${(node.layout.itemSpacing / 16).toFixed(2)}rem`
          : `${node.layout.itemSpacing}px`;
        classes.push(`gap-[${gap}]`);
      }
      if (node.layout.primaryAxisAlignItems) {
        const justify = node.layout.primaryAxisAlignItems.toLowerCase();
        if (justify.includes('center')) classes.push('justify-center');
        else if (justify.includes('end')) classes.push('justify-end');
        else if (justify.includes('space_between')) classes.push('justify-between');
        else classes.push('justify-start');
      }
      if (node.layout.counterAxisAlignItems) {
        const align = node.layout.counterAxisAlignItems.toLowerCase();
        if (align.includes('center')) classes.push('items-center');
        else if (align.includes('end')) classes.push('items-end');
        else classes.push('items-start');
      }
    }

    // Effects
    if (node.effects.shadows.length > 0) {
      // For custom shadows, use arbitrary values
      const shadow = node.effects.shadows[0];
      const x = usePxToRem ? `${(shadow.x / 16).toFixed(2)}rem` : `${shadow.x}px`;
      const y = usePxToRem ? `${(shadow.y / 16).toFixed(2)}rem` : `${shadow.y}px`;
      const blur = usePxToRem ? `${(shadow.blur / 16).toFixed(2)}rem` : `${shadow.blur}px`;
      classes.push(`shadow-[${x}_${y}_${blur}_${shadow.color}]`);
    }

    tailwind += `className="${classes.join(' ')}"\n\n`;
  });

  return tailwind;
}

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'extract-styles') {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.ui.postMessage({
        type: 'error',
        message: 'Please select at least one layer to extract styles.',
      });
      return;
    }

    try {
      const extractedNodes: NodeStyle[] = [];

      const supportedTypes = new Set([
        'FRAME', 'COMPONENT', 'RECTANGLE', 'TEXT', 'ELLIPSE', 'POLYGON',
        'GROUP', 'INSTANCE', 'VECTOR', 'LINE', 'STAR', 'BOOLEAN_OPERATION',
        'REGULAR_POLYGON', 'SLICE', 'COMPONENT_SET'
      ]);

      // Try extract styles from any supported node, but also attempt generic extraction
      for (const node of selection) {
        const nodeType = node.type;

        if (supportedTypes.has(nodeType) || ('width' in node && 'height' in node)) {
          const nodeStyle = extractNodeStyles(node as SceneNode);
          extractedNodes.push(nodeStyle);
          continue;
        }

        // If node is an instance of something that has children, try to extract from its children
        if ('children' in node && Array.isArray((node as any).children) && (node as any).children.length > 0) {
          for (const child of (node as any).children) {
            if (supportedTypes.has(child.type) || ('width' in child && 'height' in child)) {
              const nodeStyle = extractNodeStyles(child as SceneNode);
              extractedNodes.push(nodeStyle);
            }
          }
        }
      }

      if (extractedNodes.length === 0) {
        // Provide diagnostic information back to the UI to help the user
        const detected = selection.map(n => `${n.name || 'unnamed'} (${n.type})`);
        figma.ui.postMessage({
          type: 'error',
          message: `No supported layers found in selection. Detected: ${detected.join(', ')}. Try selecting frames, rectangles, text layers, components, or their child elements.`,
        });
        return;
      }

      const result: ExtractedStyle = {
        source: 'figma',
        timestamp: new Date().toISOString(),
        nodes: extractedNodes,
      };

      figma.ui.postMessage({
        type: 'extraction-complete',
        data: result,
      });

      figma.notify(`✅ Extracted styles from ${extractedNodes.length} layer(s)`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      figma.ui.postMessage({
        type: 'error',
        message: `Extraction failed: ${errorMessage}`,
      });
    }
  }

  if (msg.type === 'convert-styles') {
    try {
      const { format, data, pxToRem } = msg;
      const usePxToRem = pxToRem !== undefined ? pxToRem : true;
      let convertedCode = '';

      switch (format) {
        case 'css':
          convertedCode = convertToCSS(data, usePxToRem);
          break;
        case 'jsx':
          convertedCode = convertToJSX(data, usePxToRem);
          break;
        case 'tailwind':
          convertedCode = convertToTailwind(data, usePxToRem);
          break;
        default:
          throw new Error('Invalid format selected');
      }

      figma.ui.postMessage({
        type: 'conversion-complete',
        code: convertedCode,
      });

      const unit = usePxToRem ? 'rem' : 'px';
      figma.notify(`✅ Converted to ${format.toUpperCase()} (${unit})`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      figma.ui.postMessage({
        type: 'error',
        message: `Conversion failed: ${errorMessage}`,
      });
    }
  }

  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};
