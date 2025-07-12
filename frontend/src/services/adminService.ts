import { apiFetch, handleResponse } from './api';
import { User, AdminAnnouncement } from '../types';

export interface BanUserData {
  isBanned: boolean;
}

export interface AdminUserData {
  isAdmin: boolean;
}

export interface CreateAnnouncementData {
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
}

export interface UpdateAnnouncementData {
  title?: string;
  message?: string;
  type?: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  isActive?: boolean;
}

export interface PlatformStats {
  totalUsers: number;
  totalSwaps: number;
  completedSwaps: number;
  totalSkills: number;
  totalMessages: number;
  completionRate: string;
}

export const adminService = {
  // Get all users (admin only)
  async getAllUsers(): Promise<User[]> {
    const response = await apiFetch('/admin/users');
    return handleResponse<User[]>(response);
  },

  // Ban/unban user
  async banUser(userId: string, data: BanUserData): Promise<{ message: string; user: User }> {
    const response = await apiFetch(`/admin/users/${userId}/ban`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Make user admin
  async makeUserAdmin(userId: string, data: AdminUserData): Promise<{ message: string; user: User }> {
    const response = await apiFetch(`/admin/users/${userId}/admin`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; user: User }>(response);
  },

  // Get all announcements
  async getAnnouncements(): Promise<AdminAnnouncement[]> {
    const response = await apiFetch('/admin/announcements');
    return handleResponse<AdminAnnouncement[]>(response);
  },

  // Create announcement
  async createAnnouncement(data: CreateAnnouncementData): Promise<{ message: string; announcement: AdminAnnouncement }> {
    const response = await apiFetch('/admin/announcements', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; announcement: AdminAnnouncement }>(response);
  },

  // Update announcement
  async updateAnnouncement(id: string, data: UpdateAnnouncementData): Promise<{ message: string; announcement: AdminAnnouncement }> {
    const response = await apiFetch(`/admin/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; announcement: AdminAnnouncement }>(response);
  },

  // Delete announcement
  async deleteAnnouncement(id: string): Promise<{ message: string }> {
    const response = await apiFetch(`/admin/announcements/${id}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(response);
  },

  // Get platform statistics
  async getStats(): Promise<PlatformStats> {
    const response = await apiFetch('/admin/stats');
    return handleResponse<PlatformStats>(response);
  }
}; 