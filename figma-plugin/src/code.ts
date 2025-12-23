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
figma.showUI(__html__, { width: 400, height: 500 });

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

  if (msg.type === 'close-plugin') {
    figma.closePlugin();
  }
};
