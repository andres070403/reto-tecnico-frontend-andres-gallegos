import { Pencil, Trash2 } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { ROLES } from '@/features/auth/types';
import { getApiErrorMessage, getErrorStatus } from '@/lib/apiError';
import { formatCurrency } from '@/lib/currency';
import { formatDate, formatDateTime } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { RoleGuard } from '@/routes/RoleGuard';
import { DeletePedidoDialog } from '../components/DeletePedidoDialog';
import { EstadoBadge } from '../components/EstadoBadge';
import { PedidoNotFound } from '../components/PedidoNotFound';
import { usePedido } from '../hooks/pedidosQueries';
import type { Pedido } from '../types';
import { parsePedidoId } from '../utils';

const BACK_TO_LIST = { to: '/pedidos', label: 'Volver a pedidos' };

export function PedidoDetailPage() {
  const id = parsePedidoId(useParams().id);
  const { data: pedido, error, isPending, isError, isFetching, refetch } = usePedido(id);

  if (id === null || getErrorStatus(error) === 404) return <PedidoNotFound />;
  if (isPending) return <DetailSkeleton />;
  if (isError) {
    return (
      <>
        <PageHeader title="Detalle del pedido" backTo={BACK_TO_LIST} />
        <Card>
          <ErrorState
            message={getApiErrorMessage(error)}
            onRetry={() => void refetch()}
            isRetrying={isFetching}
          />
        </Card>
      </>
    );
  }
  return <PedidoDetail pedido={pedido} />;
}

function PedidoDetail({ pedido }: { pedido: Pedido }) {
  useDocumentTitle(`Pedido ${pedido.numeroPedido}`);
  const navigate = useNavigate();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  return (
    <>
      <PageHeader
        backTo={BACK_TO_LIST}
        title={
          <span className="flex flex-wrap items-center gap-3">
            Pedido {pedido.numeroPedido}
            <EstadoBadge estado={pedido.estado} />
          </span>
        }
        description={pedido.cliente}
        actions={
          <>
            <ButtonLink to={`/pedidos/${pedido.id}/editar`} variant="secondary">
              <Pencil className="size-4" aria-hidden="true" />
              Editar
            </ButtonLink>
            <RoleGuard roles={[ROLES.Admin]}>
              <Button
                variant="secondary"
                className="text-red-700 hover:bg-red-50 hover:text-red-800"
                onClick={() => setConfirmingDelete(true)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Eliminar
              </Button>
            </RoleGuard>
          </>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <SectionTitle>Información del pedido</SectionTitle>
          <dl className="grid gap-x-6 gap-y-5 p-6 sm:grid-cols-2">
            <Item label="Número de pedido">{pedido.numeroPedido}</Item>
            <Item label="Estado">
              <EstadoBadge estado={pedido.estado} />
            </Item>
            <Item label="Cliente" className="sm:col-span-2">
              {pedido.cliente}
            </Item>
            <Item label="Fecha">
              <span className="tabular-nums">{formatDate(pedido.fecha)}</span>
            </Item>
            <Item label="Total">
              <span className="text-lg font-semibold tabular-nums">
                {formatCurrency(pedido.total)}
              </span>
            </Item>
          </dl>
        </Card>

        <Card>
          <SectionTitle>Auditoría</SectionTitle>
          <dl className="grid gap-5 p-6">
            <Item label="Creado por">{pedido.creadoPor}</Item>
            <Item label="Fecha de creación">
              <span className="tabular-nums">{formatDateTime(pedido.fechaCreacion)}</span>
            </Item>
            <Item label="Modificado por">
              {pedido.modificadoPor ?? <span className="text-slate-400">Sin modificaciones</span>}
            </Item>
            <Item label="Fecha de modificación">
              {pedido.fechaActualizacion ? (
                <span className="tabular-nums">{formatDateTime(pedido.fechaActualizacion)}</span>
              ) : (
                <span className="text-slate-400">—</span>
              )}
            </Item>
          </dl>
        </Card>
      </div>

      <DeletePedidoDialog
        pedido={confirmingDelete ? pedido : null}
        onClose={() => setConfirmingDelete(false)}
        onDeleted={() => navigate('/pedidos', { replace: true })}
      />
    </>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="border-b border-slate-200 px-6 py-4 text-sm font-semibold text-slate-900">
      {children}
    </h2>
  );
}

function Item({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <dt className="text-xs font-medium tracking-wide text-slate-500 uppercase">{label}</dt>
      <dd className="mt-1 text-sm text-slate-900">{children}</dd>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div role="status" aria-label="Cargando pedido">
      <Skeleton className="mb-3 h-4 w-32" />
      <Skeleton className="mb-8 h-8 w-64" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-64 lg:col-span-2" />
        <Skeleton className="h-64" />
      </div>
    </div>
  );
}
