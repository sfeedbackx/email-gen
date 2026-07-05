import { UserType } from '@modules/users/dto/users.enums';
import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset } from 'drizzle-seed';
import { Pool } from 'pg';
import * as schema from './schema';
import { permissionDataToSeed, rolesDataToSeed, rolesPermissionDataToSeed } from './seed/data.seed';

config({ path: '.env' });

const runSeed = async () => {
  // Check for required environment variable
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Initialize drizzle with the pool
  const db = drizzle(pool);

  console.log('🗑  Resetting database...');

  if (process.env.RESET_DATABASE === 'true') {
    console.log('🗑  Resetting database...');
    await reset(db, schema);
  } else {
    console.log('⏭  Skipping database reset (set RESET_DATABASE=true to reset)');
  }

  console.log('🌱 Seeding database...');

  // Seed Roles
  const rolesData = rolesDataToSeed;

  const insertedRoles: (typeof schema.roles.$inferSelect)[] = [];
  for (const role of rolesData) {
    const tu = role.targetType as UserType;
    const [inserted] = await db
      .insert(schema.roles)
      .values({
        ...role,
        targetType: tu,
      })
      .returning();
    insertedRoles.push(inserted);
  }

  // Seed Permissions
  const permissionsData = permissionDataToSeed;

  const insertedPermissions: (typeof schema.permissions.$inferSelect)[] = [];
  for (const permission of permissionsData) {
    const [inserted] = await db.insert(schema.permissions).values(permission).returning();
    insertedPermissions.push(inserted);
  }

  // Create permission lookup
  const permissionMap = new Map(insertedPermissions.map((p) => [p.name, p.id]));
  const roleMap = new Map(insertedRoles.map((r) => [r.name, r.id]));

  const rolePermissionsData = rolesPermissionDataToSeed(
    insertedPermissions,
    roleMap,
    permissionMap,
  );

  // Type-safe role permissions data
  const validRolePermissions = rolePermissionsData as Array<{
    roleId: number;
    permissionId: number;
  }>;

  for (const rolePermission of validRolePermissions) {
    await db.insert(schema.rolePermissions).values(rolePermission);
  }

  console.log('✅ Database seeding completed!');
  console.log('\nCreated:');
  console.log(`  - ${insertedRoles.length} roles`);
  console.log(`  - ${insertedPermissions.length} permissions`);
  console.log(`  - ${rolePermissionsData.length} role-permission assignments`);

  // Close the pool
  await pool.end();
};

// Run the seed function
if (require.main === module) {
  runSeed()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('❌ Error seeding database:', error);
      process.exit(1);
    });
}

const seedTestData = async () => {
  // Check for required environment variable
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is required');
  }

  // Create a connection pool
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  // Initialize drizzle with the pool
  const db = drizzle(pool);

  console.log('🌱 Seeding test database (lite version)...');

  const rolesData = rolesDataToSeed;
  const insertedRoles: (typeof schema.roles.$inferSelect)[] = [];
  for (const role of rolesData) {
    const tu = role.targetType as UserType;
    const [inserted] = await db
      .insert(schema.roles)
      .values({
        ...role,
        targetType: tu,
      })
      .returning();
    insertedRoles.push(inserted);
  }

  const permissionsData = permissionDataToSeed;
  const insertedPermissions: (typeof schema.permissions.$inferSelect)[] = [];
  for (const permission of permissionsData) {
    const [inserted] = await db.insert(schema.permissions).values(permission).returning();
    insertedPermissions.push(inserted);
  }

  const permissionMap = new Map(insertedPermissions.map((p) => [p.name, p.id]));
  const roleMap = new Map(insertedRoles.map((r) => [r.name, r.id]));

  const rolePermissionsData = rolesPermissionDataToSeed(
    insertedPermissions,
    roleMap,
    permissionMap,
  );

  const validRolePermissions = rolePermissionsData as Array<{
    roleId: number;
    permissionId: number;
  }>;

  for (const rolePermission of validRolePermissions) {
    await db.insert(schema.rolePermissions).values(rolePermission);
  }

  console.log('✅ Test database lite seeding completed!');

  // Close the pool
  await pool.end();
};

// Export for programmatic usage
export { runSeed, seedTestData };
