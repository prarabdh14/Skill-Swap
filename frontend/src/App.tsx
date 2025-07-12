import React, { useState } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AppProvider } from './contexts/AppContext';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/features/Dashboard';
import { UserProfile } from './components/features/UserProfile';
import { SkillDiscovery } from './components/features/SkillDiscovery';
import { SwapManagement } from './components/features/SwapManagement';
import { Messages } from './components/features/Messages';
import { AdminPanel } from './components/features/AdminPanel';

function AppContent() {
  const [currentView, setCurrentView] = useState('dashboard');

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

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-300">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {renderView()}
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;