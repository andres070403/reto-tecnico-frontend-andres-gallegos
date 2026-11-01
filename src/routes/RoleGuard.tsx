import type { ReactNode } from 'react';
import { useHasRole } from '@/features/auth/useAuth';
import type { Role } from '@/features/auth/types';

interface RoleGuardProps {
  roles: Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

export function RoleGuard({ roles, children, fallback = null }: RoleGuardProps) {
  const allowed = useHasRole(...roles);
  return <>{allowed ? children : fallback}</>;
}
