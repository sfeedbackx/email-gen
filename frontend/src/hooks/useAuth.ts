import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import type { LoginData, SignupData } from "../types/auth.types"
import { api } from '../lib/axios'
import { ROUTES } from '../utils/constants'
import useAuthStore from '../store/auth.store'
import { HttpStatusCode } from 'axios'

export const useAuth = () => {
  const { user, token, isAuthenticated, login, logout } = useAuthStore()
  return { user, token, isAuthenticated, login, logout }
}

export const useSignup = (setErrors: (errors: Record<string, string>) => void,
  setServerError: (message: string) => void
) => {
  //const navigate = useNavigate()
  const { login } = useAuthStore()
  return useMutation({
    mutationFn: (data: SignupData) =>
      api.post('/auth/register', data).then(res => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken)
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors
      const serverError = error.response?.data?.message
      const serverStatus = error.response.status;
      const regex: RegExp = /email/;

      if (serverStatus === HttpStatusCode.Conflict && regex.test(serverError)) {
        setErrors({
          email: serverError
        })
      }
      else {
        setServerError(serverError)
      }

      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = {}
        issues.forEach((issue: any) => {
          const field = issue.path[0]
          if (field) fieldErrors[field] = issue.message
        })
        setErrors(fieldErrors)
      }
    }
  })
}

export const useLogin = (setErrors: (errors: Record<string, string>) => void,
  setServerError: (message: string) => void
) => {
  const navigate = useNavigate()
  const { login } = useAuthStore()


  return useMutation({
    mutationFn: (data: LoginData) =>
      api.post('/auth/login', data).then(res => res.data),
    onSuccess: (res) => {
      login(res.data.accessToken)
      navigate(ROUTES.MESSAGE)
    },
    onError: (error: any) => {
      const issues = error.response?.data?.errors
      const serverError = error.response?.data?.message

      if (serverError) {
        setServerError(serverError)
      }

      if (Array.isArray(issues)) {
        const fieldErrors: Record<string, string> = {}
        issues.forEach((issue: any) => {
          const field = issue.path[0]
          if (field) fieldErrors[field] = issue.message
        })
        setErrors(fieldErrors)
      }
    }
  })
}
