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
        maxWidth: '350px',
        width: '100%',
        textAlign: 'center',
        padding: '25px 20px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
      }}>
        {/* Logo/Brand */}
        <div style={{
          fontSize: '32px',
          marginBottom: '10px',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          GenUI
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1a202c',
        }}>
          Welcome to GenUI
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: '13px',
          color: '#718096',
          marginBottom: '18px',
          lineHeight: '1.5',
        }}>
          Your AI-powered style extractor and code generator. Sign in to use GenUI and see your own history.
        </p>

        {/* Features List */}
        <div style={{
          textAlign: 'left',
          marginBottom: '18px',
          padding: '15px',
          background: '#f7fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{
            fontSize: '13px',
            fontWeight: '600',
            marginBottom: '10px',
            color: '#2d3748',
          }}>
            What you'll get:
          </h3>
          <ul style={{
            fontSize: '12px',
            color: '#4a5568',
            lineHeight: '1.6',
            paddingLeft: '20px',
            margin: 0,
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
            padding: '10px',
            fontSize: '14px',
            fontWeight: '600',
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(6, 182, 212, 0.4)',
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
                <circle cx="12" cy="12" r="10" opacity="0.3" />
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>Login</span>
            </>
          )}
        </Button>

        {(onSignup || onResetPassword) && (
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '12px',
            gap: '10px',
          }}>
            <Button
              onClick={onSignup}
              variant="secondary"
              disabled={isLoading || !onSignup}
              style={{
                flex: 1,
                padding: '8px',
                fontSize: '12px',
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
                padding: '8px',
                fontSize: '12px',
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
          marginBottom: 0,
          lineHeight: '1.4',
        }}>
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </Card>
    </div>
  );
}
