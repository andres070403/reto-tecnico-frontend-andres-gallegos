import { Outlet } from 'react-router-dom';
import { BrandMark } from '@/components/BrandMark';

export function AuthLayout() {
  return (
    <div className="from-primary-50/70 flex min-h-dvh flex-col items-center justify-center bg-gradient-to-b to-slate-50 px-4 py-12">
      <BrandMark className="mb-8" />
      <main className="w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
