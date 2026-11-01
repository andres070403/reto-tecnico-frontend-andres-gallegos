import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { todayDateInput } from '@/lib/dates';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { PedidoForm } from '../components/PedidoForm';
import { useCreatePedido } from '../hooks/pedidosQueries';
import { useGoBack } from '../hooks/useGoBack';
import { toCrearRequest, type PedidoFormValues } from '../schemas';

export function PedidoCreatePage() {
  useDocumentTitle('Nuevo pedido');
  const navigate = useNavigate();
  const goBack = useGoBack('/pedidos');
  const createPedido = useCreatePedido();

  const handleSubmit = async (values: PedidoFormValues) => {
    const created = await createPedido.mutateAsync(toCrearRequest(values));
    toast.success(`Pedido ${created.numeroPedido} creado`);
    navigate('/pedidos');
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Nuevo pedido"
        description="Completa los datos del pedido. Los campos con * son obligatorios."
        backTo={{ to: '/pedidos', label: 'Volver a pedidos' }}
      />
      <Card>
        <PedidoForm
          mode="create"
          defaultValues={{
            numeroPedido: '',
            cliente: '',
            fecha: todayDateInput(),
            total: undefined,
            estado: 'Registrado',
          }}
          onSubmit={handleSubmit}
          onCancel={goBack}
        />
      </Card>
    </div>
  );
}
