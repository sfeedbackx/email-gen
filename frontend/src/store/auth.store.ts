import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import type { UserWithPermissions } from '../types/user.type'
import type { JwtPayload } from '../types/rbac.types'
import { persist } from 'zustand/middleware'

export type AuthStore = {
  user: UserWithPermissions | null
  token: string | null
  login: (token: string) => void
  logout: () => void
}

export const mapToUserWithPermission = (jwt: JwtPayload): UserWithPermissions => {
  return {
    id: jwt.sub,
    userType: jwt.type,
    authProvider: jwt.authProvider,
    email: jwt.email,
    firstName: jwt.firstName,
    lastName: jwt.lastName,
    permissions: jwt.permissions,
    role: jwt.role,
    userAttributes: jwt.userAttributes,
    iat : jwt.iat,
    exp : jwt.exp

  }
}


const useAuthStore = create<AuthStore>()(
    (set) => ({
      user: null,
      token: null,

      login: (token) => {
        const decoded = jwtDecode<JwtPayload>(token)
        const user = mapToUserWithPermission(decoded)
        set({ token, user: user })
      },

      logout: () => {
        localStorage.removeItem('token')
        localStorage.removeItem('auth-storage')
        set({ token: null, user: null })

      },
    }),
)

export default useAuthStore
