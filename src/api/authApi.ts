import type { LoginCredentials, LoginResponse } from '@/features/auth/types';
import { AUTH_LOGIN_PATH, http } from './httpClient';

export const authApi = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const { data } = await http.post<LoginResponse>(AUTH_LOGIN_PATH, credentials);
    return data;
  },
};
