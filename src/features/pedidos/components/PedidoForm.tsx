import { zodResolver } from '@hookform/resolvers/zod';
import { Save } from 'lucide-react';
import { useForm, type DefaultValues } from 'react-hook-form';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { ErrorAlert } from '@/components/ui/States';
import { getApiErrorMessage, getErrorStatus, isHandledGlobally } from '@/lib/apiError';
import { CURRENCY_SYMBOL } from '@/lib/currency';
import { applyServerValidationErrors } from '@/lib/formErrors';
import {
  CLIENTE_MAX,
  DUPLICATE_NUMERO_MESSAGE,
  ESTADO_OPTIONS,
  NUMERO_PEDIDO_MAX,
} from '../constants';
import { PEDIDO_FORM_FIELDS, pedidoFormSchema, type PedidoFormValues } from '../schemas';

interface PedidoFormProps {
  mode: 'create' | 'edit';
  defaultValues: DefaultValues<PedidoFormValues>;
  onSubmit: (values: PedidoFormValues) => Promise<void>;
  onCancel: () => void;
}

const toOptionalNumber = (value: unknown) =>
  value === '' || value === null || value === undefined ? undefined : Number(value);

export function PedidoForm({ mode, defaultValues, onSubmit, onCancel }: PedidoFormProps) {
  const isEdit = mode === 'edit';
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<PedidoFormValues>({
    resolver: zodResolver(pedidoFormSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const submit = handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (isHandledGlobally(error)) return;

      if (getErrorStatus(error) === 409) {
        setError(
          'numeroPedido',
          { type: 'server', message: DUPLICATE_NUMERO_MESSAGE },
          { shouldFocus: true },
        );
        return;
      }

      const { applied, unmatched } = applyServerValidationErrors(
        error,
        setError,
        PEDIDO_FORM_FIELDS,
      );
      if (applied > 0 && unmatched.length === 0) return;

      setError('root.server', {
        type: 'server',
        message: unmatched[0] ?? getApiErrorMessage(error),
      });
    }
  });

  return (
    <form onSubmit={submit} noValidate aria-label={isEdit ? 'Editar pedido' : 'Nuevo pedido'}>
      <div className="grid gap-5 p-6 sm:grid-cols-2">
        {errors.root?.server && (
          <ErrorAlert className="sm:col-span-2" title="No se pudo guardar el pedido">
            {errors.root.server.message}
          </ErrorAlert>
        )}

        <Input
          label="Número de pedido"
          required
          placeholder="PE-006"
          maxLength={NUMERO_PEDIDO_MAX}
          readOnly={isEdit}
          autoComplete="off"
          hint={isEdit ? 'El número de pedido no se puede modificar.' : undefined}
          error={errors.numeroPedido?.message}
          {...register('numeroPedido')}
        />

        <Select
          label="Estado"
          required
          placeholder="Selecciona un estado"
          options={ESTADO_OPTIONS}
          error={errors.estado?.message}
          {...register('estado')}
        />

        <Input
          label="Cliente"
          required
          placeholder="Nombre o razón social"
          maxLength={CLIENTE_MAX}
          autoComplete="off"
          error={errors.cliente?.message}
          containerClassName="sm:col-span-2"
          {...register('cliente')}
        />

        <Input
          label="Fecha"
          type="date"
          required
          error={errors.fecha?.message}
          {...register('fecha')}
        />

        <Input
          label="Total"
          type="number"
          required
          inputMode="decimal"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          leadingIcon={
            <span className="text-sm font-medium text-slate-500">{CURRENCY_SYMBOL}</span>
          }
          className="tabular-nums"
          error={errors.total?.message}
          {...register('total', { setValueAs: toOptionalNumber })}
        />
      </div>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50/60 px-6 py-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {!isSubmitting && <Save className="size-4" aria-hidden="true" />}
          {isSubmitting ? 'Guardando…' : isEdit ? 'Guardar cambios' : 'Crear pedido'}
        </Button>
      </div>
    </form>
  );
}
