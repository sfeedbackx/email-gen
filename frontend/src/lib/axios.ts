import axios from 'axios';
import { env } from '../config/env';
import useAuthStore from '../store/authStore';
import { AUTH_PREFIX } from '../utils/constants';

export const api = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `${AUTH_PREFIX}${token}`;
  }
  return config;
});
