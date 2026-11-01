import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorAlert } from '@/components/ui/States';
import { getApiErrorMessage, getErrorStatus } from '@/lib/apiError';
import { useDocumentTitle } from '@/lib/useDocumentTitle';
import { INVALID_CREDENTIALS_MESSAGE } from './messages';
import { useAuth } from './useAuth';

const loginSchema = z.object({
  email: z.string().trim().min(1, 'El email es obligatorio').email('Ingresa un email válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  useDocumentTitle('Iniciar sesión');
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch (error) {
      setError('root.server', {
        message:
          getErrorStatus(error) === 401 ? INVALID_CREDENTIALS_MESSAGE : getApiErrorMessage(error),
      });
    }
  });

  return (
    <>
      <div className="mb-6">
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">Iniciar sesión</h1>
        <p className="mt-1 text-sm text-slate-500">
          Ingresa con tu cuenta para gestionar los pedidos.
        </p>
      </div>

      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        {errors.root?.server && <ErrorAlert>{errors.root.server.message}</ErrorAlert>}

        <Input
          label="Email"
          type="email"
          autoComplete="username"
          placeholder="tu@empresa.com"
          autoFocus
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Contraseña"
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
          trailing={
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={() => setShowPassword((visible) => !visible)}
              aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              aria-pressed={showPassword}
            >
              {showPassword ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
            </Button>
          }
        />

        <Button type="submit" className="mt-2 w-full" isLoading={isSubmitting}>
          {!isSubmitting && <LogIn className="size-4" aria-hidden="true" />}
          {isSubmitting ? 'Ingresando…' : 'Ingresar'}
        </Button>
      </form>

      {import.meta.env.DEV && <DemoCredentials />}
    </>
  );
}

function DemoCredentials() {
  return (
    <div className="mt-6 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-xs text-slate-600">
      <p className="mb-1 font-medium text-slate-700">Usuarios de prueba</p>
      <p>
        Admin: <code>admin@pedidos.com</code> / <code>Admin123*</code>
      </p>
      <p>
        User: <code>user@pedidos.com</code> / <code>User123*</code>
      </p>
    </div>
  );
}
