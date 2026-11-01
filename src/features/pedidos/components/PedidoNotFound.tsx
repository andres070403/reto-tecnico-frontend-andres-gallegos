import { ArrowLeft, FileQuestion } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/States';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export function PedidoNotFound() {
  useDocumentTitle('Pedido no encontrado');
  return (
    <Card>
      <EmptyState
        icon={FileQuestion}
        title="Pedido no encontrado"
        description="El pedido que buscas no existe o fue eliminado."
        action={
          <ButtonLink to="/pedidos" variant="secondary">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Volver al listado
          </ButtonLink>
        }
      />
    </Card>
  );
}
