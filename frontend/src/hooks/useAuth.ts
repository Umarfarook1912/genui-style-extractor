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
  userEmail?: string;
  userName?: string;
}

const AUTH_LOGIN_URL = `${API_BASE_URL}/__catalyst/auth/login`;
const AUTH_SIGNUP_URL = `${API_BASE_URL}/__catalyst/auth/signup`;
const AUTH_RESET_PASSWORD_URL = `${API_BASE_URL}/__catalyst/auth/reset-password`;

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    userEmail: undefined,
    userName: undefined,
  });

  // Check if user is already logged in on mount (only once)
  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      checkAuthStatus();
    }
    return () => { isMounted = false; };
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      console.log('🔍 [AUTH] Starting auth check...');
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Verify auth by calling a protected endpoint using Catalyst cookies.
      const response = await fetch(`${API_BASE_URL}/server/getHistory/?limit=1&userInfo=true`, {
        method: 'GET',
        credentials: 'include',
      });

      console.log('🔍 [AUTH] getHistory response status:', response.ok, response.status);

      if (!response.ok) {
        console.log('❌ [AUTH] getHistory failed, user not authenticated');
        setAuthState({ isAuthenticated: false, isLoading: false, userEmail: undefined, userName: undefined });
        return;
      }

      const result = await response.json().catch(() => null);
      const message = String(result?.message || '').toLowerCase();
      const looksUnauthed = message.includes('log in') || message.includes('login');
      console.log('🔍 [AUTH] getHistory result:', result);
      console.log('🔍 [AUTH] message:', message, 'looksUnauthed:', looksUnauthed);

      // Extract user info from the response
      let userEmail: string | undefined;
      let userName: string | undefined;

      if (!looksUnauthed && result?.userInfo) {
        const userData = result.userInfo;
        console.log('📦 [AUTH] User Info from getHistory:', userData);
        console.log('📦 [AUTH] Available fields:', userData ? Object.keys(userData) : 'none');

        if (userData) {
          userEmail = userData.email || userData.Email || userData.user_email;
          console.log('📧 [AUTH] Extracted email:', userEmail);

          // Priority: first_name > display_name > name > email username
          userName = userData.first_name || userData.First_Name ||
            userData.display_name || userData.Display_Name ||
            userData.name || userData.Name ||
            (userData.email || userData.Email)?.split('@')[0];

          console.log('👤 [AUTH] Field check - first_name:', userData.first_name);
          console.log('👤 [AUTH] Field check - First_Name:', userData.First_Name);
          console.log('👤 [AUTH] Field check - display_name:', userData.display_name);
          console.log('👤 [AUTH] Field check - name:', userData.name);
          console.log('✅ [AUTH] Final extracted userName:', userName, 'userEmail:', userEmail);
        }
      }

      const finalAuthState = {
        isAuthenticated: !looksUnauthed,
        isLoading: false,
        userEmail,
        userName,
      };
      console.log('🎯 [AUTH] Setting final auth state:', finalAuthState);
      setAuthState(finalAuthState);
    } catch (error) {
      console.error('❌ [AUTH] Auth check failed:', error);
      setAuthState({ isAuthenticated: false, isLoading: false, userEmail: undefined, userName: undefined });
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
        // Re-check auth status to get user info
        await checkAuthStatus();
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
    // Catalyst hosted authentication doesn't provide a logout endpoint
    // Just clear the local auth state - the session cookies will expire naturally
    // or the next auth check will fail and redirect to log, userEmail: undefined, userName: undefinedin
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
