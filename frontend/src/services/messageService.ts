import { apiFetch, handleResponse } from './api';
import { Message } from '../types';

export interface SendMessageData {
  senderId: string;
  receiverId: string;
  content: string;
}

export interface MarkReadData {
  userId: string;
  senderId: string;
}

export interface Conversation {
  userId: string;
  user: {
    id: string;
    name: string;
    profilePhoto?: string;
  };
  lastMessage: Message;
  unreadCount: number;
}

export const messageService = {
  // Get conversation between two users
  async getConversation(userId1: string, userId2: string): Promise<Message[]> {
    const response = await apiFetch(`/messages/conversation/${userId1}/${userId2}`);
    return handleResponse<Message[]>(response);
  },

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    const response = await apiFetch(`/messages/user/${userId}`);
    return handleResponse<Conversation[]>(response);
  },

  // Send message
  async sendMessage(data: SendMessageData): Promise<{ message: string; data: Message }> {
    const response = await apiFetch('/messages', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; data: Message }>(response);
  },

  // Mark messages as read
  async markMessagesRead(data: MarkReadData): Promise<{ message: string }> {
    const response = await apiFetch('/messages/read', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string }>(response);
  }
}; 