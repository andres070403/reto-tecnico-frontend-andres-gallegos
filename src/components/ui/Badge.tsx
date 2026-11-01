import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'neutral' | 'info' | 'warning' | 'success' | 'danger' | 'primary';

const tones: Record<BadgeTone, { badge: string; dot: string }> = {
  neutral: { badge: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-500' },
  info: { badge: 'bg-sky-50 text-sky-800 ring-sky-200', dot: 'bg-sky-500' },
  warning: { badge: 'bg-amber-50 text-amber-800 ring-amber-200', dot: 'bg-amber-500' },
  success: { badge: 'bg-emerald-50 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-500' },
  danger: { badge: 'bg-rose-50 text-rose-800 ring-rose-200', dot: 'bg-rose-500' },
  primary: { badge: 'bg-primary-50 text-primary-800 ring-primary-200', dot: 'bg-primary-600' },
};

interface BadgeProps {
  tone?: BadgeTone;
  withDot?: boolean;
  className?: string;
  children: ReactNode;
}

export function Badge({ tone = 'neutral', withDot = false, className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset',
        tones[tone].badge,
        className,
      )}
    >
      {withDot && (
        <span className={cn('size-1.5 rounded-full', tones[tone].dot)} aria-hidden="true" />
      )}
      {children}
    </span>
  );
}
