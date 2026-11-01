# Pedidos - Frontend

Frontend del reto técnico de gestión de pedidos. Consume la API en .NET 8 y permite iniciar sesión, listar, buscar, crear, editar, ver el detalle y eliminar pedidos. La eliminación solo está disponible para usuarios con rol Admin.

## Stack

- React 18 + TypeScript en modo estricto, con Vite como bundler.
- React Router v6 para las rutas, incluidas las protegidas.
- TanStack Query para el estado del servidor.
- Axios con una sola instancia e interceptores para el token y los errores 401/403.
- React Hook Form + Zod para los formularios.
- Tailwind CSS v4 para los estilos.
- Sonner para las notificaciones.
- ESLint + Prettier.

Elegí TanStack Query porque casi todo el estado de la app viene del servidor. Con él no tuve que escribir a mano el loading, los errores, la caché ni el refetch. El estado propio del cliente se reduce a la sesión, que vive en un contexto. Por eso no usé Redux ni Zustand: habrían sido una capa de más para este tamaño de proyecto.

Usé React Hook Form + Zod porque el esquema de Zod sirve a la vez para validar y para tipar el formulario. Las reglas son las mismas que valida el backend.

## Requisitos

- Node 20 o superior.
- La API corriendo. Por defecto está en `https://localhost:7124`.

La API tiene CORS habilitado solo para `http://localhost:5173` y `http://localhost:3000`. Por eso Vite está configurado con `strictPort` en el puerto 5173: si el puerto está ocupado, falla en vez de levantarse en otro puerto en el que la API rechazaría las peticiones.

## Configuración

Copia el archivo de ejemplo y ajusta la URL si tu API corre en otro puerto:

```bash
cp .env.example .env
```

```
VITE_API_URL=https://localhost:7124
```

La URL no lleva barra final. Si la variable no está definida, la app falla al arrancar con un mensaje claro.

## Cómo ejecutarlo

```bash
npm install
npm run dev
```

Abre http://localhost:5173.

Otros scripts:

| Script            | Qué hace                                        |
| ----------------- | ----------------------------------------------- |
| `npm run build`   | Verifica los tipos y genera el build en `dist/` |
| `npm run preview` | Sirve el build en el puerto 5173                |
| `npm run lint`    | Ejecuta ESLint                                  |
| `npm run format`  | Formatea el código con Prettier                 |

Si el navegador da un error de certificado al llamar a la API, falta confiar en el certificado de desarrollo de .NET. Se soluciona ejecutando `dotnet dev-certs https --trust` en la máquina donde corre el backend.

## Usuarios de prueba

| Rol   | Email             | Contraseña |
| ----- | ----------------- | ---------- |
| Admin | admin@pedidos.com | Admin123*  |
| User  | user@pedidos.com  | User123*   |

En modo desarrollo también aparecen en la pantalla de login. En el build de producción no se incluyen.

## Estructura

```
src/
  api/            instancia de axios con interceptores, authApi y pedidosApi
  components/ui/  componentes reutilizables: Button, Input, Select, Modal,
                  ConfirmDialog, Badge, Pagination, estados vacío/error/carga
  features/
    auth/         login, AuthProvider, useAuth, lectura y expiración del token
    pedidos/      páginas, componentes, hooks de React Query, esquema Zod,
                  lógica de filtro/orden/paginación y tipos
  layouts/        MainLayout (navbar) y AuthLayout
  lib/            fechas, moneda, manejo de errores, configuración
  pages/          404 y página de error genérico
  routes/         router, ProtectedRoute/GuestRoute y RoleGuard
```

Organicé el código por feature y no por tipo de archivo. Así todo lo de pedidos (pantallas, hooks, validación) está en una sola carpeta y no repartido por todo el proyecto.

## Pantallas

| Ruta                  | Pantalla                                                                             |
| --------------------- | ------------------------------------------------------------------------------------ |
| `/login`              | Inicio de sesión. Si ya hay sesión, redirige a `/pedidos`.                           |
| `/pedidos`            | Listado con búsqueda, filtro por estado, orden por columna y paginación de 10 en 10. |
| `/pedidos/nuevo`      | Alta de pedido.                                                                      |
| `/pedidos/:id`        | Detalle del pedido, con los datos de auditoría.                                      |
| `/pedidos/:id/editar` | Edición. Si el pedido no existe, muestra un mensaje con un botón para volver.        |
| cualquier otra        | Página 404.                                                                          |

## Decisiones técnicas

### Estado del servidor con React Query

Las consultas usan keys centralizadas (`pedidosKeys`), así que la lista y el detalle se invalidan siempre de la misma forma:

- **Al crear o editar:** guardo la respuesta de la API directamente en la caché del detalle e invalido la lista. Al volver al listado, el cambio ya aparece.
- **Al eliminar:** invalido la lista. El detalle de ese pedido solo lo marco como obsoleto, sin volver a pedirlo. Si lo pidiera de nuevo mientras la pantalla de detalle sigue montada, la API respondería 404 por un pedido que yo mismo acabo de borrar.

Solo se reintentan los errores de red y los 5xx. Reintentar un 404 o un 400 no tiene sentido porque la respuesta va a ser la misma.

La búsqueda, el filtro, el orden y la página se guardan en la URL (`?q=ana&estado=Completado&pagina=2`). Así un enlace se puede compartir, sobrevive a recargar la página, y al volver desde el detalle el listado queda como estaba. La búsqueda tiene un debounce de 300 ms. El listado se filtra en el cliente porque la API devuelve todos los pedidos en una sola llamada y no tiene paginación propia.

### Manejo del token

El login devuelve un JWT. Lo decodifico con `jwt-decode` para obtener el id, el nombre, el email, el rol y la expiración. La firma no se valida en el frontend: eso lo hace la API.

.NET emite los claims con su URI larga (`http://schemas.microsoft.com/ws/2008/06/identity/claims/role`) y no como `role`. Lo comprobé con un token real de la API. Aun así, el código acepta las dos formas, por si cambia la configuración del backend.

El token se guarda en `localStorage`:

- Al cargar la app, si el token guardado ya expiró o no se puede leer, se descarta.
- Mientras la app está abierta, un timer calculado a partir de `exp` cierra la sesión cuando el token vence y muestra el aviso "Tu sesión expiró". También lo reviso al volver a la pestaña, porque los navegadores ralentizan los timers de las pestañas en segundo plano.
- Si se cierra la sesión en una pestaña, las demás se enteran por el evento `storage`.

El interceptor de request agrega el header `Authorization: Bearer`. El de response hace dos cosas:

- **Ante un 401:** cierra la sesión y la ruta protegida redirige al login. No aplica a la propia llamada de login, donde un 401 solo significa credenciales incorrectas.
- **Ante un 403:** muestra un toast de "No tienes permisos para realizar esta acción".

Sobre guardar el token en `localStorage` frente a una cookie httpOnly: `localStorage` es accesible desde JavaScript, así que si la app tuviera una vulnerabilidad XSS, un script inyectado podría leer el token. Una cookie httpOnly evita eso, pero exige cambios en el backend: que emita la cookie, que configure CORS con credenciales y que tenga protección CSRF. Además, la API del reto devuelve el token en el body. Para este alcance acepté el riesgo y lo mitigué así:

- El token dura una hora.
- La sesión se cierra en cuanto expira.
- React escapa el contenido por defecto y no uso `dangerouslySetInnerHTML`.

En producción preferiría una cookie httpOnly con `SameSite`, o un esquema de access token corto en memoria más un refresh token en cookie.

### Protección por rol

El botón Eliminar solo se muestra a Admin, mediante `RoleGuard` y `useHasRole`. Esto es solo para la experiencia de uso: la protección real está en la API, que responde 403 si un usuario User intenta eliminar. Si alguien fuerza la llamada, ve el toast de permisos.

### Fechas en hora local

El backend guarda las fechas como `DATETIME` sin zona horaria (`2025-01-10T00:00:00`). Si se pasan a `new Date()` y se tratan como UTC, en Lima (UTC-5) un pedido del 10 de enero aparece como del 9. Para evitarlo:

- **Al leer:** separo el string en sus partes (año, mes, día, hora) y armo la fecha local con ellas. Nunca agrego "Z" ni convierto zonas horarias.
- **Al enviar:** el valor del input date (`2025-01-10`) se manda como `2025-01-10T00:00:00`.
- **Al mostrar:** uso `Intl.DateTimeFormat('es-PE')`, que da `10/01/2025`.

Lo verifiqué contra la API: un pedido creado con fecha 15/03/2025 quedó guardado como `2025-03-15T00:00:00` y se muestra con el mismo día.

El total se formatea con `Intl.NumberFormat`. La moneda está en `src/lib/config.ts` (PEN por defecto).

### Formulario

Crear y editar usan el mismo componente `PedidoForm`. Las reglas coinciden con las del backend:

- Todos los campos son obligatorios.
- El número de pedido admite como máximo 50 caracteres y el cliente, 150.
- El total debe ser mayor a 0 y tener como máximo 2 decimales.
- El estado debe ser uno de los cuatro válidos.

Los errores de la API se muestran sobre el formulario:

- **400:** cada mensaje del campo `errors` se asigna a su input. La API devuelve las claves en PascalCase (`NumeroPedido`), así que las normalizo antes de asignarlas.
- **409:** el error aparece en el campo número de pedido y el foco se mueve a ese campo.
- **Cualquier otro error:** se muestra en una alerta general arriba del formulario.

Contrastando con el swagger, encontré una diferencia con el enunciado: el `PUT` no acepta `numeroPedido`. Por eso en la edición ese campo es de solo lectura y no se envía.

### Errores

`src/lib/apiError.ts` centraliza cómo se convierte cualquier error en un mensaje para el usuario:

- Si la API no responde, el mensaje es "No se pudo conectar con el servidor".
- Si la API responde con ProblemDetails, uso el primer error de validación, el `detail` o el `title`, en ese orden.
- En cualquier otro caso, un mensaje genérico.

Nunca se muestra un stack trace ni el cuerpo crudo de una respuesta.

### Accesibilidad

- Los labels están asociados a sus inputs y los errores se enlazan con `aria-describedby`.
- El foco es visible.
- Los botones que solo tienen icono llevan `aria-label`.
- El modal atrapa el foco, se cierra con Esc y devuelve el foco al elemento que lo abrió.
- En el diálogo de eliminar, el foco inicial va a "Cancelar", para que un Enter accidental no borre nada.
- Cada pantalla define su `document.title`.
