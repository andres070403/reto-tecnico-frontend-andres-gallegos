import { Skeleton } from '@/components/ui/States';

const ROWS = 6;

export function PedidosListSkeleton() {
  return (
    <div role="status" aria-label="Cargando pedidos">
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
        <Skeleton className="h-10 sm:w-80" />
        <Skeleton className="h-10 sm:w-48" />
      </div>
      <ul className="divide-y divide-slate-100">
        {Array.from({ length: ROWS }, (_, i) => (
          <li key={i} className="flex items-center gap-4 px-4 py-4">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 flex-1 sm:max-w-56" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
            <Skeleton className="hidden h-4 w-20 sm:block" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </li>
        ))}
      </ul>
    </div>
  );
}
