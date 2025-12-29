/**
 * FigmaJsonInput - Component for pasting and parsing Figma JSON
 */

import { Button } from "./Button";

type Styles = Record<string, string>;

interface FigmaJsonInputProps {
  onStylesExtracted: (styles: Styles, figmaData: any) => void;
}

export function FigmaJsonInput({ onStylesExtracted }: FigmaJsonInputProps) {
  const handleParse = () => {
    const textarea = document.getElementById('figmaJsonInput') as HTMLTextAreaElement;
    const jsonText = textarea?.value.trim();

    if (!jsonText) {
      alert('Please paste Figma JSON first');
      return;
    }

    try {
      const figmaData = JSON.parse(jsonText);

      if (!figmaData.source || figmaData.source !== 'figma' || !figmaData.nodes) {
        throw new Error('Invalid Figma JSON structure');
      }

      // Convert Figma JSON to styles format
      const firstNode = figmaData.nodes[0];
      const stylesFromFigma: Styles = {
        tagName: firstNode.nodeType,
        className: firstNode.name
      };

      // Extract layout
      if (firstNode.layout) {
        if (firstNode.layout.width) stylesFromFigma.width = `${firstNode.layout.width}px`;
        if (firstNode.layout.height) stylesFromFigma.height = `${firstNode.layout.height}px`;
      }

      // Extract colors
      if (firstNode.colors?.fills?.[0]) {
        stylesFromFigma.backgroundColor = firstNode.colors.fills[0];
      }
      if (firstNode.colors?.strokes?.[0]) {
        stylesFromFigma.borderColor = firstNode.colors.strokes[0];
      }

      // Extract typography
      if (firstNode.typography) {
        if (firstNode.typography.fontSize) stylesFromFigma.fontSize = `${firstNode.typography.fontSize}px`;
        if (firstNode.typography.fontFamily) stylesFromFigma.fontFamily = firstNode.typography.fontFamily;
        if (firstNode.typography.fontWeight) stylesFromFigma.fontWeight = String(firstNode.typography.fontWeight);
        if (firstNode.typography.lineHeight) stylesFromFigma.lineHeight = String(firstNode.typography.lineHeight);
      }

      // Extract spacing
      if (firstNode.spacing) {
        if (firstNode.spacing.paddingTop) stylesFromFigma.paddingTop = `${firstNode.spacing.paddingTop}px`;
        if (firstNode.spacing.paddingRight) stylesFromFigma.paddingRight = `${firstNode.spacing.paddingRight}px`;
        if (firstNode.spacing.paddingBottom) stylesFromFigma.paddingBottom = `${firstNode.spacing.paddingBottom}px`;
        if (firstNode.spacing.paddingLeft) stylesFromFigma.paddingLeft = `${firstNode.spacing.paddingLeft}px`;
        if (firstNode.spacing.borderRadius) stylesFromFigma.borderRadius = `${firstNode.spacing.borderRadius}px`;
      }

      onStylesExtracted(stylesFromFigma, figmaData);

    } catch (error) {
      alert(`Invalid JSON: ${(error as Error).message}`);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Figma Plugin</h3>
      <p style={{ marginBottom: '16px', color: '#666', lineHeight: '1.6' }}>
        Extract design styles directly from Figma using our plugin
      </p>
      <div style={{
        background: '#f9fafb',
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        textAlign: 'left'
      }}>
        <strong style={{ display: 'block', marginBottom: '8px' }}>Setup Instructions:</strong>
        <ol style={{ fontSize: '14px', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Open Figma Desktop or Web App</li>
          <li>Go to <strong>Plugins → Development → Import plugin from manifest</strong></li>
          <li>Navigate to: <code style={{
            background: '#fff',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>figma-plugin/dist/manifest.json</code></li>
          <li>Select your design layers in Figma</li>
          <li>Run the plugin and click "Extract Styles"</li>
          <li>Copy the JSON and paste it here</li>
        </ol>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <textarea
          placeholder='Paste your Figma JSON here...\n\nExample:\n{\n  "source": "figma",\n  "nodes": [...]\n}'
          style={{
            width: '100%',
            minHeight: '120px',
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #e5e7eb',
            fontFamily: 'monospace',
            fontSize: '13px',
            resize: 'vertical'
          }}
          id="figmaJsonInput"
        />
      </div>
      <Button onClick={handleParse} variant="primary">
        Parse Figma JSON
      </Button>
      <p style={{ marginTop: '12px', fontSize: '12px', color: '#888' }}>
        Need help? Check the <strong>figma-plugin/README.md</strong> for detailed instructions
      </p>
    </div>
  );
}
