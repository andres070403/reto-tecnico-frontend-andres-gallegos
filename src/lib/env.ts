const rawApiUrl = import.meta.env.VITE_API_URL;

if (!rawApiUrl) {
  throw new Error(
    'Falta la variable de entorno VITE_API_URL. Copia .env.example a .env y configúrala.',
  );
}

export const env = {
  apiUrl: rawApiUrl.replace(/\/+$/, ''),
} as const;
