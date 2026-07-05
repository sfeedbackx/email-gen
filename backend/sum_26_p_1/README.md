# Backend Documentation

## Stack

- NestJS
- TypeScript
- Drizzle ORM
- PostgreSQL
- Zod DTO contracts (`nestjs-zod`)

## Run

```bash
pnpm install
pnpm run start:dev
```

Build:

```bash
pnpm run build
```

## Database Commands

```bash
pnpm run db:push
pnpm run db:generate
pnpm run db:migrate
pnpm run db:seed
```

## Architecture

- `modules/*/*.controller.ts`: REST endpoints
- `modules/*/*.service.ts`: business logic and ownership checks
- `modules/*/*.repository.ts`: database operations
- `modules/*/dto/*.dto.ts`: request/response contracts
- `src/database/drizzle/schema/*`: DB schema definitions

## Main Domain Endpoints

### Contacts

- `GET /contacts`
- `POST /contacts`
- `GET /contacts/:id`
- `PATCH /contacts/:id`
- `DELETE /contacts/:id`

### Threads

- `GET /contacts/:contactId/threads`
- `POST /contacts/:contactId/threads`
- `GET /contacts/:contactId/threads/:id`
- `PATCH /contacts/:contactId/threads/:id`
- `DELETE /contacts/:contactId/threads/:id`

### Messages

- `GET /contacts/:contactId/threads/:threadId/messages`
- `POST /contacts/:contactId/threads/:threadId/messages`
- `DELETE /contacts/:contactId/threads/:threadId/messages/:id`

### Drafts

- `GET /contacts/:contactId/threads/:threadId/drafts`
- `POST /contacts/:contactId/threads/:threadId/drafts/generate`
- `PATCH /contacts/:contactId/threads/:threadId/drafts/:id`
- `DELETE /contacts/:contactId/threads/:threadId/drafts/:id`
- `POST /contacts/:contactId/threads/:threadId/drafts/:id/promote`

## Notes

- Services validate contact/thread ownership before mutation.
- Delete and promote flows return DTO-compatible data for frontend synchronization.

