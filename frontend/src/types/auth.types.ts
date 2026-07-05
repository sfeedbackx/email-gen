import type { UserWithPermissions } from './user.types';

export type SignupData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
};

export type LoginData = {
  email: string;
  password: string;
};

export type AuthStore = {
  user: UserWithPermissions | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};
