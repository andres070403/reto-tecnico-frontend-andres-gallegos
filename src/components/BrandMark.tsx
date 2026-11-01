import { ClipboardList } from 'lucide-react';
import { APP_NAME } from '@/lib/config';
import { cn } from '@/lib/cn';

interface BrandMarkProps {
  className?: string;
  nameClassName?: string;
}

export function BrandMark({ className, nameClassName }: BrandMarkProps) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <span className="bg-primary-700 flex size-8 items-center justify-center rounded-lg text-white shadow-sm">
        <ClipboardList className="size-4" aria-hidden="true" />
      </span>
      <span className={cn('font-semibold tracking-tight text-slate-900', nameClassName)}>
        {APP_NAME}
      </span>
    </span>
  );
}
