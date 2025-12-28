/**
 * Login Page Component
 * Displays when user is not authenticated
 */

import { Button } from './Button';
import { Card } from './Card';
import '../App.css';

interface LoginPageProps {
  onLogin: () => void;
  onSignup?: () => void;
  onResetPassword?: () => void;
  isLoading?: boolean;
}

export function LoginPage({ onLogin, onSignup, onResetPassword, isLoading = false }: LoginPageProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
    }}>
      <Card style={{
        maxWidth: '450px',
        width: '100%',
        textAlign: 'center',
        padding: '40px 30px',
      }}>
        {/* Logo/Icon */}
        <div style={{
          fontSize: '64px',
          marginBottom: '20px',
        }}>
          🎨
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          marginBottom: '10px',
          color: '#1a202c',
        }}>
          Welcome to GenUI
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '16px',
          color: '#718096',
          marginBottom: '30px',
          lineHeight: '1.5',
        }}>
          Your AI-powered style extractor and code generator.
          Sign in to use GenUI and see your own history.
        </p>

        {/* Features List */}
        <div style={{
          textAlign: 'left',
          marginBottom: '30px',
          padding: '20px',
          background: '#f7fafc',
          borderRadius: '8px',
        }}>
          <h3 style={{
            fontSize: '14px',
            fontWeight: '600',
            marginBottom: '12px',
            color: '#2d3748',
          }}>
            ✨ What you'll get:
          </h3>
          <ul style={{
            fontSize: '14px',
            color: '#4a5568',
            lineHeight: '1.8',
            paddingLeft: '20px',
          }}>
            <li>Extract styles from any element</li>
            <li>Convert to Tailwind, CSS, or JSX</li>
            <li>View your conversion history</li>
            <li>Sync across devices</li>
          </ul>
        </div>

        {/* Login Button */}
        <Button
          onClick={onLogin}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '16px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          {isLoading ? (
            <>
              <span>Connecting...</span>
              <div className="spinner" style={{
                width: '16px',
                height: '16px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: 'white',
                borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
              }} />
            </>
          ) : (
            <>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
              <span>Login</span>
            </>
          )}
        </Button>

        {(onSignup || onResetPassword) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '14px',
            gap: '10px',
          }}>
            <Button
              onClick={onSignup}
              variant="secondary"
              disabled={isLoading || !onSignup}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
              }}
            >
              Sign up
            </Button>
            <Button
              onClick={onResetPassword}
              variant="secondary"
              disabled={isLoading || !onResetPassword}
              style={{
                flex: 1,
                padding: '10px',
                fontSize: '13px',
              }}
            >
              Reset password
            </Button>
          </div>
        )}

        {/* Footer */}
        <p style={{
          fontSize: '12px',
          color: '#a0aec0',
          marginTop: '20px',
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
