import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './AuthContext';
import type { Role } from './types';

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  return context;
}

export function useHasRole(...roles: Role[]): boolean {
  const { user } = useAuth();
  return user !== null && roles.some((role) => role === user.role);
}
