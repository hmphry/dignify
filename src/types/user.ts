export interface User {
  _id?: string;
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  role: UserRole;
}

export interface PublicUser {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  role: UserRole;
}

export type UserRole = 'admin' | 'user' | 'disabled' | 'locked';