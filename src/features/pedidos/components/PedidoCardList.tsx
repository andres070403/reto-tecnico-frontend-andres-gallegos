import { Link } from 'react-router-dom';
import { formatCurrency } from '@/lib/currency';
import { formatDate } from '@/lib/dates';
import type { Pedido } from '../types';
import { EstadoBadge } from './EstadoBadge';
import { PedidoActions } from './PedidoActions';

interface PedidoCardListProps {
  pedidos: Pedido[];
  onDelete: (pedido: Pedido) => void;
}

export function PedidoCardList({ pedidos, onDelete }: PedidoCardListProps) {
  return (
    <ul className="divide-y divide-slate-100" aria-label="Listado de pedidos">
      {pedidos.map((pedido) => (
        <li key={pedido.id} className="px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <Link
                to={`/pedidos/${pedido.id}`}
                className="text-primary-800 rounded font-medium hover:underline"
              >
                {pedido.numeroPedido}
              </Link>
              <p className="truncate text-sm text-slate-700">{pedido.cliente}</p>
            </div>
            <EstadoBadge estado={pedido.estado} />
          </div>
          <div className="mt-2 flex items-center justify-between gap-3">
            <div className="flex items-baseline gap-3 text-sm tabular-nums">
              <span className="font-semibold text-slate-900">{formatCurrency(pedido.total)}</span>
              <span className="text-slate-500">{formatDate(pedido.fecha)}</span>
            </div>
            <PedidoActions pedido={pedido} onDelete={onDelete} />
          </div>
        </li>
      ))}
    </ul>
  );
}
