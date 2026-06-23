import { create } from 'zustand'
import { jwtDecode } from 'jwt-decode'
import type { UserWithPermissions } from '../types/user.type'
import type { JwtPayload } from '../types/rbac.types'
import { persist } from 'zustand/middleware'

const mapToUserWithPermission = (jwt: JwtPayload): UserWithPermissions => {
  return {
    id: jwt.sub,
    userType: jwt.type,
    authProvider : jwt.authProvider,
    email : jwt.email,
    firstName : jwt.firstName,
    lastName : jwt.lastName,
    permissions : jwt.permissions,
    role : jwt.role,
    userAttributes : jwt.userAttributes

  }
}

type AuthStore = {
  user: UserWithPermissions | null
  token: string | null
  isAuthenticated : boolean,
  login: (token: string) => void
  logout: () => void
}

const useAuthStore = create<AuthStore> ()(
  persist(
  (set) => ({
  user: null,
  token: null,
  isAuthenticated : false,

  login: (token) => {
    const decoded = jwtDecode<JwtPayload>(token)
    const user = mapToUserWithPermission(decoded)
    localStorage.setItem('token', token)
    set({ token, user: user , isAuthenticated : true })
  },

  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null })
  },
}),
 {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token })
    }
)
)

export default useAuthStore
