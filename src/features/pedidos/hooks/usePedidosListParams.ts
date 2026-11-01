import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { isEstadoPedido } from '../constants';
import type { PedidosFilters, PedidosSort } from '../listing';
import type { SortField } from '../types';

const SORT_FIELDS: readonly SortField[] = ['numeroPedido', 'cliente', 'fecha', 'total'];
export const DEFAULT_SORT: PedidosSort = { field: 'fecha', direction: 'desc' };

export interface PedidosListParams extends PedidosFilters {
  sort: PedidosSort;
  page: number;
}

export function usePedidosListParams() {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo<PedidosListParams>(() => {
    const estado = searchParams.get('estado');
    const field = searchParams.get('orden') as SortField | null;
    const direction = searchParams.get('dir');
    const page = Number(searchParams.get('pagina'));
    const hasValidField = field !== null && SORT_FIELDS.includes(field);

    return {
      search: searchParams.get('q') ?? '',
      estado: isEstadoPedido(estado) ? estado : '',
      sort: hasValidField
        ? { field, direction: direction === 'asc' ? 'asc' : 'desc' }
        : DEFAULT_SORT,
      page: Number.isInteger(page) && page > 0 ? page : 1,
    };
  }, [searchParams]);

  const update = useCallback(
    (changes: Partial<PedidosListParams>) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          const set = (key: string, value: string | null) =>
            value ? next.set(key, value) : next.delete(key);

          if (changes.search !== undefined) set('q', changes.search.trim());
          if (changes.estado !== undefined) set('estado', changes.estado);
          if (changes.sort) {
            const isDefault =
              changes.sort.field === DEFAULT_SORT.field &&
              changes.sort.direction === DEFAULT_SORT.direction;
            set('orden', isDefault ? null : changes.sort.field);
            set('dir', isDefault ? null : changes.sort.direction);
          }
          const page = changes.page ?? 1;
          set('pagina', page > 1 ? String(page) : null);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  const reset = useCallback(() => setSearchParams({}, { replace: true }), [setSearchParams]);

  return { params, update, reset };
}
