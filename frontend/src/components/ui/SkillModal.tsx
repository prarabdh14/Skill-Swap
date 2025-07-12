import React, { useState } from 'react';
import { Plus, Search, X, BookOpen, Sparkles } from 'lucide-react';
import { Modal } from './Modal';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { Skill } from '../../types';
import { skillCategories, SkillCategory } from '../../data/skillCategories';
import { skillService } from '../../services/skillService';

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSkill: (skill: Skill) => void;
  skillType: 'offered' | 'wanted';
  existingSkills: Skill[];
}

export const SkillModal: React.FC<SkillModalProps> = ({
  isOpen,
  onClose,
  onAddSkill,
  skillType,
  existingSkills
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customSkill, setCustomSkill] = useState({
    name: '',
    category: '',
    level: 'Beginner' as const,
    description: ''
  });

  // Filter available skills based on existing skills and search
  const availableSkills = skillCategories.flatMap(category => 
    category.skills.filter(skill => 
      !existingSkills.some(existing => existing.id === skill.id) &&
      (selectedCategory === 'all' || category.id === selectedCategory) &&
      (searchQuery === '' || 
        skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        skill.description?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  );

  const handleAddCustomSkill = async () => {
    if (customSkill.name.trim() && customSkill.category.trim()) {
      try {
        const { skill } = await skillService.createCustomSkill({
          name: customSkill.name.trim(),
          category: customSkill.category.trim(),
          level: customSkill.level.toUpperCase() as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT',
          description: customSkill.description.trim() || undefined
        });
        
        onAddSkill(skill);
        setCustomSkill({ name: '', category: '', level: 'Beginner', description: '' });
        setShowCustomForm(false);
      } catch (error) {
        console.error('Error creating custom skill:', error);
        // Fallback to local skill if backend fails
        const newSkill: Skill = {
          id: `custom-${Date.now()}`,
          name: customSkill.name.trim(),
          category: customSkill.category.trim(),
          level: customSkill.level,
          description: customSkill.description.trim() || undefined
        };
        onAddSkill(newSkill);
        setCustomSkill({ name: '', category: '', level: 'Beginner', description: '' });
        setShowCustomForm(false);
      }
    }
  };

  const handleAddPredefinedSkill = (skill: Skill) => {
    onAddSkill(skill);
  };

  const getCategoryIcon = (categoryId: string) => {
    const category = skillCategories.find(cat => cat.id === categoryId);
    return category?.icon || '📋';
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'text-green-600 bg-green-100 dark:bg-green-900';
      case 'Intermediate': return 'text-blue-600 bg-blue-100 dark:bg-blue-900';
      case 'Advanced': return 'text-purple-600 bg-purple-100 dark:bg-purple-900';
      case 'Expert': return 'text-red-600 bg-red-100 dark:bg-red-900';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Add Skill ${skillType === 'offered' ? 'You Offer' : 'You Want to Learn'}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Search and Filter */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search skills..."
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === 'all' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              All Categories
            </Button>
            {skillCategories.map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Custom Skill Button */}
        <div className="flex justify-center">
          <Button
            variant="accent"
            onClick={() => setShowCustomForm(true)}
            icon={Sparkles}
            className="w-full max-w-md"
          >
            Add Custom Skill
          </Button>
        </div>

        {/* Custom Skill Form */}
        {showCustomForm && (
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Create Custom Skill
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCustomForm(false)}
                icon={X}
              >
                <X size={16} />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                value={customSkill.name}
                onChange={(value) => setCustomSkill(prev => ({ ...prev, name: value }))}
                placeholder="Skill name"
                label="Skill Name"
              />
              <Input
                value={customSkill.category}
                onChange={(value) => setCustomSkill(prev => ({ ...prev, category: value }))}
                placeholder="Category"
                label="Category"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Level
                </label>
                <select
                  value={customSkill.level}
                  onChange={(e) => setCustomSkill(prev => ({ ...prev, level: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Expert">Expert</option>
                </select>
              </div>
              <Input
                value={customSkill.description}
                onChange={(value) => setCustomSkill(prev => ({ ...prev, description: value }))}
                placeholder="Description (optional)"
                label="Description"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCustomForm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAddCustomSkill}
                disabled={!customSkill.name.trim() || !customSkill.category.trim()}
              >
                Add Skill
              </Button>
            </div>
          </div>
        )}

        {/* Predefined Skills */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Predefined Skills
            </h3>
            <Badge variant="gray" size="sm">
              {availableSkills.length} available
            </Badge>
          </div>

          {availableSkills.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
              <p>No skills found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
              {availableSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-primary dark:hover:border-primary transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getCategoryIcon(skillCategories.find(cat => cat.skills.some(s => s.id === skill.id))?.id || '')}</span>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {skill.name}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {skill.category}
                        </p>
                        {skill.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {skill.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge 
                      variant="gray" 
                      size="sm" 
                      className={getLevelColor(skill.level)}
                    >
                      {skill.level}
                    </Badge>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleAddPredefinedSkill(skill)}
                      icon={Plus}
                    >
                      <Plus size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}; 