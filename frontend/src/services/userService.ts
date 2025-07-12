import { apiFetch, handleResponse } from './api';
import { User } from '../types';

export interface UpdateUserData {
  name?: string;
  location?: string;
  profilePhoto?: string;
  availability?: string[];
  isPublic?: boolean;
}

export interface UpdateSkillsData {
  skillsOffered: string[];
  skillsWanted: string[];
}

export const userService = {
  // Update user profile
  async updateProfile(userId: string, data: UpdateUserData): Promise<{ message: string; user: User }> {
    const response = await apiFetch(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Update user skills
  async updateSkills(userId: string, data: UpdateSkillsData): Promise<{ message: string; user: User }> {
    const response = await apiFetch(`/users/${userId}/skills`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Get user by ID
  async getUser(userId: string): Promise<User> {
    const response = await apiFetch(`/users/${userId}`);
    return handleResponse<User>(response);
  },

  // Get all users
  async getUsers(filters?: {
    category?: string;
    level?: string;
    location?: string;
  }): Promise<User[]> {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.level) params.append('level', filters.level);
    if (filters?.location) params.append('location', filters.location);

    const response = await apiFetch(`/users${params.toString() ? `?${params.toString()}` : ''}`);
    return handleResponse<User[]>(response);
  }
}; 