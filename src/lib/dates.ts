import { LOCALE } from './config';

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2}))?(?:\.\d+)?)?$/;
const DATE_INPUT = /^\d{4}-\d{2}-\d{2}$/;

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

export function parseLocalDateTime(value: string): Date | null {
  const match = LOCAL_DATE_TIME.exec(value);
  if (!match) return null;
  const [, y, m, d, hh = '0', mm = '0', ss = '0'] = match;
  const date = new Date(Number(y), Number(m) - 1, Number(d), Number(hh), Number(mm), Number(ss));
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(value: string | null | undefined): string {
  const date = value ? parseLocalDateTime(value) : null;
  return date ? dateFormatter.format(date) : '—';
}

export function formatDateTime(value: string | null | undefined): string {
  const date = value ? parseLocalDateTime(value) : null;
  return date ? dateTimeFormatter.format(date) : '—';
}

export function toDateInputValue(value: string): string {
  return value.slice(0, 10);
}

export function toApiDateTime(dateInput: string): string {
  return `${dateInput}T00:00:00`;
}

export function isValidDateInput(value: string): boolean {
  if (!DATE_INPUT.test(value)) return false;
  const date = parseLocalDateTime(value);
  return date !== null && toLocalDateInput(date) === value;
}

export function todayDateInput(): string {
  return toLocalDateInput(new Date());
}

function toLocalDateInput(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}
