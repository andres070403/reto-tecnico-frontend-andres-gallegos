import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { getApiErrorMessage, getErrorStatus, isHandledGlobally } from '@/lib/apiError';
import { useDeletePedido } from '../hooks/pedidosQueries';
import type { Pedido } from '../types';

interface DeletePedidoDialogProps {
  pedido: Pedido | null;
  onClose: () => void;
  onDeleted?: () => void;
}

export function DeletePedidoDialog({ pedido, onClose, onDeleted }: DeletePedidoDialogProps) {
  const deleteMutation = useDeletePedido();

  const handleConfirm = () => {
    if (!pedido) return;
    deleteMutation.mutate(pedido, {
      onSuccess: () => {
        toast.success(`Pedido ${pedido.numeroPedido} eliminado`);
        onClose();
        onDeleted?.();
      },
      onError: (error) => {
        const status = getErrorStatus(error);
        if (status === 404) {
          toast.info(`El pedido ${pedido.numeroPedido} ya no existe`);
          onClose();
          onDeleted?.();
          return;
        }
        if (!isHandledGlobally(error)) toast.error(getApiErrorMessage(error));
        if (status === 403) onClose();
      },
    });
  };

  return (
    <ConfirmDialog
      open={pedido !== null}
      title={`¿Eliminar el pedido ${pedido?.numeroPedido ?? ''}?`}
      description={
        <>
          Se eliminará el pedido de{' '}
          <strong className="font-medium text-slate-800">{pedido?.cliente}</strong>. Esta acción no
          se puede deshacer.
        </>
      }
      confirmLabel="Eliminar"
      isLoading={deleteMutation.isPending}
      onConfirm={handleConfirm}
      onCancel={onClose}
    />
  );
}
