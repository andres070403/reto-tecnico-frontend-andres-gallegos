import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, type SelectOption } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Spinner';
import { ESTADO_OPTIONS, isEstadoPedido } from '../constants';
import type { PedidosSort } from '../listing';
import type { EstadoPedido, SortDirection, SortField } from '../types';

interface PedidosToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  estado: EstadoPedido | '';
  onEstadoChange: (value: EstadoPedido | '') => void;
  sort: PedidosSort;
  onSortChange: (sort: PedidosSort) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  isRefreshing: boolean;
}

const SORT_OPTIONS: readonly SelectOption[] = [
  { value: 'fecha:desc', label: 'Fecha (más recientes)' },
  { value: 'fecha:asc', label: 'Fecha (más antiguos)' },
  { value: 'total:desc', label: 'Total (mayor a menor)' },
  { value: 'total:asc', label: 'Total (menor a mayor)' },
  { value: 'cliente:asc', label: 'Cliente (A-Z)' },
  { value: 'cliente:desc', label: 'Cliente (Z-A)' },
  { value: 'numeroPedido:asc', label: 'Número (A-Z)' },
  { value: 'numeroPedido:desc', label: 'Número (Z-A)' },
];

export function PedidosToolbar({
  search,
  onSearchChange,
  estado,
  onEstadoChange,
  sort,
  onSortChange,
  hasActiveFilters,
  onClearFilters,
  isRefreshing,
}: PedidosToolbarProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-end">
      <Input
        type="search"
        label="Buscar pedidos"
        hideLabel
        placeholder="Buscar por número o cliente…"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        leadingIcon={<Search className="size-4" />}
        containerClassName="sm:max-w-sm sm:flex-1"
        autoComplete="off"
        spellCheck={false}
      />
      <Select
        label="Filtrar por estado"
        hideLabel
        placeholder="Todos los estados"
        options={ESTADO_OPTIONS}
        value={estado}
        onChange={(event) =>
          onEstadoChange(isEstadoPedido(event.target.value) ? event.target.value : '')
        }
        containerClassName="sm:w-48"
      />
      <Select
        label="Ordenar por"
        hideLabel
        options={SORT_OPTIONS}
        value={`${sort.field}:${sort.direction}`}
        onChange={(event) => {
          const [field, direction] = event.target.value.split(':') as [SortField, SortDirection];
          onSortChange({ field, direction });
        }}
        containerClassName="md:hidden"
      />
      {(isRefreshing || hasActiveFilters) && (
        <div className="flex items-center gap-3 sm:ml-auto">
          {isRefreshing && (
            <span className="flex items-center gap-2 text-sm text-slate-500">
              <Spinner size="sm" /> Actualizando…
            </span>
          )}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              <X className="size-4" aria-hidden="true" />
              Limpiar filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
