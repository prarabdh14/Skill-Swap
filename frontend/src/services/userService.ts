import { apiFetch, handleResponse } from './api';
import { User, Skill } from '../types';

export interface UpdateUserData {
  name?: string;
  location?: string;
  profilePhoto?: string;
  availability?: string[];
  isPublic?: boolean;
}

export interface AddSkillData {
  skillId: string;
  isOffered: boolean;
}

export const userService = {
  // Get all users (for discovery)
  async getUsers(params?: { search?: string; category?: string; level?: string }): Promise<User[]> {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);

    const endpoint = `/users${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch(endpoint);
    return handleResponse<User[]>(response);
  },

  // Get user by ID
  async getUser(id: string): Promise<User> {
    const response = await apiFetch(`/users/${id}`);
    return handleResponse<User>(response);
  },

  // Update user profile
  async updateUser(id: string, data: UpdateUserData): Promise<{ message: string; user: User }> {
    const response = await apiFetch(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Add skill to user
  async addSkill(userId: string, data: AddSkillData): Promise<{ message: string; userSkill: any }> {
    const response = await apiFetch(`/users/${userId}/skills`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; userSkill: any }>(response);
  },

  // Remove skill from user
  async removeSkill(userId: string, skillId: string, isOffered: boolean): Promise<{ message: string }> {
    const response = await apiFetch(`/users/${userId}/skills/${skillId}?isOffered=${isOffered}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(response);
  }
}; 