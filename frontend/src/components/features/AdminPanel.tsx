import React, { useState } from 'react';
import { Users, AlertTriangle, BarChart3, MessageSquare, Download, Ban, UserCheck } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { AdminAnnouncement } from '../../types';

export const AdminPanel: React.FC = () => {
  const { state, dispatch } = useApp();
  const [selectedTab, setSelectedTab] = useState<'overview' | 'users' | 'swaps' | 'announcements'>('overview');
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState<'info' | 'warning' | 'success' | 'error'>('info');

  const totalUsers = state.users.length;
  const bannedUsers = state.users.filter(u => u.isBanned).length;
  const totalSwaps = state.swapRequests.length;
  const pendingSwaps = state.swapRequests.filter(s => s.status === 'pending').length;
  const completedSwaps = state.swapRequests.filter(s => s.status === 'completed').length;
  const activeAnnouncements = state.announcements.filter(a => a.isActive).length;

  const handleBanUser = (userId: string) => {
    dispatch({ type: 'BAN_USER', payload: userId });
  };

  const handleUnbanUser = (userId: string) => {
    dispatch({ type: 'UNBAN_USER', payload: userId });
  };

  const createAnnouncement = () => {
    if (!announcementTitle.trim() || !announcementMessage.trim()) return;

    const newAnnouncement: AdminAnnouncement = {
      id: Date.now().toString(),
      title: announcementTitle,
      message: announcementMessage,
      type: announcementType,
      createdAt: new Date(),
      isActive: true
    };

    dispatch({ type: 'ADD_ANNOUNCEMENT', payload: newAnnouncement });
    setShowAnnouncementModal(false);
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setAnnouncementType('info');
  };

  const toggleAnnouncement = (announcementId: string) => {
    dispatch({ type: 'TOGGLE_ANNOUNCEMENT', payload: announcementId });
  };

  const downloadReport = (type: string) => {
    // Simulate report download
    const data = {
      users: state.users,
      swaps: state.swapRequests,
      ratings: state.ratings,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skillswap-${type}-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { id: 'users' as const, label: 'Users', icon: Users },
    { id: 'swaps' as const, label: 'Swaps', icon: AlertTriangle },
    { id: 'announcements' as const, label: 'Announcements', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-purple-100">Monitor and manage the SkillSwap platform</p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardContent className="p-0">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors ${
                    selectedTab === tab.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Overview Tab */}
      {selectedTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <Users size={24} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalUsers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg">
                    <BarChart3 size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Swaps</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{totalSwaps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
                    <AlertTriangle size={24} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Pending Swaps</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{pendingSwaps}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                    <MessageSquare size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Active Announcements</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{activeAnnouncements}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Actions</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button
                  variant="primary"
                  icon={Download}
                  onClick={() => downloadReport('users')}
                  className="justify-start"
                >
                  Download User Report
                </Button>
                <Button
                  variant="secondary"
                  icon={Download}
                  onClick={() => downloadReport('swaps')}
                  className="justify-start"
                >
                  Download Swap Report
                </Button>
                <Button
                  variant="accent"
                  icon={MessageSquare}
                  onClick={() => setShowAnnouncementModal(true)}
                  className="justify-start"
                >
                  Create Announcement
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Users Tab */}
      {selectedTab === 'users' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">User Management</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.users.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={user.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {user.email} • {user.swapsCompleted} swaps
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        {user.isAdmin && <Badge variant="primary" size="sm">Admin</Badge>}
                        {user.isBanned && <Badge variant="error" size="sm">Banned</Badge>}
                        <Badge variant="gray" size="sm">
                          Joined {user.createdAt.toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {user.isBanned ? (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={UserCheck}
                        onClick={() => handleUnbanUser(user.id)}
                      >
                        Unban
                      </Button>
                    ) : (
                      <Button
                        variant="danger"
                        size="sm"
                        icon={Ban}
                        onClick={() => handleBanUser(user.id)}
                        disabled={user.isAdmin}
                      >
                        Ban
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Swaps Tab */}
      {selectedTab === 'swaps' && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Swap Management</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {state.swapRequests.map((swap) => {
                const requester = state.users.find(u => u.id === swap.requesterId);
                const receiver = state.users.find(u => u.id === swap.receiverId);
                
                return (
                  <div
                    key={swap.id}
                    className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900 dark:text-white">
                        {requester?.name} ↔ {receiver?.name}
                      </h3>
                      <Badge variant={
                        swap.status === 'pending' ? 'warning' :
                        swap.status === 'accepted' ? 'primary' :
                        swap.status === 'completed' ? 'success' : 'error'
                      } size="sm">
                        {swap.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {swap.requesterSkill.name} ↔ {swap.receiverSkill.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Created {swap.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Announcements Tab */}
      {selectedTab === 'announcements' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Platform Announcements
                </h2>
                <Button
                  variant="primary"
                  icon={MessageSquare}
                  onClick={() => setShowAnnouncementModal(true)}
                >
                  Create Announcement
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {state.announcements.map((announcement) => (
                  <div
                    key={announcement.id}
                    className={`p-4 rounded-lg border-l-4 ${
                      announcement.type === 'info' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' :
                      announcement.type === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                      announcement.type === 'success' ? 'border-green-500 bg-green-50 dark:bg-green-900/20' :
                      'border-red-500 bg-red-50 dark:bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          {announcement.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {announcement.message}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          Created {announcement.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={announcement.isActive ? 'success' : 'gray'} size="sm">
                          {announcement.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleAnnouncement(announcement.id)}
                        >
                          {announcement.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Announcement Modal */}
      <Modal
        isOpen={showAnnouncementModal}
        onClose={() => setShowAnnouncementModal(false)}
        title="Create Platform Announcement"
        size="md"
      >
        <div className="space-y-4">
          <Input
            label="Title"
            value={announcementTitle}
            onChange={setAnnouncementTitle}
            placeholder="Enter announcement title"
            required
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type
            </label>
            <select
              value={announcementType}
              onChange={(e) => setAnnouncementType(e.target.value as any)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            >
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Message
            </label>
            <textarea
              value={announcementMessage}
              onChange={(e) => setAnnouncementMessage(e.target.value)}
              placeholder="Enter announcement message"
              rows={4}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
          
          <div className="flex space-x-3">
            <Button variant="primary" onClick={createAnnouncement} className="flex-1">
              Create Announcement
            </Button>
            <Button variant="outline" onClick={() => setShowAnnouncementModal(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};