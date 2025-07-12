import React, { useState, useMemo } from 'react';
import { Search, Filter, MapPin, Star, Clock, Users } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { User, SwapRequest } from '../../types';

export const SkillDiscovery: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [swapMessage, setSwapMessage] = useState('');

  const categories = ['Programming', 'Music', 'Language', 'Creative', 'Lifestyle', 'Fitness'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  const filteredUsers = useMemo(() => {
    return state.users.filter(user => {
      if (user.id === state.currentUser?.id || !user.isPublic || user.isBanned) return false;
      
      const matchesSearch = searchQuery === '' || 
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.skillsOffered.some(skill => 
          skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          skill.category.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === '' ||
        user.skillsOffered.some(skill => skill.category === selectedCategory);
      
      const matchesLevel = selectedLevel === '' ||
        user.skillsOffered.some(skill => skill.level === selectedLevel);
      
      return matchesSearch && matchesCategory && matchesLevel;
    });
  }, [state.users, state.currentUser, searchQuery, selectedCategory, selectedLevel]);

  const initiateSwap = (user: User) => {
    setSelectedUser(user);
    setShowSwapModal(true);
  };

  const sendSwapRequest = (offeredSkillId: string, wantedSkillId: string) => {
    if (!state.currentUser || !selectedUser) return;

    const offeredSkill = state.currentUser.skillsOffered.find(s => s.id === offeredSkillId);
    const wantedSkill = selectedUser.skillsOffered.find(s => s.id === wantedSkillId);

    if (!offeredSkill || !wantedSkill) return;

    const newRequest: SwapRequest = {
      id: Date.now().toString(),
      requesterId: state.currentUser.id,
      receiverId: selectedUser.id,
      requesterSkill: offeredSkill,
      receiverSkill: wantedSkill,
      status: 'pending',
      message: swapMessage,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    dispatch({ type: 'ADD_SWAP_REQUEST', payload: newRequest });
    setShowSwapModal(false);
    setSelectedUser(null);
    setSwapMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search skills or users..."
                value={searchQuery}
                onChange={setSearchQuery}
                icon={Search}
              />
            </div>
            <Button
              variant="outline"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
          </div>

          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 animate-in slide-in-from-top-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Level
                  </label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Levels</option>
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} hover className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {user.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                    <MapPin size={12} />
                    <span>{user.location || 'Location not set'}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-1">
                  <Star size={14} className="text-yellow-500" />
                  <span>{user.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users size={14} />
                  <span>{user.swapsCompleted} swaps</span>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Skills Offered
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsOffered.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="primary" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {user.skillsOffered.length > 3 && (
                    <Badge variant="gray" size="sm">
                      +{user.skillsOffered.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                  Availability
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.availability.map((time) => (
                    <Badge key={time} variant="secondary" size="sm">
                      <Clock size={12} className="mr-1" />
                      {time}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => initiateSwap(user)}
                className="w-full"
                disabled={!state.currentUser?.skillsOffered.length}
              >
                Propose Skill Swap
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="text-gray-400 mb-4">
              <Users size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No users found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search criteria or filters
            </p>
          </CardContent>
        </Card>
      )}

      {/* Swap Modal */}
      <Modal
        isOpen={showSwapModal}
        onClose={() => setShowSwapModal(false)}
        title={`Propose Skill Swap with ${selectedUser?.name}`}
        size="lg"
      >
        {selectedUser && state.currentUser && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Your Skills
                </h3>
                <div className="space-y-2">
                  {state.currentUser.skillsOffered.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-primary cursor-pointer transition-colors"
                      onClick={() => {
                        const wantedSkillId = selectedUser.skillsOffered[0]?.id;
                        if (wantedSkillId) {
                          sendSwapRequest(skill.id, wantedSkillId);
                        }
                      }}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.category} • {skill.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  {selectedUser.name}'s Skills
                </h3>
                <div className="space-y-2">
                  {selectedUser.skillsOffered.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-accent cursor-pointer transition-colors"
                      onClick={() => {
                        const offeredSkillId = state.currentUser?.skillsOffered[0]?.id;
                        if (offeredSkillId) {
                          sendSwapRequest(offeredSkillId, skill.id);
                        }
                      }}
                    >
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        {skill.name}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {skill.category} • {skill.level}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={swapMessage}
                onChange={(e) => setSwapMessage(e.target.value)}
                placeholder="Add a message to your swap request..."
                rows={3}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
              />
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click on a skill from each column to create a swap proposal.
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};