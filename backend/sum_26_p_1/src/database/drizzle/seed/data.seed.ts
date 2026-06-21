import { permissions } from '../schema';

type cacheMap = Map<string, number>;

export const rolesDataToSeed = [
  {
    name: 'guest',
    displayName: 'Guest',
    description: 'Default role assigned when user creates an account',
    isDefault: true,
    targetType: 'GUEST',
  },
  {
    name: 'user',
    displayName: 'User',
    description: 'Regular user with full access to their own email workspace',
    isDefault: false,
    targetType: 'USER',
  },
  {
    name: 'admin',
    displayName: 'Administrator',
    description: 'System administrator with full access',
    isDefault: false,
    targetType: 'ADMIN',
  },
];

export const permissionDataToSeed = [
  // Profile
  { name: 'profile:view', resource: 'profile', action: 'view', description: 'View own profile' },
  {
    name: 'profile:update',
    resource: 'profile',
    action: 'update',
    description: 'Update own profile',
  },
  {
    name: 'profile:delete',
    resource: 'profile',
    action: 'delete',
    description: 'Delete own account',
  },

  // Contacts
  {
    name: 'contacts:create',
    resource: 'contacts',
    action: 'create',
    description: 'Create a new contact',
  },
  { name: 'contacts:view', resource: 'contacts', action: 'view', description: 'View own contacts' },
  {
    name: 'contacts:update',
    resource: 'contacts',
    action: 'update',
    description: 'Update own contacts',
  },
  {
    name: 'contacts:delete',
    resource: 'contacts',
    action: 'delete',
    description: 'Delete own contacts',
  },

  // Documents
  {
    name: 'documents:create',
    resource: 'documents',
    action: 'create',
    description: 'Add document reference to a contact',
  },
  {
    name: 'documents:view',
    resource: 'documents',
    action: 'view',
    description: 'View documents of own contacts',
  },
  {
    name: 'documents:update',
    resource: 'documents',
    action: 'update',
    description: 'Update document reference',
  },
  {
    name: 'documents:delete',
    resource: 'documents',
    action: 'delete',
    description: 'Remove document reference',
  },

  // Threads
  {
    name: 'threads:create',
    resource: 'threads',
    action: 'create',
    description: 'Create a new thread under a contact',
  },
  { name: 'threads:view', resource: 'threads', action: 'view', description: 'View own threads' },
  { name: 'threads:update', resource: 'threads', action: 'update', description: 'Rename a thread' },
  {
    name: 'threads:delete',
    resource: 'threads',
    action: 'delete',
    description: 'Delete a thread and all its content',
  },

  // Messages
  {
    name: 'messages:create',
    resource: 'messages',
    action: 'create',
    description: 'Add a message to a thread',
  },
  {
    name: 'messages:view',
    resource: 'messages',
    action: 'view',
    description: 'View messages in own threads',
  },
  {
    name: 'messages:delete',
    resource: 'messages',
    action: 'delete',
    description: 'Delete a message',
  },

  // Drafts
  {
    name: 'drafts:generate',
    resource: 'drafts',
    action: 'generate',
    description: 'Ask AI to generate a draft',
  },
  { name: 'drafts:view', resource: 'drafts', action: 'view', description: 'View own drafts' },
  {
    name: 'drafts:update',
    resource: 'drafts',
    action: 'update',
    description: 'Manually edit a draft',
  },
  { name: 'drafts:delete', resource: 'drafts', action: 'delete', description: 'Delete a draft' },
  {
    name: 'drafts:promote',
    resource: 'drafts',
    action: 'promote',
    description: 'Promote draft to a sent message',
  },

  // AI
  {
    name: 'ai:generate',
    resource: 'ai',
    action: 'generate',
    description: 'Use AI to generate email drafts',
  },
  {
    name: 'ai:refine',
    resource: 'ai',
    action: 'refine',
    description: 'Use AI to refine existing drafts',
  },

  // Admin
  { name: 'admin:users', resource: 'admin', action: 'users', description: 'Manage all users' },
];

export const rolesPermissionDataToSeed = (
  insertedPermissions: (typeof permissions.$inferSelect)[],
  roleMap: cacheMap,
  permissionMap: cacheMap,
) => {
  return [
    // Admin gets everything
    ...insertedPermissions
      .map((p) => ({
        roleId: roleMap.get('admin'),
        permissionId: p.id,
      }))
      .filter((rp) => rp.roleId && rp.permissionId),

    // User gets full access to their own workspace
    ...[
      'profile:view',
      'profile:update',
      'profile:delete',
      'contacts:create',
      'contacts:view',
      'contacts:update',
      'contacts:delete',
      'documents:create',
      'documents:view',
      'documents:update',
      'documents:delete',
      'threads:create',
      'threads:view',
      'threads:update',
      'threads:delete',
      'messages:create',
      'messages:view',
      'messages:delete',
      'drafts:generate',
      'drafts:view',
      'drafts:update',
      'drafts:delete',
      'drafts:promote',
      'ai:generate',
      'ai:refine',
    ]
      .map((perm) => ({
        roleId: roleMap.get('user'),
        permissionId: permissionMap.get(perm),
      }))
      .filter((rp) => rp.roleId && rp.permissionId),

    // Guest gets profile only — can't use the app until upgraded to user
    ...['profile:view', 'profile:update']
      .map((perm) => ({
        roleId: roleMap.get('guest'),
        permissionId: permissionMap.get(perm),
      }))
      .filter((rp) => rp.roleId && rp.permissionId),
  ];
};
