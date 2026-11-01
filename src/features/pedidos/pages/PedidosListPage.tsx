import { PackageOpen, Plus, SearchX } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { EmptyState, ErrorState } from '@/components/ui/States';
import { getApiErrorMessage } from '@/lib/apiError';
import { PAGE_SIZE } from '@/lib/config';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { DeletePedidoDialog } from '../components/DeletePedidoDialog';
import { PedidoCardList } from '../components/PedidoCardList';
import { PedidosListSkeleton } from '../components/PedidosListSkeleton';
import { PedidosTable } from '../components/PedidosTable';
import { PedidosToolbar } from '../components/PedidosToolbar';
import { usePedidos } from '../hooks/pedidosQueries';
import { useDebouncedSearch } from '../hooks/useDebouncedSearch';
import { usePedidosListParams } from '../hooks/usePedidosListParams';
import { filterPedidos, paginate, sortPedidos } from '../listing';
import type { Pedido } from '../types';

const newPedidoButton = (
  <ButtonLink to="/pedidos/nuevo">
    <Plus className="size-4" aria-hidden="true" />
    Nuevo pedido
  </ButtonLink>
);

export function PedidosListPage() {
  useDocumentTitle('Pedidos');
  const { data: pedidos, error, isPending, isError, isFetching, refetch } = usePedidos();
  const { params, update, reset } = usePedidosListParams();
  const [searchInput, setSearchInput] = useDebouncedSearch(params.search, (search) =>
    update({ search }),
  );
  const [pedidoToDelete, setPedidoToDelete] = useState<Pedido | null>(null);

  const visible = useMemo(
    () => sortPedidos(filterPedidos(pedidos ?? [], params), params.sort),
    [pedidos, params],
  );
  const page = paginate(visible, params.page, PAGE_SIZE);
  const hasActiveFilters = params.search !== '' || params.estado !== '';

  const clearFilters = () => {
    setSearchInput('');
    reset();
  };

  const renderContent = () => {
    if (isPending) return <PedidosListSkeleton />;

    if (isError && !pedidos) {
      return (
        <ErrorState
          message={getApiErrorMessage(error)}
          onRetry={() => void refetch()}
          isRetrying={isFetching}
        />
      );
    }

    if (pedidos.length === 0) {
      return (
        <EmptyState
          icon={PackageOpen}
          title="No hay pedidos"
          description="Todavía no se ha registrado ningún pedido. Crea el primero para empezar."
          action={newPedidoButton}
        />
      );
    }

    return (
      <>
        <PedidosToolbar
          search={searchInput}
          onSearchChange={setSearchInput}
          estado={params.estado}
          onEstadoChange={(estado) => update({ estado })}
          sort={params.sort}
          onSortChange={(sort) => update({ sort })}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          isRefreshing={isFetching}
        />

        {visible.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="Sin resultados"
            description="Ningún pedido coincide con la búsqueda o el filtro aplicado."
            action={
              <Button variant="secondary" onClick={clearFilters}>
                Limpiar filtros
              </Button>
            }
          />
        ) : (
          <>
            <div className="hidden md:block">
              <PedidosTable
                pedidos={page.items}
                sort={params.sort}
                onSortChange={(sort) => update({ sort })}
                onDelete={setPedidoToDelete}
              />
            </div>
            <div className="md:hidden">
              <PedidoCardList pedidos={page.items} onDelete={setPedidoToDelete} />
            </div>
            <div className="border-t border-slate-200 px-4 py-3">
              <Pagination
                page={page.page}
                totalPages={page.totalPages}
                totalItems={page.totalItems}
                pageSize={PAGE_SIZE}
                onPageChange={(next) => update({ page: next })}
                itemLabel={page.totalItems === 1 ? 'pedido' : 'pedidos'}
              />
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <>
      <PageHeader
        title="Pedidos"
        description="Consulta, busca y gestiona los pedidos registrados."
        actions={newPedidoButton}
      />
      <Card className="overflow-hidden">{renderContent()}</Card>
      <DeletePedidoDialog pedido={pedidoToDelete} onClose={() => setPedidoToDelete(null)} />
    </>
  );
}
