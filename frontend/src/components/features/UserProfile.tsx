import React, { useState } from 'react';
import { Camera, MapPin, Calendar, Star, Trophy, Plus, Edit2, Save, X } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Modal } from '../ui/Modal';
import { Skill } from '../../types';
import { mockSkills } from '../../data/mockData';

export const UserProfile: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [skillType, setSkillType] = useState<'offered' | 'wanted'>('offered');
  const [editedUser, setEditedUser] = useState(state.currentUser);

  if (!state.currentUser) return null;

  const handleSave = () => {
    if (editedUser) {
      dispatch({ type: 'UPDATE_USER', payload: editedUser });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditedUser(state.currentUser);
    setIsEditing(false);
  };

  const addSkill = (skill: Skill) => {
    if (!editedUser) return;
    
    const updatedUser = {
      ...editedUser,
      [skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']: [
        ...editedUser[skillType === 'offered' ? 'skillsOffered' : 'skillsWanted'],
        skill
      ]
    };
    setEditedUser(updatedUser);
    setShowSkillModal(false);
  };

  const removeSkill = (skillId: string, type: 'offered' | 'wanted') => {
    if (!editedUser) return;
    
    const updatedUser = {
      ...editedUser,
      [type === 'offered' ? 'skillsOffered' : 'skillsWanted']: 
        editedUser[type === 'offered' ? 'skillsOffered' : 'skillsWanted'].filter(s => s.id !== skillId)
    };
    setEditedUser(updatedUser);
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

  const availableSkills = mockSkills.filter(skill => 
    !editedUser?.[skillType === 'offered' ? 'skillsOffered' : 'skillsWanted']?.some(s => s.id === skill.id)
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card className="overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary via-accent to-secondary"></div>
        <CardContent className="relative pt-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-end space-y-4 sm:space-y-0 sm:space-x-6 -mt-16">
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
                />
              )}
            </div>
            
            <div className="flex-1 space-y-2">
              {isEditing ? (
                <Input
                  value={editedUser?.name || ''}
                  onChange={(value) => setEditedUser(prev => prev ? { ...prev, name: value } : null)}
                  className="text-2xl font-bold"
                />
              ) : (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {state.currentUser.name}
                </h1>
              )}
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin size={16} />
                  {isEditing ? (
                    <Input
                      value={editedUser?.location || ''}
                      onChange={(value) => setEditedUser(prev => prev ? { ...prev, location: value } : null)}
                      placeholder="Add location"
                      className="w-40"
                    />
                  ) : (
                    <span>{state.currentUser.location || 'Location not set'}</span>
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar size={16} />
                  <span>Joined {state.currentUser.createdAt.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Star size={16} className="text-yellow-500" />
                  <span>{state.currentUser.rating.toFixed(1)} rating</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Trophy size={16} className="text-accent" />
                  <span>{state.currentUser.swapsCompleted} swaps completed</span>
                </div>
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
                disabled={!isEditing}
              >
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editedUser?.skillsOffered || []).map((skill) => (
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
                    />
                  )}
                </div>
              ))}
              {(editedUser?.skillsOffered || []).length === 0 && (
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
                disabled={!isEditing}
              >
                Add Skill
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(editedUser?.skillsWanted || []).map((skill) => (
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
                    />
                  )}
                </div>
              ))}
              {(editedUser?.skillsWanted || []).length === 0 && (
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
            {state.currentUser.badges.map((badge) => (
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
          </div>
        </CardContent>
      </Card>

      {/* Add Skill Modal */}
      <Modal
        isOpen={showSkillModal}
        onClose={() => setShowSkillModal(false)}
        title={`Add Skill ${skillType === 'offered' ? 'You Offer' : 'You Want to Learn'}`}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Choose a skill to add to your {skillType === 'offered' ? 'offered' : 'wanted'} skills:
          </p>
          <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
            {availableSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => addSkill(skill)}
                className="flex items-center justify-between p-3 text-left bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {skill.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {skill.category} • {skill.level}
                  </p>
                </div>
                <Plus size={16} className="text-primary" />
              </button>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};