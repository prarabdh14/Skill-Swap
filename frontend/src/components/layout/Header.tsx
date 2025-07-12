import React, { useState } from 'react';
import { Search, Bell, MessageCircle, User, Moon, Sun, Monitor, Menu, X } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

interface HeaderProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const { theme, setTheme, actualTheme } = useTheme();
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const unreadMessages = state.messages.filter(m => !m.isRead && m.receiverId === state.currentUser?.id).length;
  const pendingSwaps = state.swapRequests.filter(r => r.receiverId === state.currentUser?.id && r.status === 'pending').length;

  const themeIcons = {
    light: Sun,
    dark: Moon,
    system: Monitor
  };

  const ThemeIcon = themeIcons[theme];

  const navigation = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'discover', label: 'Discover' },
    { id: 'swaps', label: 'My Swaps' },
    { id: 'messages', label: 'Messages' },
    { id: 'profile', label: 'Profile' }
  ];

  if (state.currentUser?.isAdmin) {
    navigation.push({ id: 'admin', label: 'Admin' });
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                SkillSwap
              </h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-1">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => onViewChange(item.id)}
                  className="relative"
                >
                  {item.label}
                  {item.id === 'messages' && unreadMessages > 0 && (
                    <Badge variant="error" size="sm" className="absolute -top-2 -right-2 min-w-[20px] h-5">
                      {unreadMessages}
                    </Badge>
                  )}
                  {item.id === 'swaps' && pendingSwaps > 0 && (
                    <Badge variant="warning" size="sm" className="absolute -top-2 -right-2 min-w-[20px] h-5">
                      {pendingSwaps}
                    </Badge>
                  )}
                </Button>
              ))}
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden sm:block flex-1 max-w-md mx-8">
            <Input
              placeholder="Search skills, users..."
              value={searchQuery}
              onChange={setSearchQuery}
              icon={Search}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Notifications */}
            <Button variant="ghost" size="sm" icon={Bell} className="relative">
              {(unreadMessages + pendingSwaps) > 0 && (
                <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[18px] h-4">
                  {unreadMessages + pendingSwaps}
                </Badge>
              )}
            </Button>

            {/* Messages */}
            <Button 
              variant="ghost" 
              size="sm" 
              icon={MessageCircle} 
              onClick={() => onViewChange('messages')}
              className="relative hidden sm:flex"
            >
              {unreadMessages > 0 && (
                <Badge variant="error" size="sm" className="absolute -top-1 -right-1 min-w-[18px] h-4">
                  {unreadMessages}
                </Badge>
              )}
            </Button>

            {/* Theme Toggle */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                icon={ThemeIcon}
                onClick={() => setShowThemeMenu(!showThemeMenu)}
              />
              
              {showThemeMenu && (
                <div className="absolute right-0 top-full mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in slide-in-from-top-2 duration-200">
                  {(['light', 'dark', 'system'] as const).map((themeOption) => {
                    const Icon = themeIcons[themeOption];
                    return (
                      <button
                        key={themeOption}
                        onClick={() => {
                          setTheme(themeOption);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center space-x-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                          theme === themeOption ? 'bg-primary/10 text-primary' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        <span className="capitalize">{themeOption}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Profile */}
            <Button
              variant="ghost"
              size="sm"
              icon={User}
              onClick={() => onViewChange('profile')}
              className="hidden sm:flex"
            />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              icon={showMobileMenu ? X : Menu}
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4 animate-in slide-in-from-top-2 duration-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Button
                  key={item.id}
                  variant={currentView === item.id ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    onViewChange(item.id);
                    setShowMobileMenu(false);
                  }}
                  className="w-full justify-start relative"
                >
                  {item.label}
                  {item.id === 'messages' && unreadMessages > 0 && (
                    <Badge variant="error" size="sm" className="ml-auto">
                      {unreadMessages}
                    </Badge>
                  )}
                  {item.id === 'swaps' && pendingSwaps > 0 && (
                    <Badge variant="warning" size="sm" className="ml-auto">
                      {pendingSwaps}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};