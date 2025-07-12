import { apiFetch, handleResponse } from './api';
import { Notification } from '../types';

export interface CreateNotificationData {
  userId: string;
  title: string;
  message: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'swap_completed' | 'message' | 'system';
  relatedId?: string;
}

export const notificationService = {
  // Get user's notifications
  async getUserNotifications(userId: string): Promise<Notification[]> {
    const response = await apiFetch(`/notifications/user/${userId}`);
    return handleResponse<Notification[]>(response);
  },

  // Create notification
  async createNotification(data: CreateNotificationData): Promise<{ message: string; notification: Notification }> {
    const response = await apiFetch('/notifications', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; notification: Notification }>(response);
  },

  // Mark notification as read
  async markAsRead(notificationId: string): Promise<{ message: string; notification: Notification }> {
    const response = await apiFetch(`/notifications/${notificationId}/read`, {
      method: 'PUT'
    });
    return handleResponse<{ message: string; notification: Notification }>(response);
  },

  // Mark all notifications as read
  async markAllAsRead(userId: string): Promise<{ message: string }> {
    const response = await apiFetch(`/notifications/user/${userId}/read-all`, {
      method: 'PUT'
    });
    return handleResponse<{ message: string }>(response);
  },

  // Delete notification
  async deleteNotification(notificationId: string): Promise<{ message: string }> {
    const response = await apiFetch(`/notifications/${notificationId}`, {
      method: 'DELETE'
    });
    return handleResponse<{ message: string }>(response);
  }
}; 