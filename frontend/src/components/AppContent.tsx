/**
 * AppContent - The main app functionality after authentication
 * Extracted from App.tsx to allow authentication wrapper
 */

import { useEffect, useState } from "react";
import { Button } from "./Button";
import { Card } from "./Card";
import { CodeBlock } from "./CodeBlock";
import { Loader } from "./Loader";
import { ImageUpload } from "./ImageUpload";
import { useConvertStyles } from "../hooks/useConvertStyles";
import { useImageAnalysis } from "../hooks/useImageAnalysis";
import { CATALYST_SAVE_CONVERSION_URL } from "../constants/api";
import type { DesignJson } from "../hooks/useImageAnalysis";

type Styles = Record<string, string>;
type OutputFormat = "css" | "tailwind" | "jsx";
type InputMode = "extract" | "upload";

interface AppContentProps {
  onLogout: () => void;
  userEmail?: string;
}

export function AppContent({ onLogout, userEmail }: AppContentProps) {
  // State management
  const [inputMode, setInputMode] = useState<InputMode>("extract");
  const [styles, setStyles] = useState<Styles | null>(null);
  const [designJson, setDesignJson] = useState<DesignJson | null>(null);
  const [format, setFormat] = useState<OutputFormat>("tailwind");
  const [useRem, setUseRem] = useState(true);
  const [extracting, setExtracting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [persistentWindow, setPersistentWindow] = useState<boolean>(() => {
    try {
      const v = localStorage.getItem('genui_persistent_window');
      return v === '1';
    } catch (e) {
      return false;
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  // React Query mutations
  const { mutate: convertStyles, data, isPending, isError, error } = useConvertStyles();
  const { mutate: analyzeImage, data: analysisData, isPending: isAnalyzing, isError: isAnalysisError, error: analysisError } = useImageAnalysis();

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

  // Handle image selection
  const handleImageSelect = (file: File) => {
    setStyles(null);
    setDesignJson(null);

    // Create preview URL
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);

    // Analyze the image
    analyzeImage({ imageFile: file });
  };

  // Handle successful image analysis
  useEffect(() => {
    if (analysisData?.success && analysisData.designJson) {
      setDesignJson(analysisData.designJson);
      // Convert design.json to styles format for compatibility
      const stylesFromJson: Styles = {};
      Object.entries(analysisData.designJson).forEach(([key, value]) => {
        stylesFromJson[key] = String(value);
      });
      setStyles(stylesFromJson);
    }
  }, [analysisData]);

  // Cleanup preview URL
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleConvert = () => {
    if (!styles) return;
    setIsSaved(false);
    convertStyles({ styles, format, useRem });
  };

  // Save conversion to datastore
  const handleSaveConversion = async () => {
    if (!styles || !output) return;

    setIsSaving(true);
    try {
      const response = await fetch(CATALYST_SAVE_CONVERSION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          styles,
          format,
          output_code: output,
          user_agent: navigator.userAgent
        })
      });

      if (response.ok) {
        setIsSaved(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save conversion');
      }
    } catch (err) {
      console.error('Save failed:', err);
      alert(`Failed to save conversion: ${(err as Error).message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Download design.json
  const handleDownloadDesignJson = () => {
    if (!designJson) return;

    const jsonStr = JSON.stringify(designJson, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'design.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        {!styles && !extracting && !isAnalyzing && (
          <>
            {/* Input Mode Selector */}
            <Card className="mode-selector">
              <div style={{
                display: 'flex',
                gap: '8px',
                marginBottom: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '4px',
                backgroundColor: '#f9fafb'
              }}>
                <button
                  onClick={() => {
                    setInputMode('extract');
                    setStyles(null);
                    setDesignJson(null);
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                    }
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: inputMode === 'extract'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: inputMode === 'extract' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  🎯 Extract from Web
                </button>
                <button
                  onClick={() => {
                    setInputMode('upload');
                    setStyles(null);
                    setDesignJson(null);
                  }}
                  style={{
                    flex: 1,
                    padding: '10px 16px',
                    background: inputMode === 'upload'
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : 'transparent',
                    color: inputMode === 'upload' ? 'white' : '#666',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s',
                  }}
                >
                  📸 Upload Image
                </button>
              </div>

              {inputMode === 'extract' ? (
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexDirection: 'column' }}>
                  <p style={{ marginBottom: '8px' }}>Select an element from any webpage to extract its styles</p>
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
              ) : (
                <ImageUpload
                  onImageSelect={handleImageSelect}
                  isProcessing={isAnalyzing}
                  previewUrl={imagePreview}
                />
              )}
            </Card>
          </>
        )}

        {(extracting || isAnalyzing) && (
          <div className="extracting">
            <Loader text={extracting ? "Click on any element on the webpage..." : "Analyzing image and extracting design tokens..."} />
            {extracting && (
              <p style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                Tip: The popup will close while you click the page. Re-open the extension to see results.
              </p>
            )}
          </div>
        )}

        {isAnalysisError && (
          <Card className="error-message">
            <p style={{ color: "#ef4444" }}>
              ❌ Error: {analysisError?.message || "Failed to analyze image"}
            </p>
            <p style={{ fontSize: "0.9rem", marginTop: "8px" }}>
              Make sure the analyzeImage Catalyst function is deployed and configured correctly.
            </p>
          </Card>
        )}

        {styles && (
          <>
            {inputMode === 'upload' && designJson && (
              <Card title="📄 Design JSON" className="design-json-section">
                <div style={{ marginBottom: '12px' }}>
                  <p style={{ fontSize: '14px', color: '#666', marginBottom: '12px' }}>
                    Design tokens extracted from your image:
                  </p>
                  <CodeBlock code={JSON.stringify(designJson, null, 2)} language="json" />
                </div>
                <Button onClick={handleDownloadDesignJson} variant="secondary" style={{ marginTop: '8px' }}>
                  💾 Download design.json
                </Button>
              </Card>
            )}

            {inputMode === 'extract' && (
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
            )}

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
              <>
                <Card title="Generated Code" className="output-section">
                  <CodeBlock code={output} language={format} />
                  <div style={{ marginTop: '16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <Button
                      onClick={handleSaveConversion}
                      disabled={isSaving || isSaved}
                      variant={isSaved ? "secondary" : "primary"}
                      style={{ minWidth: '140px' }}
                    >
                      {isSaving ? "💾 Saving..." : isSaved ? "✅ Saved" : "💾 Save to History"}
                    </Button>
                    {isSaved && (
                      <span style={{ color: '#10b981', fontSize: '14px' }}>
                        Saved successfully!
                      </span>
                    )}
                  </div>
                </Card>
              </>
            )}

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              {inputMode === 'extract' ? (
                <Button onClick={startExtraction} variant="secondary" style={{ flex: 1 }}>
                  🔄 Extract Another Element
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    setStyles(null);
                    setDesignJson(null);
                    if (imagePreview) {
                      URL.revokeObjectURL(imagePreview);
                      setImagePreview(null);
                    }
                  }}
                  variant="secondary"
                  style={{ flex: 1 }}
                >
                  🔄 Upload Another Image
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
