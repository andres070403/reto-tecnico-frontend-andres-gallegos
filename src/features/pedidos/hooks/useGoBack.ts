import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useGoBack(fallback: string) {
  const navigate = useNavigate();
  const location = useLocation();
  const hasHistory = location.key !== 'default';

  return useCallback(() => {
    if (hasHistory) navigate(-1);
    else navigate(fallback, { replace: true });
  }, [hasHistory, navigate, fallback]);
}
