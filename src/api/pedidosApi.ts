import type { ActualizarPedidoRequest, CrearPedidoRequest, Pedido } from '@/features/pedidos/types';
import { http } from './httpClient';

const BASE_PATH = '/api/pedidos';

export const pedidosApi = {
  async getAll(signal?: AbortSignal): Promise<Pedido[]> {
    const { data } = await http.get<Pedido[]>(BASE_PATH, { signal });
    return data;
  },

  async getById(id: number, signal?: AbortSignal): Promise<Pedido> {
    const { data } = await http.get<Pedido>(`${BASE_PATH}/${id}`, { signal });
    return data;
  },

  async create(request: CrearPedidoRequest): Promise<Pedido> {
    const { data } = await http.post<Pedido>(BASE_PATH, request);
    return data;
  },

  async update(id: number, request: ActualizarPedidoRequest): Promise<Pedido> {
    const { data } = await http.put<Pedido>(`${BASE_PATH}/${id}`, request);
    return data;
  },

  async remove(id: number): Promise<void> {
    await http.delete(`${BASE_PATH}/${id}`);
  },
};
