import { createContext } from 'react';
import type { AuthUser, LoginCredentials, LogoutReason, Session } from './types';

export interface AuthContextValue {
  session: Session | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<Session>;
  logout: (reason?: LogoutReason) => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
