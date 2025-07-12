import { apiFetch, handleResponse, setAuthToken, removeAuthToken } from './api';
import { User } from '../types';

export interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  location: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export const authService = {
  // Sign up
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await apiFetch('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        location: data.location
      })
    });

    const result = await handleResponse<AuthResponse>(response);
    setAuthToken(result.token);
    return result;
  },

  // Sign in
  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await apiFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await handleResponse<AuthResponse>(response);
    setAuthToken(result.token);
    return result;
  },

  // Verify token
  async verifyToken(): Promise<{ user: User }> {
    const response = await apiFetch('/auth/verify');
    return handleResponse<{ user: User }>(response);
  },

  // Sign out
  signOut(): void {
    removeAuthToken();
  }
}; 