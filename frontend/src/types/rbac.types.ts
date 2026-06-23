import type { AuthProvider, UserAttributes, UserType } from "./enums"

// Role
export interface Role {
  id: number
  name: string
  targetType?: UserType
  description?: string
}

// Role Permission
export interface RolePermission {
  id: number
  roleId: number
  permissionId: number
  createdAt: Date
}

// JWT Payload
export interface JwtPayload {
  sub: string
  email: string
  firstName: string
  lastName: string 
  authProvider: AuthProvider
  userAttributes: UserAttributes
  type: UserType
  role: Role[]
  permissions: string[]
  iat?: number
  exp?: number
}
