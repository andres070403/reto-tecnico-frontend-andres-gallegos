import { cn } from '@/lib/cn';

export function describedBy(id: string, error?: string, hint?: string): string | undefined {
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}

export function controlClasses(hasError: boolean, className?: string): string {
  return cn(
    'h-10 w-full rounded-lg border bg-white px-3 text-sm text-slate-900 shadow-xs transition-colors placeholder:text-slate-400',
    'focus:outline-none focus-visible:outline-none focus:ring-2 focus:ring-offset-0',
    'disabled:cursor-not-allowed disabled:bg-slate-50',
    hasError
      ? 'border-red-400 focus:border-red-500 focus:ring-red-500/20'
      : 'border-slate-300 hover:border-slate-400 focus:border-primary-600 focus:ring-primary-600/20',
    className,
  );
}
