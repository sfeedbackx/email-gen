import * as t from 'drizzle-orm/pg-core';

// Enums
export const genderEnum = t.pgEnum('gender', ['MALE', 'FEMALE', 'OTHER']);
export const userTypeEnum = t.pgEnum('user_type', ['GUEST', 'USER', 'ADMIN']);
export const authProviderEnum = t.pgEnum('auth_provider', ['LOCAL', 'GOOGLE', 'FACEBOOK']);
export const messageRoleEnum = t.pgEnum('message_role', ['ME', 'CONTACT']);
export const languageEnum = t.pgEnum('language', ['en', 'fr']);
export const accountStatus = t.pgEnum('account_status', ['ACTIVE', 'INACTIVE', 'SUSPENDED']);
