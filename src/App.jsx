import React from 'react';
import { ProductivityProvider, useProductivity } from './context/ProductivityContext';
import Navigation from './components/Navigation';
import TimerView from './components/TimerView';
import StatsPanel from './components/Stats/StatsPanel';
import GoalsPanel from './components/Goals/GoalsPanel';
import AchievementsPanel from './components/Achievements/AchievementsPanel';
import SettingsPanel from './components/Settings/SettingsPanel';
import './App.css';

function AppContent() {
  const { currentView, showAchievementNotification, newAchievements, setShowAchievementNotification } = useProductivity();

  const renderView = () => {
    switch (currentView) {
      case 'timer':
        return <TimerView />;
      case 'stats':
        return <StatsPanel />;
      case 'goals':
        return <GoalsPanel />;
      case 'achievements':
        return <AchievementsPanel />;
      case 'settings':
        return <SettingsPanel />;
      default:
        return <TimerView />;
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <Navigation />
      <div style={{ flex: 1, overflow: 'auto' }}>
        {renderView()}
      </div>

      {/* Achievement Unlock Notification */}
      {showAchievementNotification && newAchievements.length > 0 && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'rgba(26, 31, 58, 0.95)',
          backdropFilter: 'blur(20px)',
          padding: '2.5rem 4rem',
          borderRadius: '25px',
          border: '2px solid var(--accent-color)',
          boxShadow: '0 0 60px rgba(56, 189, 248, 0.4)',
          zIndex: 10000,
          animation: 'bounce-in 0.6s ease',
          textAlign: 'center',
          minWidth: '400px'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
            {newAchievements[0].icon}
          </div>
          <div style={{
            fontSize: '1.2rem',
            color: 'var(--text-secondary)',
            marginBottom: '0.5rem',
            letterSpacing: '2px',
            textTransform: 'uppercase'
          }}>
            Achievement Unlocked!
          </div>
          <div style={{
            fontSize: '2rem',
            fontWeight: '800',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '1rem'
          }}>
            {newAchievements[0].title}
          </div>
          <div style={{
            color: 'var(--text-secondary)',
            fontSize: '1rem'
          }}>
            {newAchievements[0].description}
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <ProductivityProvider>
      <AppContent />
    </ProductivityProvider>
  );
}

export default App;
