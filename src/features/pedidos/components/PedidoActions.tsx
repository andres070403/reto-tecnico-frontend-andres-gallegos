import { Eye, Pencil, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { buttonClasses } from '@/components/ui/buttonStyles';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/features/auth/types';
import { RoleGuard } from '@/routes/RoleGuard';
import type { Pedido } from '../types';

interface PedidoActionsProps {
  pedido: Pedido;
  onDelete: (pedido: Pedido) => void;
}

const iconLink = buttonClasses({ variant: 'ghost', size: 'icon' });

export function PedidoActions({ pedido, onDelete }: PedidoActionsProps) {
  const { id, numeroPedido } = pedido;

  return (
    <div className="flex items-center justify-end gap-0.5">
      <Link
        to={`/pedidos/${id}`}
        className={iconLink}
        aria-label={`Ver pedido ${numeroPedido}`}
        title="Ver detalle"
      >
        <Eye className="size-4" aria-hidden="true" />
      </Link>
      <Link
        to={`/pedidos/${id}/editar`}
        className={iconLink}
        aria-label={`Editar pedido ${numeroPedido}`}
        title="Editar"
      >
        <Pencil className="size-4" aria-hidden="true" />
      </Link>
      <RoleGuard roles={[ROLES.Admin]}>
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-red-50 hover:text-red-700"
          onClick={() => onDelete(pedido)}
          aria-label={`Eliminar pedido ${numeroPedido}`}
          title="Eliminar"
        >
          <Trash2 className="size-4" aria-hidden="true" />
        </Button>
      </RoleGuard>
    </div>
  );
}
