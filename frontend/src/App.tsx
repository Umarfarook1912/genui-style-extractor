/**
 * GenUI - Main Application Component
 * UI Style Extractor + Code Generator
 * Uses React Query for data fetching and reusable components
 */

import { useEffect, useState } from "react";
import "./App.css";
import { Button } from "./components/Button";
import { Card } from "./components/Card";
import { CodeBlock } from "./components/CodeBlock";
import { Loader } from "./components/Loader";
import { useConvertStyles } from "./hooks/useConvertStyles";

type Styles = Record<string, string>;
type OutputFormat = "css" | "tailwind" | "jsx";

export default function App() {
  // State management
  const [styles, setStyles] = useState<Styles | null>(null);
  const [format, setFormat] = useState<OutputFormat>("tailwind");
  const [useRem, setUseRem] = useState(true);
  const [extracting, setExtracting] = useState(false);

  // React Query mutation for style conversion
  const { mutate: convertStyles, data, isPending, isError, error } = useConvertStyles();

  // Listen for messages from Chrome extension or dev harness
  useEffect(() => {
    // For Chrome extension communication
    if (typeof chrome !== "undefined" && chrome.runtime) {
      chrome.runtime.onMessage.addListener((message: any) => {
        if (message.action === "STYLES_READY") {
          console.log("Styles received:", message.styles);
          setStyles(message.styles);
          setExtracting(false);
        }
      });
    }

    // For development with chrome-dev harness
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "GENUI_STYLE_EXTRACTED") {
        console.log("Styles received:", e.data.styles);
        setStyles(e.data.styles);
        setExtracting(false);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, []);

  // Start element selection
  const startExtraction = async () => {
    setExtracting(true);
    setStyles(null);

    // Send message to content script
    if (typeof chrome !== "undefined" && chrome.tabs) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.sendMessage(tab.id!, { action: "START_EXTRACTION" });
    }
  };

  // Handle style conversion
  const handleConvert = () => {
    if (!styles) return;
    convertStyles({ styles, format, useRem });
  };

  // Extract output from response
  const output = data?.code || data?.output || "";

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>🎨 GenUI</h1>
        <p className="tagline">Extract styles, generate code</p>
      </header>

      {/* Main Content */}
      <div className="content">
        {/* Welcome State */}
        {!styles && !extracting && (
          <Card className="welcome">
            <p>Select an element from any webpage to extract its styles</p>
            <Button onClick={startExtraction} variant="primary">
              🎯 Start Extraction
            </Button>
          </Card>
        )}

        {/* Extracting State */}
        {extracting && (
          <div className="extracting">
            <Loader text="Click on any element on the webpage..." />
          </div>
        )}

        {/* Styles Extracted - Show Details and Conversion Options */}
        {styles && (
          <>
            {/* Element Info Card */}
            <Card className="element-info">
              <h3>
                📦 Element: <code>{styles.tagName || "Unknown"}</code>
              </h3>
              {styles.className && (
                <p className="class-name">
                  Class: <code>{styles.className}</code>
                </p>
              )}
            </Card>

            {/* Styles Preview Card */}
            <Card title="Extracted Styles" className="styles-preview">
              <div className="styles-grid">
                <div>
                  <strong>Size:</strong> {styles.width} × {styles.height}
                </div>
                <div>
                  <strong>Color:</strong>{" "}
                  <span style={{ color: styles.color }}>{styles.color}</span>
                </div>
                <div>
                  <strong>Background:</strong>{" "}
                  <span
                    style={{
                      backgroundColor: styles.backgroundColor,
                      padding: "2px 8px",
                      borderRadius: 4,
                    }}
                  >
                    {styles.backgroundColor}
                  </span>
                </div>
                <div>
                  <strong>Font:</strong> {styles.fontSize} / {styles.fontWeight}
                </div>
              </div>
            </Card>

            {/* Conversion Options Card */}
            <Card title="Conversion Options" className="conversion-options">
              <div className="format-selector">
                <label>
                  <input
                    type="radio"
                    value="tailwind"
                    checked={format === "tailwind"}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  />
                  Tailwind CSS
                </label>
                <label>
                  <input
                    type="radio"
                    value="css"
                    checked={format === "css"}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  />
                  CSS
                </label>
                <label>
                  <input
                    type="radio"
                    value="jsx"
                    checked={format === "jsx"}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                  />
                  JSX Style
                </label>
              </div>

              {format === "css" && (
                <label className="checkbox">
                  <input
                    type="checkbox"
                    checked={useRem}
                    onChange={(e) => setUseRem(e.target.checked)}
                  />
                  Convert px to rem
                </label>
              )}

              <Button onClick={handleConvert} disabled={isPending} variant="primary">
                {isPending ? "⏳ Converting..." : "✨ Convert Styles"}
              </Button>
            </Card>

            {/* Loading State */}
            {isPending && (
              <div className="converting-loader">
                <Loader text="Converting styles..." />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <Card className="error-message">
                <p style={{ color: "#ef4444" }}>
                  ❌ Error: {error?.message || "Failed to convert styles"}
                </p>
                <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
                  Make sure the Catalyst function is deployed and the URL is configured correctly.
                </p>
              </Card>
            )}

            {/* Output Code Block */}
            {output && (
              <Card title="Generated Code" className="output-section">
                <CodeBlock code={output} language={format} />
              </Card>
            )}

            {/* Extract Another Button */}
            <Button onClick={startExtraction} variant="secondary" className="mt-16">
              🔄 Extract Another Element
            </Button>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="app-footer">
        <p>Made with ❤️ for Zoho Hackathon</p>
      </footer>
    </div>
  );
}
