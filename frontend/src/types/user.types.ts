import type { AuthProvider, UserAttributes, UserType } from "./enums"
import type { Role } from "./rbac.types"

export interface UserWithPermissions {
  id: string
  email: string
  firstName: string
  lastName: string 
  userAttributes: UserAttributes
  userType: UserType
  authProvider: AuthProvider
  role: Role[]
  permissions: string[]
  iat : number,
  exp : number
}

