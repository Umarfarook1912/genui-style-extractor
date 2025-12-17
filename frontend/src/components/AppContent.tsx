/**
 * AppContent - The main app functionality after authentication
 * Extracted from App.tsx to allow authentication wrapper
 */

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Loader } from "./Loader";
import { useConvertStyles } from "../hooks/useConvertStyles";

type Styles = Record<string, string>;
type OutputFormat = "css" | "tailwind" | "jsx";

interface AppContentProps {
  onLogout: () => void;
  userEmail?: string;
}

export function AppContent({ onLogout, userEmail }: AppContentProps) {
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
    const ext = (window as any).chrome ?? (window as any).browser ?? null;
    const runtime = ext?.runtime ?? null;
    if (runtime) {
      if (runtime.onMessage && typeof runtime.onMessage.addListener === 'function') {
        runtime.onMessage.addListener((message: any) => {
          if (message.action === "STYLES_READY") {
            console.log("Styles received:", message.styles);
            setStyles(message.styles);
            setExtracting(false);
          }
        });
      }

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
              if (tab) {
                try { if (typeof tabsApi.update === 'function') await new Promise((r) => tabsApi.update(tab.id!, { active: true }, r)); } catch (e) { }
                try { if (typeof tabsApi.sendMessage === 'function') tabsApi.sendMessage(tab.id!, { action: 'START_EXTRACTION' }); } catch (e) { }
              }
            }
          }
        );
      } catch (e) {
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
          const scripting = (window as any).chrome?.scripting ?? (window as any).browser?.scripting ?? null;
          if (scripting && typeof scripting.executeScript === 'function') {
            try {
              const exec = scripting.executeScript as any;
              await new Promise((res) => {
                try {
                  exec({ target: { tabId: tab.id }, files: ['content-script.js'] }, () => res(null));
                } catch (err) {
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
            }
          }

          if (typeof tabsApi.sendMessage === 'function') {
            try {
              tabsApi.sendMessage(tab.id!, { action: "START_EXTRACTION" }, (resp: any) => {
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

  const handleConvert = () => {
    if (!styles) return;
    convertStyles({ styles, format, useRem });
  };

  const output = data?.code || data?.output || "";

  return (
    <>
      {/* Header */}
      <header className="app-header">
        <div>
          <h1>🎨 GenUI</h1>
          <p className="tagline">Extract styles, generate code</p>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '14px',
        }}>
          <span style={{ color: '#666' }}>
            👤 {userEmail || 'User'}
          </span>
          <Button onClick={onLogout} variant="secondary" style={{
            padding: '6px 12px',
            fontSize: '13px',
          }}>
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="content">
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

        {extracting && (
          <div className="extracting">
            <Loader text="Click on any element on the webpage..." />
            <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
              Tip: The popup will close while you click the page. Re-open the extension to see results.
            </p>
          </div>
        )}

        {styles && (
          <>
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

            {isPending && (
              <div className="converting-loader">
                <Loader text="Converting styles..." />
              </div>
            )}

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

            {output && (
              <Card title="Generated Code" className="output-section">
                <CodeBlock code={output} language={format} />
              </Card>
            )}

            <Button onClick={startExtraction} variant="secondary" className="mt-16">
              🔄 Extract Another Element
            </Button>
          </>
        )}
      </div>
    </>
  );
}
