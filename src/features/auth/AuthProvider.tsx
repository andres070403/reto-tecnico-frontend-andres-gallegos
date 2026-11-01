import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { toast } from 'sonner';
import { authApi } from '@/api/authApi';
import { setHttpErrorHandlers } from '@/api/httpClient';
import { FORBIDDEN_MESSAGE } from '@/lib/apiError';
import { AuthContext, type AuthContextValue } from './AuthContext';
import { SESSION_EXPIRED_MESSAGE, SESSION_INVALID_MESSAGE } from './messages';
import { decodeSession, isSessionExpired, loadStoredSession, msUntilExpiry } from './token';
import { TOKEN_STORAGE_KEY, tokenStorage } from './tokenStorage';
import type { LoginCredentials, LogoutReason, Session } from './types';

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(() => loadStoredSession(tokenStorage));

  const sessionRef = useRef(session);
  useEffect(() => {
    sessionRef.current = session;
  }, [session]);

  const logout = useCallback(
    (reason: LogoutReason = 'manual') => {
      if (!sessionRef.current) return;
      sessionRef.current = null;

      tokenStorage.clear();
      setSession(null);
      queryClient.clear();

      if (reason === 'expired') {
        toast.warning(SESSION_EXPIRED_MESSAGE, {
          id: 'session-expired',
          description: 'Inicia sesión nuevamente para continuar.',
        });
      } else if (reason === 'unauthorized') {
        toast.error(SESSION_INVALID_MESSAGE, { id: 'session-invalid' });
      }
    },
    [queryClient],
  );

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const { token } = await authApi.login(credentials);
      const next = decodeSession(token);
      if (!next || isSessionExpired(next)) {
        throw new Error('El servidor devolvió un token inválido.');
      }
      tokenStorage.set(token);
      queryClient.clear();
      sessionRef.current = next;
      setSession(next);
      return next;
    },
    [queryClient],
  );

  useEffect(() => {
    if (!session) return;

    const expireIfNeeded = () => {
      if (isSessionExpired(session)) logout('expired');
    };
    const timer = window.setTimeout(expireIfNeeded, msUntilExpiry(session));
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') expireIfNeeded();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [session, logout]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TOKEN_STORAGE_KEY) return;
      const next = loadStoredSession(tokenStorage);
      sessionRef.current = next;
      setSession(next);
      queryClient.clear();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [queryClient]);

  useEffect(
    () =>
      setHttpErrorHandlers({
        onUnauthorized: () => logout('unauthorized'),
        onForbidden: () => toast.error(FORBIDDEN_MESSAGE, { id: 'forbidden' }),
      }),
    [logout],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: session !== null,
      login,
      logout,
    }),
    [session, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
