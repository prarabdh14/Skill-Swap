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

// Helper function to convert backend user data to frontend format
const formatUserData = (userData: any): User => ({
  ...userData,
  createdAt: new Date(userData.createdAt),
  badges: userData.badges?.map((badge: any) => ({
    ...badge,
    unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
  })) || []
});

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
    return {
      ...result,
      user: formatUserData(result.user)
    };
  },

  // Sign in
  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await apiFetch('/auth/signin', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    const result = await handleResponse<AuthResponse>(response);
    setAuthToken(result.token);
    return {
      ...result,
      user: formatUserData(result.user)
    };
  },

  // Verify token
  async verifyToken(): Promise<{ user: User }> {
    const response = await apiFetch('/auth/verify');
    const result = await handleResponse<{ user: User }>(response);
    return {
      user: formatUserData(result.user)
    };
  },

  // Sign out
  signOut(): void {
    removeAuthToken();
  }
}; 