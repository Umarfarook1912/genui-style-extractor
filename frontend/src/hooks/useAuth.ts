/**
 * Authentication Hook - Uses Catalyst Hosted Authentication
 *
 * This project uses Catalyst's hosted pages:
 * - /__catalyst/auth/login
 * - /__catalyst/auth/signup
 * - /__catalyst/auth/reset-password
 *
 * Auth is maintained via Catalyst session cookies. We verify auth by calling
 * the existing getHistory API with `credentials: 'include'`.
 */

import { useState, useEffect, useCallback } from 'react';
import { API_BASE_URL } from '../constants/api';

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_LOGIN_URL = `${API_BASE_URL}/__catalyst/auth/login`;
const AUTH_SIGNUP_URL = `${API_BASE_URL}/__catalyst/auth/signup`;
const AUTH_RESET_PASSWORD_URL = `${API_BASE_URL}/__catalyst/auth/reset-password`;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  // Check if user is already logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Verify auth by calling a protected endpoint using Catalyst cookies.
      // Note: getHistory currently returns a friendly message when not logged in.
      const response = await fetch(`${API_BASE_URL}/server/getHistory/?limit=1`, {
        method: 'GET',
        credentials: 'include',
      });

      if (!response.ok) {
        setAuthState({ isAuthenticated: false, isLoading: false });
        return;
      }

      const result = await response.json().catch(() => null);
      const message = String(result?.message || '').toLowerCase();
      const looksUnauthed = message.includes('log in') || message.includes('login');

      setAuthState({ isAuthenticated: !looksUnauthed, isLoading: false });
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({ isAuthenticated: false, isLoading: false });
    }
  }, []);

  const isAuthenticatedNow = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/server/getHistory/?limit=1`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) return false;
      const result = await response.json().catch(() => null);
      const message = String(result?.message || '').toLowerCase();
      const looksUnauthed = message.includes('log in') || message.includes('login');
      return !looksUnauthed;
    } catch {
      return false;
    }
  }, []);

  const openAuthWindowAndPoll = useCallback((url: string) => {
    const authWindow = window.open(
      url,
      'catalyst_auth',
      'width=520,height=680,left=200,top=80'
    );

    // Poll for auth completion. Works even if the hosted page doesn't postMessage.
    const startedAt = Date.now();
    const interval = window.setInterval(async () => {
      const elapsedMs = Date.now() - startedAt;
      const closed = !authWindow || authWindow.closed;

      // Stop after 2 minutes
      if (elapsedMs > 2 * 60 * 1000) {
        window.clearInterval(interval);
        return;
      }

      // If the user closed the window, do one final check and stop.
      if (closed) {
        window.clearInterval(interval);
        await checkAuthStatus();
        return;
      }

      const authed = await isAuthenticatedNow();
      if (authed) {
        setAuthState({ isAuthenticated: true, isLoading: false });
        try { authWindow.close(); } catch (e) { }
        window.clearInterval(interval);
      }
    }, 1200);
  }, [checkAuthStatus, isAuthenticatedNow]);

  const login = useCallback(() => {
    openAuthWindowAndPoll(AUTH_LOGIN_URL);
  }, [openAuthWindowAndPoll]);

  const signup = useCallback(() => {
    openAuthWindowAndPoll(AUTH_SIGNUP_URL);
  }, [openAuthWindowAndPoll]);

  const resetPassword = useCallback(() => {
    openAuthWindowAndPoll(AUTH_RESET_PASSWORD_URL);
  }, [openAuthWindowAndPoll]);

  const logout = useCallback(async () => {
    // Catalyst hosted auth typically exposes a logout route.
    // If it doesn't exist, this will simply no-op.
    try {
      await fetch(`${API_BASE_URL}/__catalyst/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });
    } catch (e) {
      // ignore
    }

    setAuthState({ isAuthenticated: false, isLoading: false });
  }, []);

  return {
    ...authState,
    login,
    signup,
    resetPassword,
    logout,
    refresh: checkAuthStatus,
  };
}
