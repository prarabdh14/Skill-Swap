import React, { useState } from 'react';
import { Search, Bell, MessageCircle, User, Moon, Sun, Monitor, Menu, X, LogOut, Settings } from 'lucide-react';
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
  const { state, dispatch } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [showThemeMenu, setShowThemeMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
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

  const handleLogout = () => {
    dispatch({ type: 'SET_CURRENT_USER', payload: null });
    setShowUserMenu(false);
  };

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

            {/* User Profile Dropdown */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="hidden sm:flex items-center space-x-2"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {state.currentUser?.name?.charAt(0) || 'U'}
                  </span>
                </div>
                <span className="hidden lg:block text-sm font-medium text-gray-700 dark:text-gray-300">
                  {state.currentUser?.name}
                </span>
              </Button>
              
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 animate-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {state.currentUser?.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {state.currentUser?.email}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      onViewChange('profile');
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <User size={16} />
                    <span>Profile</span>
                  </button>
                  
                  <button
                    onClick={() => {
                      // Settings functionality
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Settings size={16} />
                    <span>Settings</span>
                  </button>
                  
                  <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                  >
                    <LogOut size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

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
              
              {/* Mobile logout button */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-red-600 dark:text-red-400"
                >
                  <LogOut size={16} className="mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};