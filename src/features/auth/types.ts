export const ROLES = { Admin: 'Admin', User: 'User' } as const;
export type Role = (typeof ROLES)[keyof typeof ROLES];

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role | (string & {});
}

export interface Session {
  token: string;
  user: AuthUser;
  expiresAt: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export type LogoutReason = 'manual' | 'expired' | 'unauthorized';
