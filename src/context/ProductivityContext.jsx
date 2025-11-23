import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    getStats,
    getSessions,
    getGoals,
    getAchievements,
    getSettings,
    saveSession as saveSessionToStorage,
    saveStats,
    saveGoals as saveGoalsToStorage,
    saveSettings as saveSettingsToStorage
} from '../utils/storage';
import { ACHIEVEMENTS, checkAchievements, getNewlyUnlocked } from '../utils/achievements';
import { applyTheme } from '../utils/themes';

const ProductivityContext = createContext();

export const useProductivity = () => {
    const context = useContext(ProductivityContext);
    if (!context) {
        throw new Error('useProductivity must be used within ProductivityProvider');
    }
    return context;
};

export const ProductivityProvider = ({ children }) => {
    // Timer state
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [mode, setMode] = useState('focus'); // 'focus' or 'pomodoro'
    const [pomodoroPhase, setPomodoroPhase] = useState('work'); // 'work' or 'break'
    const [pomodoroCount, setPomodoroCount] = useState(0);

    // Session state
    const [currentNotes, setCurrentNotes] = useState('');
    const [sessions, setSessions] = useState([]);

    // Stats state
    const [stats, setStats] = useState({
        totalTime: 0,
        totalCoins: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null
    });

    // Goals state
    const [goals, setGoals] = useState({
        dailyGoal: 60 * 60,
        weeklyGoal: 60 * 60 * 10
    });

    // Achievements state
    const [achievements, setAchievements] = useState([]);
    const [newAchievements, setNewAchievements] = useState([]);

    // Settings state
    const [settings, setSettings] = useState({
        theme: 'dark',
        colorScheme: 'default',
        soundEnabled: true,
        volume: 0.5,
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15,
    });

    // UI state
    const [currentView, setCurrentView] = useState('timer');
    const [showAchievementNotification, setShowAchievementNotification] = useState(false);

    // Load data on mount
    useEffect(() => {
        const loadedSessions = getSessions();
        const loadedStats = getStats();
        const loadedGoals = getGoals();
        const loadedSettings = getSettings();

        setSessions(loadedSessions);
        setStats(loadedStats);
        setGoals(loadedGoals);
        setSettings(loadedSettings);

        // Initialize achievements
        const checkedAchievements = checkAchievements(loadedStats, loadedSessions);
        const savedAchievements = getAchievements();

        // Merge with saved unlocked states
        const mergedAchievements = checkedAchievements.map(achievement => {
            const saved = savedAchievements.find(s => s.id === achievement.id);
            return saved || achievement;
        });

        setAchievements(mergedAchievements);

        // Apply theme
        applyTheme(loadedSettings.theme, loadedSettings.colorScheme);
    }, []);

    // Save session
    const saveSession = (sessionTime, earnedCoins) => {
        const session = {
            id: Date.now(),
            date: new Date().toISOString(),
            duration: sessionTime,
            coins: earnedCoins,
            mode,
            notes: currentNotes,
            tags: []
        };

        saveSessionToStorage(session);
        setSessions(prev => [...prev, session]);

        // Update stats
        const newStats = {
            ...stats,
            totalTime: stats.totalTime + sessionTime,
            totalCoins: stats.totalCoins + earnedCoins,
            totalSessions: stats.totalSessions + 1
        };

        // Update streak
        const today = new Date().toDateString();
        const lastSession = stats.lastSessionDate ? new Date(stats.lastSessionDate).toDateString() : null;

        if (today === lastSession) {
            // Same day
        } else if (isYesterday(stats.lastSessionDate)) {
            newStats.currentStreak = stats.currentStreak + 1;
        } else {
            newStats.currentStreak = 1;
        }

        if (newStats.currentStreak > newStats.longestStreak) {
            newStats.longestStreak = newStats.currentStreak;
        }

        newStats.lastSessionDate = new Date().toISOString();
        setStats(newStats);
        saveStats(newStats);

        // Check for new achievements
        const updatedSessions = [...sessions, session];
        const checkedAchievements = checkAchievements(newStats, updatedSessions);
        const newly = getNewlyUnlocked(achievements, checkedAchievements);

        if (newly.length > 0) {
            setNewAchievements(newly);
            setShowAchievementNotification(true);
            setTimeout(() => setShowAchievementNotification(false), 4000);
        }

        setAchievements(checkedAchievements);
        setCurrentNotes('');
    };

    // Update goals
    const updateGoals = (newGoals) => {
        setGoals(newGoals);
        saveGoalsToStorage(newGoals);
    };

    // Update settings
    const updateSettings = (newSettings) => {
        setSettings(newSettings);
        saveSettingsToStorage(newSettings);
        applyTheme(newSettings.theme, newSettings.colorScheme);
    };

    const isYesterday = (dateString) => {
        if (!dateString) return false;
        const date = new Date(dateString);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        return date.toDateString() === yesterday.toDateString();
    };

    const value = {
        // Timer
        time,
        setTime,
        isRunning,
        setIsRunning,
        mode,
        setMode,
        pomodoroPhase,
        setPomodoroPhase,
        pomodoroCount,
        setPomodoroCount,

        // Session
        currentNotes,
        setCurrentNotes,
        sessions,
        saveSession,

        // Stats
        stats,

        // Goals
        goals,
        updateGoals,

        // Achievements
        achievements,
        newAchievements,
        showAchievementNotification,
        setShowAchievementNotification,

        // Settings
        settings,
        updateSettings,

        // UI
        currentView,
        setCurrentView
    };

    return (
        <ProductivityContext.Provider value={value}>
            {children}
        </ProductivityContext.Provider>
    );
};

export default ProductivityContext;
