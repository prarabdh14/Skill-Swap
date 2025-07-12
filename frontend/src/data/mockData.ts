import { User, SwapRequest, Rating, Message, AdminAnnouncement, Skill, Badge } from '../types';
import { allSkills } from './skillCategories';

export const mockSkills: Skill[] = allSkills;

export const mockBadges: Badge[] = [
  { id: '1', name: 'First Swap', description: 'Completed your first skill swap', icon: '🎯', rarity: 'common' },
  { id: '2', name: 'Master Teacher', description: 'Taught 10 different skills', icon: '🎓', rarity: 'rare' },
  { id: '3', name: 'Community Star', description: 'Received 50+ 5-star ratings', icon: '⭐', rarity: 'epic' },
  { id: '4', name: 'Pioneer', description: 'One of the first 100 users', icon: '🚀', rarity: 'legendary' }
];

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Alex Chen',
    email: 'alex@example.com',
    location: 'San Francisco, CA',
    profilePhoto: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: [mockSkills[0], mockSkills[1]],
    skillsWanted: [mockSkills[2], mockSkills[3]],
    availability: ['weekends', 'evenings'],
    isPublic: true,
    rating: 4.8,
    swapsCompleted: 12,
    badges: [mockBadges[0], mockBadges[1]],
    isAdmin: true,
    isBanned: false,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Maria Rodriguez',
    email: 'maria@example.com',
    location: 'Austin, TX',
    profilePhoto: 'https://images.pexels.com/photos/3796217/pexels-photo-3796217.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: [mockSkills[2], mockSkills[5]],
    skillsWanted: [mockSkills[4], mockSkills[6]],
    availability: ['weekdays', 'mornings'],
    isPublic: true,
    rating: 4.9,
    swapsCompleted: 18,
    badges: [mockBadges[0], mockBadges[2]],
    isAdmin: false,
    isBanned: false,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'David Kim',
    email: 'david@example.com',
    location: 'New York, NY',
    profilePhoto: 'https://images.pexels.com/photos/3778966/pexels-photo-3778966.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: [mockSkills[4], mockSkills[7]],
    skillsWanted: [mockSkills[0], mockSkills[5]],
    availability: ['evenings', 'weekends'],
    isPublic: true,
    rating: 4.7,
    swapsCompleted: 8,
    badges: [mockBadges[0]],
    isAdmin: false,
    isBanned: false,
    createdAt: new Date('2024-02-10')
  },
  {
    id: '4',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    location: 'Seattle, WA',
    profilePhoto: 'https://images.pexels.com/photos/4307869/pexels-photo-4307869.jpeg?auto=compress&cs=tinysrgb&w=400',
    skillsOffered: [mockSkills[6], mockSkills[3]],
    skillsWanted: [mockSkills[1], mockSkills[7]],
    availability: ['weekends'],
    isPublic: false,
    rating: 4.6,
    swapsCompleted: 5,
    badges: [mockBadges[0]],
    isAdmin: false,
    isBanned: false,
    createdAt: new Date('2024-02-15')
  }
];

export const mockSwapRequests: SwapRequest[] = [
  {
    id: '1',
    requesterId: '2',
    receiverId: '1',
    requesterSkill: mockSkills[2],
    receiverSkill: mockSkills[0],
    status: 'pending',
    message: 'Hi! I\'d love to trade guitar lessons for JavaScript help.',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01')
  },
  {
    id: '2',
    requesterId: '3',
    receiverId: '2',
    requesterSkill: mockSkills[4],
    receiverSkill: mockSkills[5],
    status: 'accepted',
    message: 'Photography for cooking sounds great!',
    scheduledDate: new Date('2024-12-10'),
    createdAt: new Date('2024-11-28'),
    updatedAt: new Date('2024-11-29')
  },
  {
    id: '3',
    requesterId: '1',
    receiverId: '4',
    requesterSkill: mockSkills[1],
    receiverSkill: mockSkills[6],
    status: 'completed',
    message: 'React tutoring for Python lessons',
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-25')
  }
];

export const mockRatings: Rating[] = [
  {
    id: '1',
    swapId: '3',
    raterId: '1',
    ratedUserId: '4',
    rating: 5,
    feedback: 'Amazing Python teacher! Very patient and knowledgeable.',
    createdAt: new Date('2024-11-26')
  },
  {
    id: '2',
    swapId: '3',
    raterId: '4',
    ratedUserId: '1',
    rating: 5,
    feedback: 'Excellent React instructor. Clear explanations and great examples.',
    createdAt: new Date('2024-11-26')
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    senderId: '2',
    receiverId: '1',
    content: 'Hey Alex! Are you available this weekend for the guitar lesson?',
    timestamp: new Date('2024-12-01T10:30:00'),
    isRead: false
  },
  {
    id: '2',
    senderId: '1',
    receiverId: '2',
    content: 'Hi Maria! Yes, Saturday afternoon works great for me. How about 2 PM?',
    timestamp: new Date('2024-12-01T11:15:00'),
    isRead: true
  }
];

export const mockAnnouncements: AdminAnnouncement[] = [
  {
    id: '1',
    title: 'Welcome to SkillSwap 2.0!',
    message: 'We\'ve added new features including real-time chat and gamification!',
    type: 'success',
    createdAt: new Date('2024-12-01'),
    isActive: true
  },
  {
    id: '2',
    title: 'Scheduled Maintenance',
    message: 'The platform will be down for maintenance on December 15th from 2-4 AM PST.',
    type: 'warning',
    createdAt: new Date('2024-11-30'),
    isActive: true
  }
];