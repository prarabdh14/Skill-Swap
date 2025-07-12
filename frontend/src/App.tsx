import React, { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/features/Dashboard';
import { UserProfile } from './components/features/UserProfile';
import { SkillDiscovery } from './components/features/SkillDiscovery';
import { SwapManagement } from './components/features/SwapManagement';
import { Messages } from './components/features/Messages';
import { AdminPanel } from './components/features/AdminPanel';
import { AuthContainer } from './components/auth/AuthContainer';
import { useApp } from './contexts/AppContext';
import { ParallaxBackground, SectionParallax } from './components/ui/ParallaxBackground';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { state } = useApp();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onViewChange={setCurrentView} />;
      case 'discover':
        return <SkillDiscovery />;
      case 'swaps':
        return <SwapManagement />;
      case 'messages':
        return <Messages />;
      case 'profile':
        return <UserProfile />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard onViewChange={setCurrentView} />;
    }
  };

  // Show auth container if no user is logged in
  if (!state.currentUser) {
    return (
      <AuthContainer 
        onAuthSuccess={() => {
          // User successfully authenticated, app will re-render with currentUser
        }} 
      />
    );
  }

  // Show main app when user is authenticated
  return (
    <ParallaxBackground intensity="medium">
      <div className="min-h-screen transition-colors duration-300">
        <Header currentView={currentView} onViewChange={setCurrentView} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-fade-in">
            {renderView()}
          </div>
        </main>
      </div>
    </ParallaxBackground>
  );
}

function App() {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
      <ThemeProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;