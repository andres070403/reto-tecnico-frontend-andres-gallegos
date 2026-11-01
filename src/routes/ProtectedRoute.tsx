import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';

export interface LocationState {
  from?: { pathname: string; search: string };
}

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const state: LocationState = {
      from: { pathname: location.pathname, search: location.search },
    };
    return <Navigate to="/login" replace state={state} />;
  }
  return <Outlet />;
}

export function GuestRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as LocationState | null)?.from;
    return <Navigate to={from ? `${from.pathname}${from.search}` : '/pedidos'} replace />;
  }
  return <Outlet />;
}
