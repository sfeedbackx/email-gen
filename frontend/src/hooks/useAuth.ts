import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { LoginData, SignupData } from "../types/auth.types.ts";
import { api } from "../lib/axios";
import { ROUTES } from "../utils/constants";
import useAuthStore from "../store/authStore";
import { HttpStatusCode } from "axios";
import { mapZodIssues } from "../utils/helpers";

export const useAuth = () => {
  const { user, token, login, logout } = useAuthStore();
  return { user, token, login, logout };
};

export const useSignup = (
  setErrors: (errors: Record<string, string>) => void,
  setServerError: (message: string) => void,
) => {
  //const navigate = useNavigate()
  const { login } = useAuthStore();
  return useMutation({
    mutationFn: (data: SignupData) =>
      api.post("/auth/register", data).then((res) => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;
      const serverStatus = error.response.status;
      const regex: RegExp = /email/;

      if (serverStatus === HttpStatusCode.Conflict && regex.test(serverError)) {
        setErrors({
          email: serverError,
        });
      } else {
        setServerError(serverError);
      }

      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = mapZodIssues(issues);
        setErrors(fieldErrors);
      }
    },
  });
};

export const useLogin = (
  setErrors: (errors: Record<string, string>) => void,
  setServerError: (message: string) => void,
) => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  return useMutation({
    mutationFn: (data: LoginData) =>
      api
        .post("/auth/login", data, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken);
      navigate(ROUTES.CONTACTS);
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors;
      const serverError = error.response?.data?.message;

      if (serverError) {
        setServerError(serverError);
      }

      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = mapZodIssues(issues);
        setErrors(fieldErrors);
      }
    },
  });
};
export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => api.post("/auth/logout", {}, { withCredentials: true }),
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
      api
        .post("/auth/refresh", {}, { withCredentials: true })
        .then((res) => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken);
    },
    onError: () => {
      logout();
      navigate(ROUTES.LOGIN);
    },
  });
};
