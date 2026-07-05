# Frontend

React + Vite client for EmailGen.

## Stack

- React 19 · TypeScript · Vite
- TanStack Query · Zustand
- Mantine UI · React Router

## Run

### Dev (standalone)

```bash
cp .env.example .env
pnpm install
pnpm run dev
```

### Docker

```bash
cp .env.docker .env
pnpm run build
# Then run from the root compose file
```

## Environment

| Env file | Use |
|---|---|
| `.env.example` | Local dev, points `VITE_API_BASE_URL` at `localhost:3000` |
| `.env.docker` | Docker Compose, sets `VITE_API_BASE_URL=/api` (nginx proxy) |

`src/config/env.ts` exposes this value, and `src/lib/axios.ts` uses it for all API requests.

## Folder Map

- `src/pages`: page-level screens (auth, contacts, messages, threads)
- `src/components`: shared UI
- `src/hooks`: API query/mutation hooks
- `src/store`: Zustand caches and cache update helpers
- `src/schemas`: zod validation schemas
- `src/context`: route-scoped context values (`contactId`, `threadId`)
- `src/lib`: API client (`axios`)

## Message Composer Behavior

In `MessageSection`:

- **Contact toggle OFF (gray)**: sends prompt to `drafts/generate`
- **Contact toggle ON (green)**: posts direct `CONTACT` message

Enter sends, Shift+Enter inserts newline.

