import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { getValidationErrors } from './apiError';

export function normalizeFieldKey(key: string): string {
  const last = key.split('.').pop() ?? key;
  const clean = last.replace(/^\$/, '').replace(/\[\d+\]$/, '');
  return clean.charAt(0).toLowerCase() + clean.slice(1);
}

export function applyServerValidationErrors<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  fields: readonly Path<T>[],
): { applied: number; unmatched: string[] } {
  const errors = getValidationErrors(error);
  const result = { applied: 0, unmatched: [] as string[] };
  if (!errors) return result;

  for (const [key, messages] of Object.entries(errors)) {
    const field = fields.find((name) => name === normalizeFieldKey(key));
    const message = messages[0];
    if (!message) continue;
    if (field) {
      setError(field, { type: 'server', message }, { shouldFocus: result.applied === 0 });
      result.applied++;
    } else {
      result.unmatched.push(message);
    }
  }
  return result;
}
