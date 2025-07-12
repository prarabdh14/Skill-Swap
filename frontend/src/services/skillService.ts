import { apiFetch, handleResponse } from './api';
import { Skill } from '../types';

export interface CreateSkillData {
  name: string;
  category: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
}

export const skillService = {
  // Get all skills
  async getSkills(params?: { category?: string; level?: string; search?: string }): Promise<Skill[]> {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.level) queryParams.append('level', params.level);
    if (params?.search) queryParams.append('search', params.search);

    const endpoint = `/skills${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await apiFetch(endpoint);
    return handleResponse<Skill[]>(response);
  },

  // Get skill by ID
  async getSkill(id: string): Promise<Skill> {
    const response = await apiFetch(`/skills/${id}`);
    return handleResponse<Skill>(response);
  },

  // Create new skill (admin only)
  async createSkill(data: CreateSkillData): Promise<{ message: string; skill: Skill }> {
    const response = await apiFetch('/skills', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; skill: Skill }>(response);
  },

  // Create custom skill for user
  async createCustomSkill(data: CreateSkillData): Promise<{ message: string; skill: Skill }> {
    const response = await apiFetch('/skills/custom', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; skill: Skill }>(response);
  },

  // Get skill categories
  async getCategories(): Promise<string[]> {
    const response = await apiFetch('/skills/categories/list');
    return handleResponse<string[]>(response);
  }
}; 