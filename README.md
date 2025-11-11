## Facebook Radar publico

Next.js App Router + OpenAI + Supabase Auth. Permite:

- Landing abierta (`/`) y analizador IA (`/analyze`) sin registro.
- Dashboard multiusuario (`/dashboard`) autenticado con Supabase para registrar grupos o paginas a vigilar.
- Formularios para suscripciones y alertas via Telegram o email.

### Estructura principal

```
app/
 - page.tsx                   (Landing publica)
 - analyze/page.tsx           (Analizador IA)
 - login/page.tsx             (Acceso con Supabase magic link)
 - auth/callback/route.ts     (Intercambia el code del enlace magico)
 - dashboard/
   - page.tsx                 (Lista los grupos del usuario)
   - add-group/page.tsx       (Formulario protegido para anadir URL)
   - components/              (AddGroupForm y GroupCard)
 - api/
   - analyze/route.ts         (Conexion con OpenAI Responses API)
   - groups/route.ts          (Registra grupos via Supabase o webhook)
   - subscribe/route.ts       (Guarda alertas de email/Telegram)
   - test/route.ts            (Smoke test para BOT_TOKEN + Telegram)
lib/supabase/                 (Helpers client/server + tipos)
```

### Variables de entorno (`.env.local`)

```
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1-mini
BOT_TOKEN=123456:abc
CHAT_ID=123456
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
SUBSCRIBER_WEBHOOK_URL=https://hooks.zapier.com/...
GROUP_WATCH_WEBHOOK_URL=https://queue.yourworker.dev/groups
```

El dashboard usa la anon key mediante `createServerComponentClient`. El service role queda reservado para workers o cron jobs que necesiten permisos completos.

### Tablas sugeridas (Supabase)

```sql
create table if not exists group_watchers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  url text not null,
  group_key text,
  created_at timestamptz default now()
);

create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text,
  telegram_handle text,
  created_at timestamptz default now()
);

create table if not exists analyses (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  payload jsonb not null,
  analysis text not null,
  created_at timestamptz default now()
);
```

Policies minimas:

```sql
create policy "owner can read groups"
on group_watchers
for select using ( auth.uid() = user_id );

create policy "owner can insert groups"
on group_watchers
for insert with check ( auth.uid() = user_id );
```

### Flujo del dashboard

1. El usuario abre `/login`, ingresa su email y recibe un enlace magico (Supabase).
2. `/auth/callback` intercambia el `code` por una sesion y redirige al dashboard.
3. `/dashboard` usa el cliente de servidor de Supabase para traer `group_watchers`.
4. `/dashboard/add-group` muestra `AddGroupForm`, que envia la URL a `/api/groups`.
5. `/api/groups`:
   - Si hay sesion, inserta la URL en Supabase y responde `{ ok: true, source: "dashboard" }`.
   - Si no hay sesion (formulario publico), valida contacto y reenvia al webhook `GROUP_WATCH_WEBHOOK_URL`.

### Worker / Scraper recomendado

1. Worker (Cloudflare, Edge Function, Playwright, etc.) que recorra `group_watchers`, abra cada URL y extraiga posts nuevos.
2. Cada post se envia a `POST /api/analyze` (o directo a OpenAI), se guarda en `analyses` y se notifican alertas (Telegram Bot API, email, etc.).
3. Programa la ejecucion con Vercel Cron, Render Cron o Supabase Edge Scheduler (cada 5 minutos modo realtime, 1 vez al dia modo daily).

### Scripts

| Comando        | Descripcion                          |
| -------------- | ------------------------------------ |
| `npm run dev`  | Servidor de desarrollo (puerto 3000) |
| `npm run lint` | Ejecuta ESLint                       |
| `npm run build`| Compila la app para produccion       |
| `npm start`    | Sirve la build compilada             |

### Checklist rapida

1. Crea `.env.local` con las claves (no lo publiques).
2. Ejecuta `npm install` para bajar las dependencias nuevas.
3. `npm run dev` y visita:
   - `/` -> landing con CTA al dashboard.
   - `/analyze` -> analizador IA publico.
   - `/login` -> formulario de enlace magico.
4. Tras iniciar sesion, visita `/dashboard` y usa `/dashboard/add-group`.
5. Opcional: abre `/api/test` para confirmar que BOT_TOKEN + CHAT_ID funcionan (deberias recibir un mensaje en Telegram).

### Pasos siguientes

1. Implementar el worker de scraping (Playwright, Edge Function) que consuma `group_watchers`.
2. Mostrar en el dashboard las publicaciones detectadas (`analyses`) con filtros y graficas.
3. Anadir botones para pausar/eliminar grupos y para setear palabras clave por usuario.
4. Integrar comandos en tu bot de Telegram (`/addgrupo <url>`) que hagan POST a `/api/groups`.
