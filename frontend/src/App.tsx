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
  const [persistentWindow, setPersistentWindow] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('genui_persistent_window');
      return v === '1';
    } catch (e) {
      return false;
    }
  });

  // React Query mutation for style conversion
  const { mutate: convertStyles, data, isPending, isError, error } = useConvertStyles();

  // Listen for messages from Chrome extension or dev harness
  useEffect(() => {
    // For Chrome extension communication - guard access so dev server doesn't crash
    const ext = (window as any).chrome ?? (window as any).browser ?? null;
    const runtime = ext?.runtime ?? null;
    if (runtime) {
      // only attach listener when the API surface exists
      if (runtime.onMessage && typeof runtime.onMessage.addListener === 'function') {
        runtime.onMessage.addListener((message: any) => {
          if (message.action === "STYLES_READY") {
            console.log("Styles received:", message.styles);
            setStyles(message.styles);
            setExtracting(false);
          }
        });
      }

      // When the popup opens, request the latest stored styles from background if available
      if (typeof runtime.sendMessage === 'function') {
        try {
          runtime.sendMessage({ action: 'GET_LATEST_STYLES' }, (resp: any) => {
            if (resp && resp.styles) {
              setStyles(resp.styles);
            }
          });
        } catch (e) {
          // ignore if sendMessage not available or fails in dev
        }
      }
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

    // If user requested a persistent window, open a popup window that stays open
    const ext = (window as any).chrome ?? (window as any).browser ?? null;
    const windowsApi = ext?.windows ?? null;
    const tabsApi = ext?.tabs ?? null;

    if (persistentWindow && windowsApi && typeof windowsApi.create === 'function') {
      try {
        windowsApi.create(
          {
            url: (ext.runtime && typeof ext.runtime.getURL === 'function') ? ext.runtime.getURL('app/index.html?persistent=1') : 'app/index.html?persistent=1',
            type: 'popup',
            width: 420,
            height: 720,
          },
          async () => {
            // After opening the persistent window, trigger extraction on the active tab
            if (tabsApi && typeof tabsApi.query === 'function') {
              const tabs = await new Promise<any[]>((res) => {
                try {
                  tabsApi.query({ active: true, currentWindow: true }, (t: any) => res(t));
                } catch (err) {
                  // try promise form
                  try {
                    (tabsApi.query as any)({ active: true, currentWindow: true }).then((t: any) => res(t)).catch(() => res([]));
                  } catch (e) {
                    res([]);
                  }
                }
              });
              const tab = tabs[0];
              if (tab) {
                // Focus the page tab so user can click elements
                try { if (typeof tabsApi.update === 'function') await new Promise((r) => tabsApi.update(tab.id!, { active: true }, r)); } catch (e) { }
                try { if (typeof tabsApi.sendMessage === 'function') tabsApi.sendMessage(tab.id!, { action: 'START_EXTRACTION' }); } catch (e) { }
              }
            }
          }
        );
      } catch (e) {
        // fallback to normal flow if windows.create not available
        if (tabsApi && typeof tabsApi.query === 'function') {
          const tabs = await new Promise<any[]>((res) => {
            try {
              tabsApi.query({ active: true, currentWindow: true }, (t: any) => res(t));
            } catch (err) {
              try {
                (tabsApi.query as any)({ active: true, currentWindow: true }).then((t: any) => res(t)).catch(() => res([]));
              } catch (e2) {
                res([]);
              }
            }
          });
          const tab = tabs[0];
          try { if (tab && typeof tabsApi.sendMessage === 'function') tabsApi.sendMessage(tab.id!, { action: 'START_EXTRACTION' }); } catch (e) { }
        }
      }
      return;
    }

    // Default behavior: send message to content script in current active tab
    if (tabsApi && typeof tabsApi.query === 'function') {
      const tabs = await new Promise<any[]>((res) => {
        try {
          tabsApi.query({ active: true, currentWindow: true }, (t: any) => res(t));
        } catch (err) {
          try {
            (tabsApi.query as any)({ active: true, currentWindow: true }).then((t: any) => res(t)).catch(() => res([]));
          } catch (e) {
            res([]);
          }
        }
      });
      const tab = tabs[0];
      try {
        if (tab) {
          // Try to inject the content script programmatically if scripting API is available
          const scripting = (window as any).chrome?.scripting ?? (window as any).browser?.scripting ?? null;
          if (scripting && typeof scripting.executeScript === 'function') {
            try {
              // executeScript may accept a Promise or callback depending on browser
              const exec = scripting.executeScript as any;
              // Use the extension file name; this will inject `content-script.js` into the page
              await new Promise((res) => {
                try {
                  exec({ target: { tabId: tab.id }, files: ['content-script.js'] }, () => res(null));
                } catch (err) {
                  // try promise style
                  try {
                    exec({ target: { tabId: tab.id }, files: ['content-script.js'] }).then(() => res(null)).catch(() => res(null));
                  } catch (e) {
                    res(null);
                  }
                }
              });
              console.log('Attempted to inject content-script.js into tab', tab.id);
            } catch (e) {
              console.error('Error while injecting content script:', e);
              // ignore injection errors
            }
          }

          if (typeof tabsApi.sendMessage === 'function') {
            try {
              tabsApi.sendMessage(tab.id!, { action: "START_EXTRACTION" }, (resp: any) => {
                // check for runtime errors
                const lastErr = (window as any).chrome?.runtime?.lastError ?? (window as any).browser?.runtime?.lastError ?? null;
                if (lastErr) {
                  console.error('tabs.sendMessage lastError:', lastErr);
                  alert('Failed to message the page. The content script may not be injected on this page.');
                } else {
                  console.log('START_EXTRACTION sent, response:', resp);
                }
              });
            } catch (e) {
              console.error('Error calling tabs.sendMessage:', e);
              alert('Failed to start extraction: ' + ((e as any)?.message || String(e)));
            }
          }
        }
      } catch (e) { }
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
            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexDirection: 'column' }}>
              <label style={{ fontSize: 13 }}>
                <input
                  type="checkbox"
                  checked={persistentWindow}
                  onChange={(e) => {
                    const v = !!e.target.checked;
                    setPersistentWindow(v);
                    try { localStorage.setItem('genui_persistent_window', v ? '1' : '0'); } catch (err) { }
                  }}
                />{' '}
                Open persistent window for extraction
              </label>
              <Button onClick={startExtraction} variant="primary">
                🎯 Start Extraction
              </Button>
            </div>
          </Card>
        )}

        {/* Extracting State */}
        {extracting && (
          <div className="extracting">
            <Loader text="Click on any element on the webpage..." />
            <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Tip: The popup will close while you click the page. Re-open the extension to see results.
            </p>
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
              <div style={{ marginBottom: 8 }}>
                <label style={{ fontSize: 13 }}>
                  <input
                    type="checkbox"
                    checked={persistentWindow}
                    onChange={(e) => {
                      const v = !!e.target.checked;
                      setPersistentWindow(v);
                      try { localStorage.setItem('genui_persistent_window', v ? '1' : '0'); } catch (err) { }
                    }}
                  />{' '}
                  Open persistent window for extraction
                </label>
              </div>
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
