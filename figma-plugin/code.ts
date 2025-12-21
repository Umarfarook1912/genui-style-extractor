/**
 * GenUI Figma Plugin - Core Logic
 * Extracts real design properties from Figma nodes
 * 
 * This runs inside Figma's sandbox environment
 */

// Show the plugin UI
figma.showUI(__html__, { 
  width: 400, 
  height: 600,
  themeColors: true
});

/**
 * Extract design properties from a Figma node
 * Returns the exact values designers see in "Inspect" panel
 */
function extractStyles(node: SceneNode): any {
  const styles: any = {
    name: node.name,
    type: node.type,
    
    // Dimensions
    width: typeof node.width === 'number' ? node.width : null,
    height: typeof node.height === 'number' ? node.height : null,
    
    // Position
    x: 'x' in node ? node.x : null,
    y: 'y' in node ? node.y : null,
    
    // Fills (colors, gradients, images)
    fills: 'fills' in node && typeof node.fills !== 'symbol' ? serializeFills(node.fills) : null,
    
    // Strokes (borders)
    strokes: 'strokes' in node && typeof node.strokes !== 'symbol' ? serializeStrokes(node.strokes) : null,
    strokeWeight: 'strokeWeight' in node ? node.strokeWeight : null,
    
    // Corner radius
    cornerRadius: 'cornerRadius' in node ? node.cornerRadius : null,
    topLeftRadius: 'topLeftRadius' in node ? node.topLeftRadius : null,
    topRightRadius: 'topRightRadius' in node ? node.topRightRadius : null,
    bottomLeftRadius: 'bottomLeftRadius' in node ? node.bottomLeftRadius : null,
    bottomRightRadius: 'bottomRightRadius' in node ? node.bottomRightRadius : null,
    
    // Effects (shadows, blurs)
    effects: 'effects' in node ? serializeEffects(node.effects) : null,
    
    // Opacity
    opacity: 'opacity' in node ? node.opacity : 1,
    
    // Typography (for text nodes)
    typography: node.type === 'TEXT' ? extractTypography(node as TextNode) : null,
    
    // Layout (for auto-layout frames)
    layout: 'layoutMode' in node ? extractLayout(node as FrameNode) : null,
    
    // Constraints
    constraints: 'constraints' in node ? {
      horizontal: node.constraints.horizontal,
      vertical: node.constraints.vertical
    } : null,
    
    // Rotation
    rotation: 'rotation' in node ? node.rotation : null,
    
    // Blend mode
    blendMode: 'blendMode' in node ? node.blendMode : null,
  };

  return styles;
}

/**
 * Serialize fills (solid colors, gradients, images)
 */
function serializeFills(fills: readonly Paint[]): any[] {
  return fills.map(fill => {
    if (fill.type === 'SOLID') {
      return {
        type: 'SOLID',
        color: {
          r: fill.color.r,
          g: fill.color.g,
          b: fill.color.b,
          a: fill.opacity !== undefined ? fill.opacity : 1
        },
        // Convert to hex for easier use
        hex: rgbToHex(fill.color.r, fill.color.g, fill.color.b),
        opacity: fill.opacity !== undefined ? fill.opacity : 1
      };
    } else if (fill.type === 'GRADIENT_LINEAR' || fill.type === 'GRADIENT_RADIAL') {
      return {
        type: fill.type,
        gradientStops: fill.gradientStops,
        gradientTransform: fill.gradientTransform
      };
    } else if (fill.type === 'IMAGE') {
      return {
        type: 'IMAGE',
        scaleMode: fill.scaleMode,
        imageHash: fill.imageHash
      };
    }
    return { type: fill.type };
  });
}

/**
 * Serialize strokes
 */
function serializeStrokes(strokes: readonly Paint[]): any[] {
  return serializeFills(strokes); // Same structure as fills
}

/**
 * Serialize effects (shadows, blurs)
 */
function serializeEffects(effects: readonly Effect[]): any[] {
  return effects.map(effect => {
    if (effect.type === 'DROP_SHADOW' || effect.type === 'INNER_SHADOW') {
      return {
        type: effect.type,
        color: {
          r: effect.color.r,
          g: effect.color.g,
          b: effect.color.b,
          a: effect.color.a
        },
        offset: effect.offset,
        radius: effect.radius,
        spread: 'spread' in effect ? effect.spread : 0,
        visible: effect.visible,
        blendMode: effect.blendMode
      };
    } else if (effect.type === 'LAYER_BLUR' || effect.type === 'BACKGROUND_BLUR') {
      return {
        type: effect.type,
        radius: effect.radius,
        visible: effect.visible
      };
    }
    return { type: effect.type };
  });
}

/**
 * Extract typography properties from text nodes
 */
function extractTypography(node: TextNode): any {
  const typography: any = {
    fontSize: node.fontSize !== figma.mixed ? node.fontSize : null,
    fontName: node.fontName && node.fontName !== figma.mixed ? {
      family: node.fontName.family,
      style: node.fontName.style
    } : null,
    letterSpacing: 'letterSpacing' in node && node.letterSpacing !== figma.mixed ? {
      value: node.letterSpacing.value,
      unit: node.letterSpacing.unit
    } : null,
    lineHeight: 'lineHeight' in node && typeof node.lineHeight !== 'symbol' ? {
      value: 'value' in node.lineHeight ? node.lineHeight.value : null,
      unit: node.lineHeight.unit
    } : null,
    textAlign: node.textAlignHorizontal,
    textAlignVertical: node.textAlignVertical,
    textCase: node.textCase,
    textDecoration: node.textDecoration,
    paragraphIndent: node.paragraphIndent,
    paragraphSpacing: node.paragraphSpacing,
    autoResize: node.textAutoResize,
    textStyleId: node.textStyleId
  };

  return typography;
}

/**
 * Extract layout properties from auto-layout frames
 */
function extractLayout(node: FrameNode): any {
  if (!('layoutMode' in node)) return null;

  return {
    mode: node.layoutMode, // 'HORIZONTAL' | 'VERTICAL' | 'NONE'
    paddingTop: node.paddingTop,
    paddingRight: node.paddingRight,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    itemSpacing: node.itemSpacing,
    primaryAxisAlignItems: node.primaryAxisAlignItems,
    counterAxisAlignItems: node.counterAxisAlignItems,
    primaryAxisSizingMode: node.primaryAxisSizingMode,
    counterAxisSizingMode: node.counterAxisSizingMode,
    layoutWrap: node.layoutWrap,
    layoutGrow: node.layoutGrow
  };
}

/**
 * Convert RGB values (0-1) to hex string
 */
function rgbToHex(r: number, g: number, b: number): string {
  const toHex = (n: number) => {
    const hex = Math.round(n * 255).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/**
 * Convert Figma styles to CSS-compatible format
 * This prepares the data for the Catalyst backend
 */
function figmaToCSS(figmaStyles: any): any {
  const css: any = {};

  // Dimensions
  if (figmaStyles.width) css.width = `${figmaStyles.width}px`;
  if (figmaStyles.height) css.height = `${figmaStyles.height}px`;

  // Background color (from fills)
  if (figmaStyles.fills && figmaStyles.fills.length > 0) {
    const firstFill = figmaStyles.fills[0];
    if (firstFill.type === 'SOLID') {
      const color = firstFill.color;
      css.backgroundColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    }
  }

  // Border radius
  if (figmaStyles.cornerRadius) {
    css.borderRadius = `${figmaStyles.cornerRadius}px`;
  } else if (figmaStyles.topLeftRadius || figmaStyles.topRightRadius || 
             figmaStyles.bottomLeftRadius || figmaStyles.bottomRightRadius) {
    css.borderRadius = `${figmaStyles.topLeftRadius || 0}px ${figmaStyles.topRightRadius || 0}px ${figmaStyles.bottomRightRadius || 0}px ${figmaStyles.bottomLeftRadius || 0}px`;
  }

  // Border (from strokes)
  if (figmaStyles.strokes && figmaStyles.strokes.length > 0 && figmaStyles.strokeWeight) {
    const firstStroke = figmaStyles.strokes[0];
    if (firstStroke.type === 'SOLID') {
      const color = firstStroke.color;
      css.borderWidth = `${figmaStyles.strokeWeight}px`;
      css.borderStyle = 'solid';
      css.borderColor = `rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
    }
  }

  // Typography
  if (figmaStyles.typography) {
    const typo = figmaStyles.typography;
    if (typo.fontSize) css.fontSize = `${typo.fontSize}px`;
    if (typo.fontName) css.fontFamily = typo.fontName.family;
    if (typo.fontName && typo.fontName.style) {
      // Extract font weight from style (e.g., "Bold" -> "700")
      const style = typo.fontName.style.toLowerCase();
      if (style.includes('bold')) css.fontWeight = '700';
      else if (style.includes('semibold')) css.fontWeight = '600';
      else if (style.includes('medium')) css.fontWeight = '500';
      else css.fontWeight = '400';
    }
    if (typo.letterSpacing) {
      if (typo.letterSpacing.unit === 'PIXELS') {
        css.letterSpacing = `${typo.letterSpacing.value}px`;
      } else if (typo.letterSpacing.unit === 'PERCENT') {
        css.letterSpacing = `${typo.letterSpacing.value}%`;
      }
    }
    if (typo.lineHeight) {
      if (typo.lineHeight.unit === 'PIXELS') {
        css.lineHeight = `${typo.lineHeight.value}px`;
      } else if (typo.lineHeight.unit === 'PERCENT') {
        css.lineHeight = `${typo.lineHeight.value}%`;
      } else if (typo.lineHeight.unit === 'AUTO') {
        css.lineHeight = 'normal';
      }
    }
    if (typo.textAlign) {
      css.textAlign = typo.textAlign.toLowerCase();
    }
    if (typo.textDecoration) {
      css.textDecoration = typo.textDecoration.toLowerCase();
    }
  }

  // Layout (Flexbox)
  if (figmaStyles.layout && figmaStyles.layout.mode !== 'NONE') {
    css.display = 'flex';
    css.flexDirection = figmaStyles.layout.mode === 'HORIZONTAL' ? 'row' : 'column';
    css.gap = `${figmaStyles.layout.itemSpacing}px`;
    
    // Padding
    if (figmaStyles.layout.paddingTop) css.paddingTop = `${figmaStyles.layout.paddingTop}px`;
    if (figmaStyles.layout.paddingRight) css.paddingRight = `${figmaStyles.layout.paddingRight}px`;
    if (figmaStyles.layout.paddingBottom) css.paddingBottom = `${figmaStyles.layout.paddingBottom}px`;
    if (figmaStyles.layout.paddingLeft) css.paddingLeft = `${figmaStyles.layout.paddingLeft}px`;
    
    // Alignment
    if (figmaStyles.layout.primaryAxisAlignItems) {
      const align = figmaStyles.layout.primaryAxisAlignItems;
      if (align === 'MIN') css.justifyContent = 'flex-start';
      else if (align === 'MAX') css.justifyContent = 'flex-end';
      else if (align === 'CENTER') css.justifyContent = 'center';
      else if (align === 'SPACE_BETWEEN') css.justifyContent = 'space-between';
    }
    if (figmaStyles.layout.counterAxisAlignItems) {
      const align = figmaStyles.layout.counterAxisAlignItems;
      if (align === 'MIN') css.alignItems = 'flex-start';
      else if (align === 'MAX') css.alignItems = 'flex-end';
      else if (align === 'CENTER') css.alignItems = 'center';
    }
  }

  // Opacity
  if (figmaStyles.opacity !== undefined && figmaStyles.opacity !== 1) {
    css.opacity = figmaStyles.opacity;
  }

  // Effects (shadows)
  if (figmaStyles.effects && figmaStyles.effects.length > 0) {
    const shadows = figmaStyles.effects
      .filter((e: any) => e.type === 'DROP_SHADOW' && e.visible)
      .map((e: any) => {
        const color = e.color;
        return `${e.offset.x}px ${e.offset.y}px ${e.radius}px rgba(${Math.round(color.r * 255)}, ${Math.round(color.g * 255)}, ${Math.round(color.b * 255)}, ${color.a})`;
      });
    if (shadows.length > 0) {
      css.boxShadow = shadows.join(', ');
    }
  }

  return css;
}

// Listen for selection changes
figma.on('selectionchange', () => {
  const selection = figma.currentPage.selection;

  if (selection.length === 0) {
    figma.ui.postMessage({ 
      type: 'NO_SELECTION',
      message: 'Select a design element to extract styles'
    });
    return;
  }

  const node = selection[0];
  
  try {
    // Extract raw Figma styles
    const figmaStyles = extractStyles(node);
    
    // Convert to CSS-compatible format
    const cssStyles = figmaToCSS(figmaStyles);
    
    // Send both formats to UI
    figma.ui.postMessage({
      type: 'STYLES_EXTRACTED',
      payload: {
        figma: figmaStyles,
        css: cssStyles,
        nodeName: node.name,
        nodeType: node.type
      }
    });
  } catch (error) {
    figma.ui.postMessage({
      type: 'ERROR',
      message: error instanceof Error ? error.message : 'Failed to extract styles'
    });
  }
});

// Handle messages from UI
figma.ui.onmessage = (msg) => {
  if (msg.type === 'EXTRACT_CURRENT') {
    // Manually trigger extraction for current selection
    const selection = figma.currentPage.selection;
    if (selection.length > 0) {
      const node = selection[0];
      const figmaStyles = extractStyles(node);
      const cssStyles = figmaToCSS(figmaStyles);
      
      figma.ui.postMessage({
        type: 'STYLES_EXTRACTED',
        payload: {
          figma: figmaStyles,
          css: cssStyles,
          nodeName: node.name,
          nodeType: node.type
        }
      });
    } else {
      figma.ui.postMessage({
        type: 'NO_SELECTION',
        message: 'Please select a design element first'
      });
    }
  }
};

// Initial message
figma.ui.postMessage({
  type: 'PLUGIN_READY',
  message: 'GenUI Extractor is ready. Select a design element to extract styles.'
});

