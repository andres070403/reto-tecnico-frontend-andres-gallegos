import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { pedidosApi } from '@/api/pedidosApi';
import type { ActualizarPedidoRequest, CrearPedidoRequest, Pedido } from '../types';

export const pedidosKeys = {
  all: ['pedidos'] as const,
  list: () => [...pedidosKeys.all, 'list'] as const,
  detail: (id: number) => [...pedidosKeys.all, 'detail', id] as const,
};

export function usePedidos() {
  return useQuery({
    queryKey: pedidosKeys.list(),
    queryFn: ({ signal }) => pedidosApi.getAll(signal),
  });
}

export function usePedido(id: number | null) {
  return useQuery({
    queryKey: pedidosKeys.detail(id ?? -1),
    queryFn: ({ signal }) => pedidosApi.getById(id as number, signal),
    enabled: id !== null,
  });
}

export function useCreatePedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: CrearPedidoRequest) => pedidosApi.create(request),
    onSuccess: (created) => {
      queryClient.setQueryData(pedidosKeys.detail(created.id), created);
      return queryClient.invalidateQueries({ queryKey: pedidosKeys.list() });
    },
  });
}

export function useUpdatePedido(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ActualizarPedidoRequest) => pedidosApi.update(id, request),
    onSuccess: (updated) => {
      queryClient.setQueryData(pedidosKeys.detail(id), updated);
      return queryClient.invalidateQueries({ queryKey: pedidosKeys.list() });
    },
  });
}

export function useDeletePedido() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (pedido: Pedido) => pedidosApi.remove(pedido.id),
    onSettled: (_data, _error, pedido) => {
      void queryClient.invalidateQueries({
        queryKey: pedidosKeys.detail(pedido.id),
        exact: true,
        refetchType: 'none',
      });
      return queryClient.invalidateQueries({ queryKey: pedidosKeys.list() });
    },
  });
}
