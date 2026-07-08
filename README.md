# EmailGen

AI-powered email assistant that helps you draft and manage email conversations. Uses a local LLM (Ollama) to generate email drafts from natural language prompts within your existing message threads.

- `frontend/`: React + Vite client
- `backend/sum_26_p_1/`: NestJS API + Drizzle ORM

## Quick Start

### Docker (full stack)

The compose file lives at `backend/sum_26_p_1/compose.yml` and includes all services: api, frontend, postgres, ollama, migrate.

```bash
# 1. Set up env files (copy .env.docker -> .env)
cp backend/sum_26_p_1/.env.docker backend/sum_26_p_1/.env
cp frontend/.env.docker frontend/.env

# 2. Run migrations (starts postgres first, then exits)
cd backend/sum_26_p_1
docker compose up -d migrate

# 3. Start API (starts ollama + postgres dependencies)
docker compose up -d api

# 4. Seed the database
docker compose exec api pnpm run db:seed

# 5. Start frontend
docker compose up -d frontend
```

### Development (local)

```bash
# 1. Set up env files (copy .env.example -> .env)
cp backend/sum_26_p_1/.env.example backend/sum_26_p_1/.env
cp frontend/.env.example frontend/.env

# 2. Start dependencies only (ollama + postgres)
cd backend/sum_26_p_1
docker compose up -d ollama postgres

# 3. Backend
pnpm install
pnpm run db:seed
pnpm run start:dev

# 4. Frontend (another terminal)
cd frontend
npm install
npm run dev
```
## Benchmarks 

We did a comparison between different local models: [qwen2.5, llama3.1, mistral]. Check them here: [Benchmark](./benchmark.md)

## Environment

**`.env.docker`** — for Docker Compose. Database connects via Docker service names (`postgres:5432`), Ollama via `ollama:11434`, and callback URLs use internal Docker hostnames.

**`.env.example`** — for local dev. Database connects to `localhost:5432`, Ollama to `localhost:11434`.

Key variables:

| Variable | What it is |
|---|---|
| `DATABASE_URL` | Postgres connection string |
| `JWT_SECRET` | Secret used to sign auth tokens |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials |
| `OLLAMA_HOST` | Where the Ollama service lives |
| `OLLAMA_MODEL` | LLM model to use (e.g. `mistral`) |
| `VITE_API_BASE_URL` | Frontend API proxy target |

## Application Flow

1. User authenticates.
2. User manages contacts.
3. User opens a contact and selects a thread.
4. Composer mode:
   - **Contact mode ON**: sends `POST /messages` with role `CONTACT`.
   - **Contact mode OFF**: sends `POST /drafts/generate`.
5. Draft actions:
   - edit: `PATCH /drafts/:id`
   - delete: `DELETE /drafts/:id`
   - promote: `POST /drafts/:id/promote` (creates message + removes draft)

## Core Frontend Layers

- **Hooks**: API calls and mutation/query orchestration
- **Stores (Zustand)**: local cache by `(contactId, threadId)` key
- **React Query**: server-state cache and loading/error lifecycle
- **Pages/Components**: UI for contacts, threads, messages, drafts

## Core Backend Layers

- **Controllers**: REST endpoints per module
- **Services**: business logic and ownership checks
- **Repositories**: Drizzle DB operations
- **DTO (zod)**: request/response validation and shape contracts

## License

GNU General Public License v3.0. See [LICENSE](LICENSE).
