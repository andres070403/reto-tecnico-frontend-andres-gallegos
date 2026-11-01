import { useEffect } from 'react';
import { useRouteError } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { ErrorState } from '@/components/ui/States';

export function RouteErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4">
      <ErrorState
        title="Algo salió mal"
        message="Ocurrió un error inesperado al mostrar esta página."
      />
      <Button onClick={() => window.location.assign('/pedidos')}>Volver al inicio</Button>
    </main>
  );
}
