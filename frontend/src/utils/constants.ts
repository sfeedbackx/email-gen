export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
  CONTACTS: '/contacts',
  LOGOUT: '/logout',
  THREADS: '/threads',
  MESSAGE: '/messages',
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const AUTH_PREFIX = 'Bearer ';

export const TTL_MS = 1000 * 60 * 5;
