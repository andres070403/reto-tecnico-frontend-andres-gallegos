import type { EstadoPedido, Pedido, SortDirection, SortField } from './types';

export interface PedidosFilters {
  search: string;
  estado: EstadoPedido | '';
}

export interface PedidosSort {
  field: SortField;
  direction: SortDirection;
}

function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLocaleLowerCase('es');
}

export function filterPedidos(pedidos: readonly Pedido[], filters: PedidosFilters): Pedido[] {
  const term = normalize(filters.search.trim());
  return pedidos.filter((pedido) => {
    if (filters.estado && pedido.estado !== filters.estado) return false;
    if (!term) return true;
    return (
      normalize(pedido.numeroPedido).includes(term) || normalize(pedido.cliente).includes(term)
    );
  });
}

const collator = new Intl.Collator('es', { sensitivity: 'base', numeric: true });

const comparators: Record<SortField, (a: Pedido, b: Pedido) => number> = {
  numeroPedido: (a, b) => collator.compare(a.numeroPedido, b.numeroPedido),
  cliente: (a, b) => collator.compare(a.cliente, b.cliente),
  fecha: (a, b) => a.fecha.localeCompare(b.fecha),
  total: (a, b) => a.total - b.total,
};

export function sortPedidos(pedidos: readonly Pedido[], sort: PedidosSort): Pedido[] {
  const factor = sort.direction === 'asc' ? 1 : -1;
  const compare = comparators[sort.field];
  return [...pedidos].sort((a, b) => compare(a, b) * factor || b.id - a.id);
}

export interface Page<T> {
  items: T[];
  page: number;
  totalPages: number;
  totalItems: number;
}

export function paginate<T>(items: readonly T[], page: number, pageSize: number): Page<T> {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: current,
    totalPages,
    totalItems: items.length,
  };
}
