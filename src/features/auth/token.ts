import { jwtDecode, type JwtPayload } from 'jwt-decode';
import type { AuthUser, Session } from './types';

const CLAIM_KEYS = {
  id: ['sub', 'nameid', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
  name: ['name', 'unique_name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
  email: ['email', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
  role: ['role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
} as const;

type TokenPayload = JwtPayload & Record<string, unknown>;

const MAX_TIMEOUT_MS = 2_147_483_647;

function readClaim(payload: TokenPayload, keys: readonly string[]): string | undefined {
  for (const key of keys) {
    const value = payload[key];
    const first: unknown = Array.isArray(value) ? value[0] : value;
    if (typeof first === 'string' && first.length > 0) return first;
    if (typeof first === 'number') return String(first);
  }
  return undefined;
}

export function decodeSession(token: string): Session | null {
  let payload: TokenPayload;
  try {
    payload = jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }

  if (typeof payload.exp !== 'number') return null;

  const email = readClaim(payload, CLAIM_KEYS.email) ?? '';
  const user: AuthUser = {
    id: readClaim(payload, CLAIM_KEYS.id) ?? '',
    name: readClaim(payload, CLAIM_KEYS.name) ?? email,
    email,
    role: readClaim(payload, CLAIM_KEYS.role) ?? '',
  };

  return { token, user, expiresAt: payload.exp * 1000 };
}

export function isSessionExpired(session: Pick<Session, 'expiresAt'>, now = Date.now()): boolean {
  return session.expiresAt <= now;
}

export function msUntilExpiry(session: Pick<Session, 'expiresAt'>, now = Date.now()): number {
  return Math.min(Math.max(session.expiresAt - now, 0), MAX_TIMEOUT_MS);
}

export function loadStoredSession(
  storage: { get(): string | null; clear(): void },
  now = Date.now(),
): Session | null {
  const token = storage.get();
  if (!token) return null;

  const session = decodeSession(token);
  if (!session || isSessionExpired(session, now)) {
    storage.clear();
    return null;
  }
  return session;
}
