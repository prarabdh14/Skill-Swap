import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Star, Trophy, Plus, Edit2, Save, X, Mail, Phone, Globe } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { SkillModal } from '../ui/SkillModal';
import { Skill } from '../../types';
import { userService } from '../../services/userService';
import { ThreeDProfileCard } from './ThreeDProfileCard';

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');
  const [editedUser, setEditedUser] = useState(state.currentUser);

  // Add error handling for missing user data
  if (!state.currentUser) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-600 dark:text-gray-400">
              Loading user profile...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Ensure we have the required user data
  const user = state.currentUser;
  const skillsOffered = user.skillsOffered || [];
  const skillsWanted = user.skillsWanted || [];
  const badges = user.badges || [];
  const createdAt = user.createdAt instanceof Date ? user.createdAt : new Date(user.createdAt);

  const handleSave = async () => {
    if (editedUser) {
      try {
        // Update user profile data only (skills are saved immediately)
        const { user: updatedUser } = await userService.updateProfile(editedUser.id, {
          name: editedUser.name,
          location: editedUser.location,
          profilePhoto: editedUser.profilePhoto,
          availability: editedUser.availability,
          isPublic: editedUser.isPublic
        });

        // Update the user data with the response from the backend
        const formattedUser = {
          ...updatedUser,
          createdAt: new Date(updatedUser.createdAt),
          badges: updatedUser.badges?.map((badge: any) => ({
            ...badge,
            unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
          })) || []
        };

        dispatch({ type: 'UPDATE_USER', payload: formattedUser });
        setIsEditing(false);
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  };

  const handleCancel = () => {
    setEditedUser(state.currentUser);
    setIsEditing(false);
  };

  const addSkill = async (skill: Skill) => {
    if (!editedUser) return;
    
    try {
      // Add skill to local state immediately for UI responsiveness
      const updatedUser = {
        ...editedUser,
        [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
          ...editedUser[skillType === 'offered' ? 'skillsOffered' : 'skillsWanted'],
          skill
        ]
      };
      setEditedUser(updatedUser);
      
      // Save to backend immediately
      const { user: savedUser } = await userService.updateSkills(editedUser.id, {
        skillsOffered: updatedUser.skillsOffered.map(skill => skill.id),
        skillsWanted: updatedUser.skillsWanted.map(skill => skill.id)
      });

      // Update global state with the response from backend
      const formattedUser = {
        ...savedUser,
        createdAt: new Date(savedUser.createdAt),
        badges: savedUser.badges?.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
        })) || []
      };

      dispatch({ type: 'UPDATE_USER', payload: formattedUser });
      
      // Update local state with the formatted user data
      setEditedUser(formattedUser);
      
      setShowSkillModal(false);
    } catch (error) {
      console.error('Error adding skill:', error);
      // Revert local state if backend save failed
      setEditedUser(state.currentUser);
    }
  };

  const removeSkill = async (skillId: string, type: 'offered' | 'wanted') => {
    if (!editedUser) return;
    
    try {
      // Remove skill from local state immediately for UI responsiveness
      const updatedUser = {
        ...editedUser,
        [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: 
          editedUser[type === 'offered' ? 'skillsOffered' : 'skillsWanted'].filter(s => s.id !== skillId)
      };
      setEditedUser(updatedUser);
      
      // Save to backend immediately
      const { user: savedUser } = await userService.updateSkills(editedUser.id, {
        skillsOffered: updatedUser.skillsOffered.map(skill => skill.id),
        skillsWanted: updatedUser.skillsWanted.map(skill => skill.id)
      });

      // Update global state with the response from backend
      const formattedUser = {
        ...savedUser,
        createdAt: new Date(savedUser.createdAt),
        badges: savedUser.badges?.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined
        })) || []
      };

      dispatch({ type: 'UPDATE_USER', payload: formattedUser });
      
      // Update local state with the formatted user data
      setEditedUser(formattedUser);
    } catch (error) {
      console.error('Error removing skill:', error);
      // Revert local state if backend save failed
      setEditedUser(state.currentUser);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-600';
      case 'rare': return 'text-blue-600';
      case 'epic': return 'text-purple-600';
      case 'legendary': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  // Get current skills for the selected type
  const currentSkills = skillType === 'offered' 
    ? (editedUser?.skillsOffered || skillsOffered)
    : (editedUser?.skillsWanted || skillsWanted);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* 3D Profile Card */}
      <div className="h-96">
        <ThreeDProfileCard
          front={
            <Card className="h-full overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-primary via-accent to-secondary"></div>
              <CardContent className="relative pt-0 h-full">
                <div className="flex flex-col items-center text-center space-y-4 -mt-16">
                  <div className="relative">
                    <img
                      src={editedUser?.profilePhoto || 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400'}
                      alt={editedUser?.name}
                      className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg object-cover"
                    />
                    {isEditing && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Camera}
                        className="absolute bottom-2 right-2 rounded-full w-8 h-8 p-0"
                      >
                        <Camera size={16} />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {isEditing ? (
                      <Input
                        value={editedUser?.name || ''}
                        onChange={(value) => setEditedUser(prev => prev ? { ...prev, name: value } : null)}
                        className="text-2xl font-bold text-center"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {user.name}
                      </h1>
                    )}
                    
                    <div className="flex items-center justify-center space-x-1 text-gray-600 dark:text-gray-400">
                      <MapPin size={16} />
                      {isEditing ? (
                        <Input
                          value={editedUser?.location || ''}
                          onChange={(value) => setEditedUser(prev => prev ? { ...prev, location: value } : null)}
                          placeholder="Add location"
                          className="w-40"
                        />
                      ) : (
                        <span>{user.location || 'Location not set'}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="primary" onClick={handleSave} icon={Save}>
                          Save
                        </Button>
                        <Button variant="outline" onClick={handleCancel} icon={X}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" onClick={() => setIsEditing(true)} icon={Edit2}>
                        Edit Profile
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          }
          back={
            <Card className="h-full bg-gradient-to-br from-light to-accent">
              <CardContent className="h-full flex flex-col justify-center space-y-6 p-8">
                <div className="text-center space-y-4">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {user.name}
                  </h2>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-500" />
                      <span>{user.rating.toFixed(1)} rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy size={16} className="text-accent" />
                      <span>{user.swapsCompleted} swaps</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar size={16} />
                      <span>Joined {createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin size={16} />
                      <span>{user.location || 'Location not set'}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Top Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {skillsOffered.slice(0, 4).map((skill) => (
                      <Badge key={skill.id} variant="primary" size="sm">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">Contact</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center space-x-2">
                        <Phone size={14} />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center space-x-2">
                        <Globe size={14} />
                        <span>{user.website}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          }
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Skills Offered */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Skills I Offer
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setSkillType('offered');
                  setShowSkillModal(true);
                }}
              >
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editedUser?.skillsOffered || skillsOffered).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.category} • {skill.level}
                    </p>
                    {skill.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={() => removeSkill(skill.id, 'offered')}
                      className="text-error hover:bg-error/10"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              {(editedUser?.skillsOffered || skillsOffered).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No skills offered yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Skills Wanted */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Skills I Want to Learn
              </h2>
              <Button
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={() => {
                  setSkillType('wanted');
                  setShowSkillModal(true);
                }}
              >
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editedUser?.skillsWanted || skillsWanted).map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                >
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {skill.category} • {skill.level}
                    </p>
                    {skill.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {skill.description}
                      </p>
                    )}
                  </div>
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={X}
                      onClick={() => removeSkill(skill.id, 'wanted')}
                      className="text-error hover:bg-error/10"
                    >
                      <X size={16} />
                    </Button>
                  )}
                </div>
              ))}
              {(editedUser?.skillsWanted || skillsWanted).length === 0 && (
                <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                  No skills wanted yet
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Badges */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Achievements
          </h2>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className="flex items-center space-x-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 rounded-lg"
              >
                <div className="text-2xl">{badge.icon}</div>
                <div>
                  <h3 className={`font-medium ${getRarityColor(badge.rarity)}`}>
                    {badge.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {badge.description}
                  </p>
                  <Badge variant="gray" size="sm" className="mt-1">
                    {badge.rarity}
                  </Badge>
                </div>
              </div>
            ))}
            {badges.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4 col-span-full">
                No achievements yet
              </p>
            )}
          </div>
        </CardContent>
      </Card>

              {/* Add Skill Modal */}
        <SkillModal
          isOpen={showSkillModal}
          onClose={() => setShowSkillModal(false)}
          onAddSkill={(skill) => addSkill(skill)}
          skillType={skillType}
          existingSkills={currentSkills}
        />
    </div>
  );
};