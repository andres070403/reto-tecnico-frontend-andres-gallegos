import { isAxiosError } from 'axios';
import type { ProblemDetails } from '@/types/api';

export const NETWORK_ERROR_MESSAGE = 'No se pudo conectar con el servidor';
export const TIMEOUT_ERROR_MESSAGE =
  'El servidor tardó demasiado en responder. Intenta nuevamente.';
export const GENERIC_ERROR_MESSAGE = 'Ocurrió un error inesperado. Intenta nuevamente.';
export const FORBIDDEN_MESSAGE = 'No tienes permisos para realizar esta acción';

const STATUS_MESSAGES: Record<number, string> = {
  400: 'La solicitud contiene datos inválidos.',
  401: 'Tu sesión no es válida. Inicia sesión nuevamente.',
  403: FORBIDDEN_MESSAGE,
  404: 'El recurso solicitado no existe.',
  409: 'La operación entra en conflicto con datos existentes.',
};

export function isProblemDetails(value: unknown): value is ProblemDetails {
  return (
    typeof value === 'object' &&
    value !== null &&
    ('title' in value || 'detail' in value || 'errors' in value)
  );
}

export function getErrorStatus(error: unknown): number | undefined {
  return isAxiosError(error) ? error.response?.status : undefined;
}

export function getValidationErrors(error: unknown): Record<string, string[]> | undefined {
  if (!isAxiosError(error)) return undefined;
  const data: unknown = error.response?.data;
  return isProblemDetails(data) && data.errors ? data.errors : undefined;
}

export function getApiErrorMessage(error: unknown, fallback = GENERIC_ERROR_MESSAGE): string {
  if (!isAxiosError(error)) return fallback;

  if (!error.response) {
    return error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT'
      ? TIMEOUT_ERROR_MESSAGE
      : NETWORK_ERROR_MESSAGE;
  }

  const { status } = error.response;
  const data: unknown = error.response.data;

  if (isProblemDetails(data)) {
    const firstFieldError = data.errors ? Object.values(data.errors).flat()[0] : undefined;
    const message = firstFieldError ?? data.detail ?? data.title;
    if (message) return message;
  }

  if (status >= 500) return GENERIC_ERROR_MESSAGE;
  return STATUS_MESSAGES[status] ?? fallback;
}

export function isHandledGlobally(error: unknown): boolean {
  const status = getErrorStatus(error);
  return status === 401 || status === 403;
}
