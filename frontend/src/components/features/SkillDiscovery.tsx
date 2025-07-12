import React, { useState, useMemo, useEffect } from 'react';
import { Search, Filter, MapPin, Star, Clock, Users, Target, ArrowRight } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { User, SwapRequest } from '../../types';
import { userService } from '../../services/userService';

export const SkillDiscovery: React.FC = () => {
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [swapMessage, setSwapMessage] = useState('');
  const [matchType, setMatchType] = useState<'perfect' | 'partial' | 'all'>('perfect');
  const [isLoading, setIsLoading] = useState(false);

  const categories = ['Technical & Programming', 'Creative Arts', 'Music & Audio', 'Languages', 'Lifestyle & Wellness', 'Business & Professional', 'Crafts & DIY', 'Sports & Recreation', 'Academic & Education'];
  const levels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

  // Load users when component mounts
  useEffect(() => {
    if (state.users.length === 0) {
      setIsLoading(true);
      userService.getUsers()
        .then((users: User[]) => {
          dispatch({ type: 'SET_USERS', payload: users });
        })
        .catch(error => {
          console.error('Failed to load users:', error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [dispatch, state.users.length]);

  // Enhanced filtering logic with skill matching
  const filteredUsers = useMemo(() => {
    if (!state.currentUser) return [];

    const currentUser = state.currentUser;
    const currentUserSkillsOffered = currentUser.skillsOffered.map(s => s.name.toLowerCase());
    const currentUserSkillsWanted = currentUser.skillsWanted.map(s => s.name.toLowerCase());

    return state.users
      .filter(user => {
        if (user.id === currentUser.id || !user.isPublic || user.isBanned) return false;
        
        const userSkillsOffered = user.skillsOffered.map(s => s.name.toLowerCase());
        const userSkillsWanted = user.skillsWanted.map(s => s.name.toLowerCase());

        // Check for skill matches
        const perfectMatches = currentUserSkillsWanted.some(wanted => 
          userSkillsOffered.includes(wanted)
        ) && userSkillsWanted.some(wanted => 
          currentUserSkillsOffered.includes(wanted)
        );

        const partialMatches = currentUserSkillsWanted.some(wanted => 
          userSkillsOffered.includes(wanted)
        ) || userSkillsWanted.some(wanted => 
          currentUserSkillsOffered.includes(wanted)
        );

        // Apply match type filter
        if (matchType === 'perfect' && !perfectMatches) return false;
        if (matchType === 'partial' && !partialMatches) return false;

        // Apply search filter
        const matchesSearch = searchQuery === '' || 
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.skillsOffered.some(skill => 
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.category.toLowerCase().includes(searchQuery.toLowerCase())
          ) ||
          user.skillsWanted.some(skill => 
            skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            skill.category.toLowerCase().includes(searchQuery.toLowerCase())
          );
        
        // Apply category filter
        const matchesCategory = selectedCategory === '' ||
          user.skillsOffered.some(skill => skill.category === selectedCategory) ||
          user.skillsWanted.some(skill => skill.category === selectedCategory);
        
        // Apply level filter
        const matchesLevel = selectedLevel === '' ||
          user.skillsOffered.some(skill => skill.level === selectedLevel) ||
          user.skillsWanted.some(skill => skill.level === selectedLevel);
        
        return matchesSearch && matchesCategory && matchesLevel;
      })
      .map(user => {
        const userSkillsOffered = user.skillsOffered.map(s => s.name.toLowerCase());
        const userSkillsWanted = user.skillsWanted.map(s => s.name.toLowerCase());
        const currentUserSkillsOffered = currentUser.skillsOffered.map(s => s.name.toLowerCase());
        const currentUserSkillsWanted = currentUser.skillsWanted.map(s => s.name.toLowerCase());

        // Calculate match score and matching skills
        const matchingSkillsOffered = user.skillsOffered.filter(skill => 
          currentUserSkillsWanted.includes(skill.name.toLowerCase())
        );
        const matchingSkillsWanted = user.skillsWanted.filter(skill => 
          currentUserSkillsOffered.includes(skill.name.toLowerCase())
        );

        const perfectMatch = matchingSkillsOffered.length > 0 && matchingSkillsWanted.length > 0;
        const partialMatch = matchingSkillsOffered.length > 0 || matchingSkillsWanted.length > 0;

        return {
          ...user,
          matchScore: perfectMatch ? 3 : partialMatch ? 2 : 1,
          matchingSkillsOffered,
          matchingSkillsWanted,
          perfectMatch,
          partialMatch
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
  }, [state.users, state.currentUser, searchQuery, selectedCategory, selectedLevel, matchType]);

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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Match Type
                  </label>
                  <select
                    value={matchType}
                    onChange={(e) => setMatchType(e.target.value as 'perfect' | 'partial' | 'all')}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="perfect">Perfect Matches</option>
                    <option value="partial">Partial Matches</option>
                    <option value="all">All Users</option>
                  </select>
                </div>
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
        {isLoading ? (
          // Loading state
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden animate-pulse">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))
        ) : (
          filteredUsers.map((user) => (
          <Card key={user.id} hover className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <img
                  src={user.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {user.name}
                    </h3>
                    {user.perfectMatch && (
                      <Badge variant="success" size="sm">
                        <Target size={12} className="mr-1" />
                        Perfect Match
                      </Badge>
                    )}
                    {user.partialMatch && !user.perfectMatch && (
                      <Badge variant="secondary" size="sm">
                        <ArrowRight size={12} className="mr-1" />
                        Partial Match
                      </Badge>
                    )}
                  </div>
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

              {/* Matching Skills Section */}
              {(user.matchingSkillsOffered.length > 0 || user.matchingSkillsWanted.length > 0) && (
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
                  <h4 className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    Matching Skills
                  </h4>
                  {user.matchingSkillsOffered.length > 0 && (
                    <div className="mb-2">
                      <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                        Can teach you:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.matchingSkillsOffered.map((skill) => (
                          <Badge key={skill.id} variant="primary" size="sm">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {user.matchingSkillsWanted.length > 0 && (
                    <div>
                      <p className="text-xs text-green-700 dark:text-green-300 mb-1">
                        Wants to learn from you:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {user.matchingSkillsWanted.map((skill) => (
                          <Badge key={skill.id} variant="secondary" size="sm">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

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
                  Skills Wanted
                </h4>
                <div className="flex flex-wrap gap-1">
                  {user.skillsWanted.slice(0, 3).map((skill) => (
                    <Badge key={skill.id} variant="secondary" size="sm">
                      {skill.name}
                    </Badge>
                  ))}
                  {user.skillsWanted.length > 3 && (
                    <Badge variant="gray" size="sm">
                      +{user.skillsWanted.length - 3} more
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
        ))
        )}
      </div>

      {!isLoading && filteredUsers.length === 0 && (
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