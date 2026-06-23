export type SignupData = {
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  gender: 'MALE' | 'FEMALE'
}

export type LoginData = {
  email: string
  password: string
}
