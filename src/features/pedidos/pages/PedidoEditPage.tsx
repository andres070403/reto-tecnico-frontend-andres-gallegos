import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ErrorState, Skeleton } from '@/components/ui/States';
import { getApiErrorMessage, getErrorStatus } from '@/lib/apiError';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { PedidoForm } from '../components/PedidoForm';
import { PedidoNotFound } from '../components/PedidoNotFound';
import { usePedido, useUpdatePedido } from '../hooks/pedidosQueries';
import { useGoBack } from '../hooks/useGoBack';
import { toActualizarRequest, toFormValues, type PedidoFormValues } from '../schemas';
import { parsePedidoId } from '../utils';

export function PedidoEditPage() {
  const id = parsePedidoId(useParams().id);
  const navigate = useNavigate();
  const goBack = useGoBack('/pedidos');
  const { data: pedido, error, isPending, isError, isFetching, refetch } = usePedido(id);
  const updatePedido = useUpdatePedido(id ?? -1);

  useDocumentTitle(pedido ? `Editar ${pedido.numeroPedido}` : 'Editar pedido');

  if (id === null || getErrorStatus(error) === 404) return <PedidoNotFound />;

  const handleSubmit = async (values: PedidoFormValues) => {
    const updated = await updatePedido.mutateAsync(toActualizarRequest(values));
    toast.success(`Pedido ${updated.numeroPedido} actualizado`);
    navigate('/pedidos');
  };

  const renderContent = () => {
    if (isPending) return <FormSkeleton />;
    if (isError) {
      return (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      );
    }
    return (
      <PedidoForm
        key={pedido.id}
        mode="edit"
        defaultValues={toFormValues(pedido)}
        onSubmit={handleSubmit}
        onCancel={goBack}
      />
    );
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title={pedido ? `Editar pedido ${pedido.numeroPedido}` : 'Editar pedido'}
        description="Actualiza los datos del pedido. Los campos con * son obligatorios."
        backTo={{ to: '/pedidos', label: 'Volver a pedidos' }}
      />
      <Card>{renderContent()}</Card>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div role="status" aria-label="Cargando pedido" className="grid gap-5 p-6 sm:grid-cols-2">
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={i === 2 ? 'sm:col-span-2' : undefined}>
          <Skeleton className="mb-2 h-4 w-28" />
          <Skeleton className="h-10" />
        </div>
      ))}
    </div>
  );
}
