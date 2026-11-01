import { ArrowLeft } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';
import { ButtonLink } from '@/components/ui/Button';
import { useDocumentTitle } from '@/lib/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página no encontrada');
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <BrandMark className="mb-10" />
      <p className="text-primary-700 text-sm font-semibold">Error 404</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
        Página no encontrada
      </h1>
      <p className="mt-3 max-w-md text-slate-500">
        La dirección que ingresaste no existe o fue movida.
      </p>
      <ButtonLink to="/pedidos" className="mt-8">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Ir a pedidos
      </ButtonLink>
    </main>
  );
}
