export interface Student {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  college: string;
  course: string;
  isVerified?: boolean;
}

export interface RegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  birthDate: string;
  gender: 'MALE' | 'FEMALE';
  college: string;
  course: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  student: Student;
}