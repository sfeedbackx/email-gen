import type { LoginData, SignupData } from '@appTypes/auth.types';
import { api } from '@lib/axios';
import useAuthStore from '@store/authStore';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@utils/constants';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const { user, token, login, logout } = useAuthStore();
  return { user, token, login, logout };
};

export const useSignup = () => {
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: SignupData) => api.post('/auth/register', data).then((res) => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken);
    },
  });
};

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) =>
      api.post('/auth/login', data, { withCredentials: true }).then((res) => res.data),

    onSuccess: (res) => {
      login(res.data.accessToken);
      navigate(ROUTES.CONTACTS);
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => api.post('/auth/logout', {}, { withCredentials: true }),
    onSuccess: () => {
      logout();
      navigate(ROUTES.LOGIN);
    },
    onError: () => {
      logout();
      navigate(ROUTES.LOGIN);
    },
  });
};

export const useRefresh = () => {
  const navigate = useNavigate();
  const { login, logout } = useAuthStore();

  return useMutation({
    mutationFn: () =>
      api.post('/auth/refresh', {}, { withCredentials: true }).then((res) => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken);
    },
    onError: () => {
      logout();
      navigate(ROUTES.LOGIN);
    },
  });
};
