export interface User {
  id: string;
  name: string;
  email: string;
  location?: string;
  profilePhoto?: string;
  skillsOffered: Skill[];
  skillsWanted: Skill[];
  availability: string[];
  isPublic: boolean;
  rating: number;
  swapsCompleted: number;
  badges: Badge[];
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: Date;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description?: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  receiverId: string;
  requesterSkill: Skill;
  receiverSkill: Skill;
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled';
  message?: string;
  scheduledDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Rating {
  id: string;
  swapId: string;
  raterId: string;
  ratedUserId: string;
  rating: number;
  feedback?: string;
  createdAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: Date;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'swap_request' | 'swap_accepted' | 'swap_rejected' | 'swap_completed' | 'message' | 'system';
  isRead: boolean;
  createdAt: Date;
  relatedId?: string; // ID of related swap, message, etc.
}

export interface AdminAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  createdAt: Date;
  isActive: boolean;
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppState {
  currentUser: User | null;
  users: User[];
  swapRequests: SwapRequest[];
  ratings: Rating[];
  messages: Message[];
  notifications: Notification[];
  announcements: AdminAnnouncement[];
  theme: Theme;
}