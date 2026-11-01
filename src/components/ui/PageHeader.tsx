import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  backTo?: { to: string; label: string };
}

export function PageHeader({ title, description, actions, backTo }: PageHeaderProps) {
  return (
    <header className="mb-6">
      {backTo && (
        <Link
          to={backTo.to}
          className="mb-3 inline-flex items-center gap-1.5 rounded text-sm font-medium text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          {backTo.label}
        </Link>
      )}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
