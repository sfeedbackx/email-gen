# Medilink API Database

This directory contains the database schema and tools for Medilink API using Drizzle ORM.

## Schema Structure

The database schema is organized as follows:

- `users` - User accounts (admin, patient, professional)
- `categories` - Medical specialties/categories
- `offers` - Medical service offers posted by patients
- `applications` - Applications from professionals for offers
- `interventions` - Scheduled and executed medical interventions
- `reviews` - Reviews given after interventions
- `deposits` - Payment deposits for interventions
- `messages` - Direct messages between users
- `notifications` - System notifications

## Database Tools

### Migration Commands

- `pnpm db:push` - Push schema changes directly to the database
- `pnpm db:generate` - Generate SQL migration files
- `pnpm db:migrate` - Apply migrations
- `pnpm db:studio` - Open Drizzle Studio to view/edit data

### Seeding Tools

We use `drizzle-seed` for generating realistic test data. It creates deterministic data based on a seed value,
making it reproducible across environments.

#### Commands

- `pnpm db:seed` - Reset the database and seed it with test data
- `pnpm db:reset` - Just reset the database without seeding

#### Customizing the Seed Data

To modify the seed data:

1. Edit `seed.ts`
2. Adjust the `count` parameters to control how many records are created
3. Modify the generator functions to change the data characteristics
4. Use weighted random distributions to create realistic data patterns

Example of customizing a generator:

```typescript
columns: {
  email: f.email({ domains: ['custom-domain.com'] }),
  // Use custom value ranges
  budget: f.number({ minValue: 100, maxValue: 1000, precision: 100 }),
  // Use weighted random for realistic distributions
  status: f.weightedRandom([
    { weight: 0.7, value: f.default({ defaultValue: 'open' }) },
    { weight: 0.3, value: f.default({ defaultValue: 'completed' }) },
  ]),
}
```

## Notes

- The seed process completely resets the database before seeding
- The data is deterministic - the same seed value produces the same data
- To generate different data, change the seed value in `seed.ts`
