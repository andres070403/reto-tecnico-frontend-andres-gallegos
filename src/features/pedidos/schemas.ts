import { z } from 'zod';
import { isValidDateInput, toApiDateTime, toDateInputValue } from '@/lib/dates';
import { CLIENTE_MAX, NUMERO_PEDIDO_MAX } from './constants';
import {
  ESTADOS_PEDIDO,
  type ActualizarPedidoRequest,
  type CrearPedidoRequest,
  type Pedido,
} from './types';

export const pedidoFormSchema = z.object({
  numeroPedido: z
    .string()
    .trim()
    .min(1, 'El número de pedido es obligatorio')
    .max(NUMERO_PEDIDO_MAX, `Máximo ${NUMERO_PEDIDO_MAX} caracteres`),
  cliente: z
    .string()
    .trim()
    .min(1, 'El cliente es obligatorio')
    .max(CLIENTE_MAX, `Máximo ${CLIENTE_MAX} caracteres`),
  fecha: z
    .string()
    .min(1, 'La fecha es obligatoria')
    .refine(isValidDateInput, 'Ingresa una fecha válida'),
  total: z
    .number({
      required_error: 'El total es obligatorio',
      invalid_type_error: 'Ingresa un monto válido',
    })
    .gt(0, 'El total debe ser mayor a 0')
    .refine((value) => Number.isInteger(Math.round(value * 100 * 1e6) / 1e6), 'Máximo 2 decimales'),
  estado: z.enum(ESTADOS_PEDIDO, { errorMap: () => ({ message: 'Selecciona un estado válido' }) }),
});

export type PedidoFormValues = z.infer<typeof pedidoFormSchema>;
export type PedidoFormField = keyof PedidoFormValues;
export const PEDIDO_FORM_FIELDS = Object.keys(pedidoFormSchema.shape) as PedidoFormField[];

export function toFormValues(pedido: Pedido): PedidoFormValues {
  return {
    numeroPedido: pedido.numeroPedido,
    cliente: pedido.cliente,
    fecha: toDateInputValue(pedido.fecha),
    total: pedido.total,
    estado: pedido.estado,
  };
}

export function toCrearRequest(values: PedidoFormValues): CrearPedidoRequest {
  return { ...values, fecha: toApiDateTime(values.fecha) };
}

export function toActualizarRequest(values: PedidoFormValues): ActualizarPedidoRequest {
  return {
    cliente: values.cliente,
    fecha: toApiDateTime(values.fecha),
    total: values.total,
    estado: values.estado,
  };
}
