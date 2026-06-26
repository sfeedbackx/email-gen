//export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  CHALLENGES: '/challenges',
  CHALLENGE_DETAIL: '/challenges/:id',
  CONTACTS: '/contacts',
  PROFILE: '/profile',
  ADMIN: '/admin',
  LOGOUT: '/logout',
  THREADS : '/threads',
  MESSAGE : '/messages'
};

export const LOCAL_STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
} as const;

export const AUTH_PREFIX = 'Bearer ';

export const TTL_MS = 1000 * 60 * 5

