import axios, { isAxiosError, type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from '@/features/auth/tokenStorage';
import { env } from '@/lib/env';

export const AUTH_LOGIN_PATH = '/auth/login';

export const http = axios.create({
  baseURL: env.apiUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

interface HttpErrorHandlers {
  onUnauthorized?: () => void;
  onForbidden?: () => void;
}

let handlers: HttpErrorHandlers = {};

export function setHttpErrorHandlers(next: HttpErrorHandlers): () => void {
  handlers = next;
  return () => {
    if (handlers === next) handlers = {};
  };
}

function isLoginRequest(config?: InternalAxiosRequestConfig): boolean {
  return config?.url?.endsWith(AUTH_LOGIN_PATH) ?? false;
}

http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error)) {
      const status = error.response?.status;
      if (status === 401 && !isLoginRequest(error.config)) handlers.onUnauthorized?.();
      if (status === 403) handlers.onForbidden?.();
    }
    return Promise.reject(error);
  },
);
