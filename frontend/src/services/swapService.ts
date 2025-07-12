import { apiFetch, handleResponse } from './api';
import { SwapRequest, Rating } from '../types';

export interface CreateSwapData {
  requesterId: string;
  receiverId: string;
  requesterSkillId: string;
  receiverSkillId: string;
  message?: string;
  scheduledDate?: Date;
}

export interface UpdateSwapStatusData {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED';
}

export interface CreateRatingData {
  raterId: string;
  ratedUserId: string;
  rating: number;
  feedback?: string;
}

export const swapService = {
  // Get user's swaps
  async getUserSwaps(userId: string): Promise<SwapRequest[]> {
    const response = await apiFetch(`/swaps/user/${userId}`);
    return handleResponse<SwapRequest[]>(response);
  },

  // Create swap request
  async createSwap(data: CreateSwapData): Promise<{ message: string; swapRequest: SwapRequest }> {
    const response = await apiFetch('/swaps', {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; swapRequest: SwapRequest }>(response);
  },

  // Update swap status
  async updateSwapStatus(swapId: string, data: UpdateSwapStatusData): Promise<{ message: string; swapRequest: SwapRequest }> {
    const response = await apiFetch(`/swaps/${swapId}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; swapRequest: SwapRequest }>(response);
  },

  // Add rating to completed swap
  async addRating(swapId: string, data: CreateRatingData): Promise<{ message: string; rating: Rating }> {
    const response = await apiFetch(`/swaps/${swapId}/ratings`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return handleResponse<{ message: string; rating: Rating }>(response);
  }
}; 