export const ESTADOS_PEDIDO = ['Registrado', 'EnProceso', 'Completado', 'Cancelado'] as const;
export type EstadoPedido = (typeof ESTADOS_PEDIDO)[number];

export interface Pedido {
  id: number;
  numeroPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: EstadoPedido;
  creadoPor: string;
  fechaCreacion: string;
  modificadoPor: string | null;
  fechaActualizacion: string | null;
}

export interface CrearPedidoRequest {
  numeroPedido: string;
  cliente: string;
  fecha: string;
  total: number;
  estado: EstadoPedido;
}

export type ActualizarPedidoRequest = Omit<CrearPedidoRequest, 'numeroPedido'>;

export type SortField = 'numeroPedido' | 'cliente' | 'fecha' | 'total';
export type SortDirection = 'asc' | 'desc';
