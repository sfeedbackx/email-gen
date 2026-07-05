import { UserAttributes, UserAttributesSchema } from '@modules/users/dto/users.enums';
import { relations } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { accountStatus, authProviderEnum, genderEnum, userTypeEnum } from './enums.schema';
// Permissions table
export const permissions = t.pgTable(
  'permissions',
  {
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    name: t.varchar('name', { length: 100 }).notNull().unique(),
    resource: t.varchar('resource', { length: 50 }).notNull(),
    action: t.varchar('action', { length: 50 }).notNull(),
    description: t.text('description'),
    createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [t.uniqueIndex('users_name_idx').on(table.name)],
);

// Roles
export const roles = t.pgTable('roles', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  name: t.varchar('name', { length: 100 }).notNull().unique(),
  targetType: userTypeEnum('target_type'),
  displayName: t.varchar('display_name', { length: 100 }),
  description: t.text('description'),
  isDefault: t.boolean('is_default').default(false).notNull(),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userRoles = t.pgTable('user_roles', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  userId: t
    .uuid('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  roleId: t
    .bigint('role_id', { mode: 'number' })
    .references(() => roles.id, { onDelete: 'cascade' })
    .notNull(),
  assignedAt: t.timestamp('assigned_at', { withTimezone: true }).defaultNow(),
});
// Role-Permission
export const rolePermissions = t.pgTable('role_permissions', {
  id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
  roleId: t
    .bigint('role_id', { mode: 'number' })
    .notNull()
    .references(() => roles.id, { onDelete: 'cascade' }),
  permissionId: t
    .bigint('permission_id', { mode: 'number' })
    .notNull()
    .references(() => permissions.id, { onDelete: 'cascade' }),
  createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// Users
export const users = t.pgTable(
  'users',
  {
    id: t.uuid('id').defaultRandom().primaryKey(),
    email: t.varchar('email', { length: 255 }).notNull().unique(),
    password: t.varchar('password', { length: 72 }),
    firstName: t.varchar('first_name', { length: 50 }),
    lastName: t.varchar('last_name', { length: 50 }),
    profilePicture: t.varchar('profile_picture', { length: 255 }),
    gender: genderEnum('gender'),
    dateOfBirth: t.date('date_of_birth'),
    authProvider: authProviderEnum('auth_provider').notNull().default('LOCAL'),
    providerId: t.varchar('provider_id', { length: 255 }),
    emailVerifiedAt: t.timestamp('email_verified_at', { withTimezone: true }),
    isActive: t.boolean('is_active').notNull().default(true),
    lastLoginAt: t.timestamp('last_login_at', { withTimezone: true }),
    userType: userTypeEnum('user_type').notNull().default('GUEST'),
    attributes: accountStatus('account_status').notNull().default('ACTIVE'),
    createdAt: t.timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: t
      .timestamp('updated_at', { withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [t.uniqueIndex('users_email_idx').on(table.email)],
);

// Refresh tokens
export const refreshTokens = t.pgTable(
  'refresh_tokens',
  {
    id: t.bigint('id', { mode: 'number' }).primaryKey().generatedAlwaysAsIdentity(),
    userId: t
      .uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: t.varchar('token', { length: 255 }).notNull().unique(),

    // Token metadata
    userAgent: t.varchar('user_agent', { length: 255 }).notNull(),
    ipAddress: t.varchar('ip_address', { length: 45 }).notNull(),

    // Expiration
    expiresAt: t.timestamp('expires_at', { precision: 6, withTimezone: true }).notNull(),

    // Revocation
    revokedAt: t.timestamp('revoked_at', { precision: 6, withTimezone: true }),

    //replacedBy
    replacedByToken: t.varchar('replaced_by_token', { length: 255 }).unique(),

    // Timestamps
    createdAt: t
      .timestamp('created_at', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: t
      .timestamp('updated_at', { precision: 6, withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => [
    // Indexes
    t.index('refresh_tokens_user_id_idx').on(table.userId),
  ],
);

// Users relations
export const usersRelations = relations(users, ({ many }) => ({
  refreshTokens: many(refreshTokens),
  userRoles: many(userRoles),
}));

export const rolesRelations = relations(roles, ({ many }) => ({
  userRoles: many(userRoles),
  rolePermissions: many(rolePermissions),
}));
export const usersToRoleRelations = relations(userRoles, ({ one }) => ({
  role: one(roles, {
    fields: [userRoles.roleId],
    references: [roles.id],
  }),
  user: one(users, {
    fields: [userRoles.userId],
    references: [users.id],
  }),
}));
export const permissionsRelations = relations(permissions, ({ many }) => ({
  rolePermissions: many(rolePermissions),
}));

export const rolePermissionsRelations = relations(rolePermissions, ({ one }) => ({
  role: one(roles, {
    fields: [rolePermissions.roleId],
    references: [roles.id],
  }),
  permission: one(permissions, {
    fields: [rolePermissions.permissionId],
    references: [permissions.id],
  }),
}));
export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
  user: one(users, {
    fields: [refreshTokens.userId],
    references: [users.id],
  }),
}));
