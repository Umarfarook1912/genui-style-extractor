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
  const { isAuthenticated, isLoading: authLoading, login, signup, resetPassword, logout, userEmail, userName } = useAuth();

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
        <AppContent
          onLogout={logout}
          userName={userName}
          userEmail={userEmail}
          onViewHistory={() => setActiveTab('history')}
        />
      ) : (
        <>
          {/* Header for History Tab */}
          <header className="app-header">
            <div>
              <h1>GenUI</h1>
              <p className="tagline">Extract styles, generate code</p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              fontSize: '14px',
            }}>
              <span style={{ color: '#666', fontWeight: '500' }}>
                {userName || userEmail?.split('@')[0] || 'User'}
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
          <History onBack={() => setActiveTab('convert')} />
        </>
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>GenUI Style Extractor</p>
      </footer>
    </div>
  );
}
