import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/cn';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import type { PedidosSort } from '../listing';
import type { Pedido, SortField } from '../types';
import { EstadoBadge } from './EstadoBadge';
import { PedidoActions } from './PedidoActions';

interface PedidosTableProps {
  pedidos: Pedido[];
  sort: PedidosSort;
  onSortChange: (sort: PedidosSort) => void;
  onDelete: (pedido: Pedido) => void;
}

const th = 'px-4 py-3 text-left text-xs font-medium tracking-wide text-slate-500 uppercase';

export function PedidosTable({ pedidos, sort, onSortChange, onDelete }: PedidosTableProps) {
  const toggleSort = (field: SortField) => {
    if (sort.field === field) {
      onSortChange({ field, direction: sort.direction === 'asc' ? 'desc' : 'asc' });
      return;
    }
    const isNumeric = field === 'fecha' || field === 'total';
    onSortChange({ field, direction: isNumeric ? 'desc' : 'asc' });
  };

  const sortable = (field: SortField, label: string, align: 'left' | 'right' = 'left') => {
    const active = sort.field === field;
    const Icon = !active ? ChevronsUpDown : sort.direction === 'asc' ? ArrowUp : ArrowDown;
    return (
      <th
        scope="col"
        className={cn(th, align === 'right' && 'text-right')}
        aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      >
        <button
          type="button"
          onClick={() => toggleSort(field)}
          className={cn(
            '-mx-1 inline-flex items-center gap-1 rounded px-1 uppercase hover:text-slate-900',
            active && 'text-slate-900',
          )}
        >
          {label}
          <Icon className={cn('size-3.5', !active && 'opacity-50')} aria-hidden="true" />
        </button>
      </th>
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[720px] text-sm">
        <caption className="sr-only">
          Listado de pedidos. Los encabezados con botón permiten ordenar.
        </caption>
        <thead className="border-b border-slate-200 bg-slate-50/60">
          <tr>
            {sortable('numeroPedido', 'Número')}
            {sortable('cliente', 'Cliente')}
            {sortable('fecha', 'Fecha')}
            {sortable('total', 'Total', 'right')}
            <th scope="col" className={th}>
              Estado
            </th>
            <th scope="col" className={cn(th, 'text-right')}>
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {pedidos.map((pedido) => (
            <tr key={pedido.id} className="transition-colors hover:bg-slate-50/80">
              <td className="px-4 py-3 font-medium whitespace-nowrap">
                <Link
                  to={`/pedidos/${pedido.id}`}
                  className="text-primary-800 hover:text-primary-900 rounded hover:underline"
                >
                  {pedido.numeroPedido}
                </Link>
              </td>
              <td
                className="max-w-[280px] truncate px-4 py-3 text-slate-700"
                title={pedido.cliente}
              >
                {pedido.cliente}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-slate-600 tabular-nums">
                {formatDate(pedido.fecha)}
              </td>
              <td className="px-4 py-3 text-right font-medium whitespace-nowrap text-slate-900 tabular-nums">
                {formatCurrency(pedido.total)}
              </td>
              <td className="px-4 py-3">
                <EstadoBadge estado={pedido.estado} />
              </td>
              <td className="px-4 py-2">
                <PedidoActions pedido={pedido} onDelete={onDelete} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
