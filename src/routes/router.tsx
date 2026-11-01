import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '@/features/auth/LoginPage';
import { PedidoCreatePage } from '@/features/pedidos/pages/PedidoCreatePage';
import { PedidoDetailPage } from '@/features/pedidos/pages/PedidoDetailPage';
import { PedidoEditPage } from '@/features/pedidos/pages/PedidoEditPage';
import { PedidosListPage } from '@/features/pedidos/pages/PedidosListPage';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';
import { GuestRoute, ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter(
  [
    {
      errorElement: <RouteErrorPage />,
      children: [
        {
          element: <GuestRoute />,
          children: [
            { element: <AuthLayout />, children: [{ path: '/login', element: <LoginPage /> }] },
          ],
        },
        {
          element: <ProtectedRoute />,
          children: [
            {
              element: <MainLayout />,
              children: [
                { path: '/', element: <Navigate to="/pedidos" replace /> },
                { path: '/pedidos', element: <PedidosListPage /> },
                { path: '/pedidos/nuevo', element: <PedidoCreatePage /> },
                { path: '/pedidos/:id', element: <PedidoDetailPage /> },
                { path: '/pedidos/:id/editar', element: <PedidoEditPage /> },
              ],
            },
          ],
        },
        { path: '*', element: <NotFoundPage /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
