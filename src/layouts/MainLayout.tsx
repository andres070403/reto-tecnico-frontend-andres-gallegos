import { List, LogOut, Plus } from 'lucide-react';
import { Link, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { BrandMark } from '@/components/BrandMark';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ROLES } from '@/features/auth/types';
import { useAuth } from '@/features/auth/useAuth';
import { cn } from '@/lib/cn';

export function MainLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#contenido"
        className="sr-only z-50 rounded-lg bg-white px-4 py-2 text-sm font-medium shadow focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link to="/pedidos" className="rounded-lg" aria-label="Ir al listado de pedidos">
            <BrandMark nameClassName="hidden sm:inline" />
          </Link>

          <MainNav className="hidden md:flex" />

          <div className="ml-auto flex items-center gap-3">
            {user && (
              <div className="flex items-center gap-2.5">
                <span
                  className="flex size-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700"
                  aria-hidden="true"
                >
                  {initials(user.name)}
                </span>
                <div className="flex flex-col items-start leading-tight sm:flex-row sm:items-center sm:gap-2">
                  <span className="max-w-[10rem] truncate text-sm font-medium text-slate-800">
                    {user.name}
                  </span>
                  <Badge
                    tone={user.role === ROLES.Admin ? 'primary' : 'neutral'}
                    className="px-2 py-0 text-[11px]"
                  >
                    {user.role || 'Sin rol'}
                  </Badge>
                </div>
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout('manual')}
              aria-label="Cerrar sesión"
            >
              <LogOut className="size-4" aria-hidden="true" />
              <span className="hidden sm:inline">Cerrar sesión</span>
            </Button>
          </div>
        </div>
        <MainNav className="flex border-t border-slate-100 px-2 py-1.5 md:hidden" />
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 focus:outline-none sm:px-6"
      >
        <Outlet />
      </main>
      <ScrollRestoration />
    </div>
  );
}

function MainNav({ className }: { className?: string }) {
  const { pathname } = useLocation();
  const isNew = pathname === '/pedidos/nuevo';
  const items = [
    {
      to: '/pedidos',
      label: 'Pedidos',
      icon: List,
      active: pathname.startsWith('/pedidos') && !isNew,
    },
    { to: '/pedidos/nuevo', label: 'Nuevo pedido', icon: Plus, active: isNew },
  ];

  return (
    <nav aria-label="Principal" className={cn('items-center gap-1', className)}>
      {items.map(({ to, label, icon: Icon, active }) => (
        <Link
          key={to}
          to={to}
          aria-current={active ? 'page' : undefined}
          className={cn(
            'flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors',
            active
              ? 'bg-primary-50 text-primary-800'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
          )}
        >
          <Icon className="size-4" aria-hidden="true" />
          {label}
        </Link>
      ))}
    </nav>
  );
}

function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join('') || '?'
  );
}
