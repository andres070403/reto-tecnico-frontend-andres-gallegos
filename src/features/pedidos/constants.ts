import type { BadgeTone } from '@/components/ui/Badge';
import type { SelectOption } from '@/components/ui/Select';
import { ESTADOS_PEDIDO, type EstadoPedido } from './types';

export const ESTADO_LABELS: Record<EstadoPedido, string> = {
  Registrado: 'Registrado',
  EnProceso: 'En proceso',
  Completado: 'Completado',
  Cancelado: 'Cancelado',
};

export const ESTADO_TONES: Record<EstadoPedido, BadgeTone> = {
  Registrado: 'info',
  EnProceso: 'warning',
  Completado: 'success',
  Cancelado: 'danger',
};

export const ESTADO_OPTIONS: readonly SelectOption[] = ESTADOS_PEDIDO.map((estado) => ({
  value: estado,
  label: ESTADO_LABELS[estado],
}));

export function isEstadoPedido(value: unknown): value is EstadoPedido {
  return typeof value === 'string' && (ESTADOS_PEDIDO as readonly string[]).includes(value);
}

export const NUMERO_PEDIDO_MAX = 50;
export const CLIENTE_MAX = 150;
export const DUPLICATE_NUMERO_MESSAGE = 'Ya existe un pedido con este número';
