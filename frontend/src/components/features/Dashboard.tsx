import React from 'react';
import { TrendingUp, Users, Calendar, Star, Trophy, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { SectionParallax } from '../ui/ParallaxBackground';

interface DashboardProps {
  onViewChange: (view: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange }) => {
  const { state } = useApp();

  if (!state.currentUser) return null;

  const mySwaps = state.swapRequests.filter(request => 
    request.requesterId === state.currentUser?.id || request.receiverId === state.currentUser?.id
  );

  const pendingSwaps = mySwaps.filter(swap => swap.status === 'pending');
  const activeSwaps = mySwaps.filter(swap => swap.status === 'accepted');
  const completedSwaps = mySwaps.filter(swap => swap.status === 'completed');
  const unreadMessages = state.messages.filter(m => !m.isRead && m.receiverId === state.currentUser?.id);

  const recentSwaps = mySwaps
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const stats = [
    {
      title: 'Pending Requests',
      value: pendingSwaps.length,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900',
      action: () => onViewChange('swaps')
    },
    {
      title: 'Active Swaps',
      value: activeSwaps.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      action: () => onViewChange('swaps')
    },
    {
      title: 'Completed Swaps',
      value: state.currentUser.swapsCompleted,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900'
    },
    {
      title: 'Unread Messages',
      value: unreadMessages.length,
      icon: MessageCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      action: () => onViewChange('messages')
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'accepted': return 'primary';
      case 'completed': return 'success';
      case 'cancelled':
      case 'rejected': return 'error';
      default: return 'gray';
    }
  };

  const getSwapPartner = (swap: any) => {
    const isRequester = swap.requesterId === state.currentUser?.id;
    return state.users.find(user => 
      user.id === (isRequester ? swap.receiverId : swap.requesterId)
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section with Parallax */}
      <SectionParallax>
        <Card className="bg-gradient-to-r from-primary to-accent text-white overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold mb-2">
                  Welcome back, {state.currentUser.name}! 👋
                </h1>
                <p className="text-blue-100 mb-4">
                  Ready to learn something new or share your skills?
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Star className="text-yellow-300" size={16} />
                    <span>{state.currentUser.rating.toFixed(1)} rating</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Trophy className="text-yellow-300" size={16} />
                    <span>{state.currentUser.swapsCompleted} swaps completed</span>
                  </div>
                </div>
              </div>
              <div className="hidden sm:block">
                <Button variant="secondary" onClick={() => onViewChange('discover')}>
                  Discover Skills
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </SectionParallax>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              hover={!!stat.action}
              onClick={stat.action}
              className="cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon size={24} className={stat.color} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <Button variant="ghost" size="sm" onClick={() => onViewChange('swaps')}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentSwaps.length > 0 ? (
                recentSwaps.map((swap) => {
                  const partner = getSwapPartner(swap);
                  const isRequester = swap.requesterId === state.currentUser?.id;
                  
                  return (
                    <div
                      key={swap.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <img
                        src={partner?.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                        alt={partner?.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {isRequester ? `Proposed swap with ${partner?.name}` : `${partner?.name} proposed a swap`}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {swap.requesterSkill.name} ↔ {swap.receiverSkill.name}
                        </p>
                      </div>
                      <Badge variant={getStatusColor(swap.status)} size="sm">
                        {swap.status}
                      </Badge>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No recent activity
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Your Skills
              </h2>
              <Button variant="ghost" size="sm" onClick={() => onViewChange('profile')}>
                Manage
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Skills You Offer ({state.currentUser.skillsOffered.length})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {state.currentUser.skillsOffered.slice(0, 5).map((skill) => (
                    <Badge key={skill.id} variant="primary" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {state.currentUser.skillsOffered.length > 5 && (
                    <Badge variant="gray" size="sm">
                      +{state.currentUser.skillsOffered.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Skills You Want ({state.currentUser.skillsWanted.length})
                </h3>
                <div className="flex flex-wrap gap-1">
                  {state.currentUser.skillsWanted.slice(0, 5).map((skill) => (
                    <Badge key={skill.id} variant="secondary" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {state.currentUser.skillsWanted.length > 5 && (
                    <Badge variant="gray" size="sm">
                      +{state.currentUser.skillsWanted.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Button
              variant="primary"
              onClick={() => onViewChange('discover')}
              icon={Users}
              className="justify-start"
            >
              Find Skills to Learn
            </Button>
            <Button
              variant="secondary"
              onClick={() => onViewChange('profile')}
              icon={TrendingUp}
              className="justify-start"
            >
              Update Profile
            </Button>
            <Button
              variant="accent"
              onClick={() => onViewChange('messages')}
              icon={MessageCircle}
              className="justify-start"
            >
              Check Messages
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};