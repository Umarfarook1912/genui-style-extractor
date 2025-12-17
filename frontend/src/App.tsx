/**
 * GenUI - Main Application Component
 * UI Style Extractor + Code Generator with Authentication
 */

import { useState } from "react";
import "./App.css";
import { Loader } from "./components/Loader";
import { LoginPage } from "./components/LoginPage";
import { History } from "./components/History";
import { AppContent } from "./components/AppContent";
import { useAuth } from "./hooks/useAuth";

type Tab = "convert" | "history";

export default function App() {
  // Authentication
  const { isAuthenticated, isLoading: authLoading, login, signup, resetPassword, logout } = useAuth();

  // Tab state
  const [activeTab, setActiveTab] = useState<Tab>("convert");

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}>
        <Loader text="Loading..." />
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage onLogin={login} onSignup={signup} onResetPassword={resetPassword} />;
  }

  // Authenticated user view
  return (
    <div className="app-container">
      {activeTab === "convert" ? (
        <AppContent onLogout={logout} />
      ) : (
        <>
          {/* Header for History Tab */}
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
                👤 User
              </span>
              <button
                onClick={logout}
                style={{
                  padding: '6px 12px',
                  fontSize: '13px',
                  background: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  color: '#666',
                }}
              >
                Logout
              </button>
            </div>
          </header>
          <History />
        </>
      )}

      {/* Tab Navigation - Fixed at Bottom */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'white',
        borderTop: '1px solid #e5e7eb',
        display: 'flex',
        boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      }}>
        <button
          onClick={() => setActiveTab('convert')}
          style={{
            flex: 1,
            padding: '14px',
            background: activeTab === 'convert' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
            color: activeTab === 'convert' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          ✨ Convert
        </button>
        <button
          onClick={() => setActiveTab('history')}
          style={{
            flex: 1,
            padding: '14px',
            background: activeTab === 'history' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
            color: activeTab === 'history' ? 'white' : '#666',
            border: 'none',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'all 0.2s',
          }}
        >
          📜 History
        </button>
      </div>

      {/* Footer */}
      <footer className="app-footer" style={{ marginBottom: '60px' }}>
        <p>Made with ❤️ for Zoho Hackathon</p>
      </footer>
    </div>
  );
}
