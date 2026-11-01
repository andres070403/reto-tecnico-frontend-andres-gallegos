import { Badge } from '@/components/ui/Badge';
import { ESTADO_LABELS, ESTADO_TONES } from '../constants';
import type { EstadoPedido } from '../types';

export function EstadoBadge({ estado }: { estado: EstadoPedido }) {
  return (
    <Badge tone={ESTADO_TONES[estado] ?? 'neutral'} withDot>
      {ESTADO_LABELS[estado] ?? estado}
    </Badge>
  );
}
