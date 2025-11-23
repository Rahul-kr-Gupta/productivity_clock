import React from 'react';
import { useProductivity } from '../context/ProductivityContext';

const Navigation = () => {
    const { currentView, setCurrentView } = useProductivity();

    const tabs = [
        { id: 'timer', label: 'Timer', icon: '⏱️' },
        { id: 'stats', label: 'Stats', icon: '📊' },
        { id: 'goals', label: 'Goals', icon: '🎯' },
        { id: 'achievements', label: 'Achievements', icon: '🏆' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <nav style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem',
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'sticky',
            top: 0,
            zIndex: 100
        }}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setCurrentView(tab.id)}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        borderRadius: '12px',
                        background: currentView === tab.id
                            ? 'var(--gradient-primary)'
                            : 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        border: currentView === tab.id
                            ? 'none'
                            : '1px solid rgba(255, 255, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transform: currentView === tab.id ? 'scale(1.05)' : 'scale(1)',
                        boxShadow: currentView === tab.id
                            ? '0 0 20px rgba(56, 189, 248, 0.3)'
                            : 'none'
                    }}
                    onMouseEnter={(e) => {
                        if (currentView !== tab.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.transform = 'scale(1.02)';
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (currentView !== tab.id) {
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                            e.currentTarget.style.transform = 'scale(1)';
                        }
                    }}
                >
                    <span>{tab.icon}</span>
                    <span style={{ display: window.innerWidth > 768 ? 'inline' : 'none' }}>
                        {tab.label}
                    </span>
                </button>
            ))}
        </nav>
    );
};

export default Navigation;
