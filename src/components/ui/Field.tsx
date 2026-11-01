import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface FieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  required?: boolean;
  hideLabel?: boolean;
  className?: string;
  children: ReactNode;
}

export function Field({
  id,
  label,
  error,
  hint,
  required,
  hideLabel,
  className,
  children,
}: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <label
        htmlFor={id}
        className={cn('text-sm font-medium text-slate-700', hideLabel && 'sr-only')}
      >
        {label}
        {required && (
          <span className="ml-0.5 text-red-600" aria-hidden="true">
            *
          </span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="text-sm text-red-600">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="text-sm text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  );
}
