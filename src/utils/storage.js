// LocalStorage utility functions for productivity clock

const STORAGE_KEYS = {
    SESSIONS: 'productivity_sessions',
    STATS: 'productivity_stats',
    GOALS: 'productivity_goals',
    ACHIEVEMENTS: 'productivity_achievements',
    SETTINGS: 'productivity_settings',
};

// Session Management
export const saveSession = (session) => {
    const sessions = getSessions();
    sessions.push(session);
    localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    updateStats(session);
};

export const getSessions = () => {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : [];
};

export const getSessionsByDateRange = (startDate, endDate) => {
    const sessions = getSessions();
    return sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= startDate && sessionDate <= endDate;
    });
};

// Stats Management
export const updateStats = (session) => {
    const stats = getStats();
    stats.totalTime += session.duration;
    stats.totalCoins += session.coins;
    stats.totalSessions += 1;

    // Update streak
    const today = new Date().toDateString();
    const lastSession = new Date(stats.lastSessionDate).toDateString();

    if (today === lastSession) {
        // Same day, no change to streak
    } else if (isYesterday(stats.lastSessionDate)) {
        stats.currentStreak += 1;
    } else {
        stats.currentStreak = 1; // Reset streak
    }

    if (stats.currentStreak > stats.longestStreak) {
        stats.longestStreak = stats.currentStreak;
    }

    stats.lastSessionDate = new Date().toISOString();
    saveStats(stats);
};

export const getStats = () => {
    const data = localStorage.getItem(STORAGE_KEYS.STATS);
    return data ? JSON.parse(data) : {
        totalTime: 0,
        totalCoins: 0,
        totalSessions: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastSessionDate: null
    };
};

export const saveStats = (stats) => {
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

// Goals Management
export const getGoals = () => {
    const data = localStorage.getItem(STORAGE_KEYS.GOALS);
    return data ? JSON.parse(data) : {
        dailyGoal: 60 * 60, // 1 hour default
        weeklyGoal: 60 * 60 * 10, // 10 hours default
    };
};

export const saveGoals = (goals) => {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
};

// Achievements Management
export const getAchievements = () => {
    const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return data ? JSON.parse(data) : [];
};

export const saveAchievements = (achievements) => {
    localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
};

export const unlockAchievement = (achievementId) => {
    const achievements = getAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !achievement.unlocked) {
        achievement.unlocked = true;
        achievement.unlockedDate = new Date().toISOString();
        saveAchievements(achievements);
        return true;
    }
    return false;
};

// Settings Management
export const getSettings = () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : {
        theme: 'dark',
        colorScheme: 'default',
        soundEnabled: true,
        volume: 0.5,
        pomodoroWork: 25,
        pomodoroBreak: 5,
        pomodoroLongBreak: 15,
    };
};

export const saveSettings = (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
};

// Utility functions
const isYesterday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
};

// Export data
export const exportSessionsToCSV = () => {
    const sessions = getSessions();
    const headers = ['Date', 'Duration (min)', 'Coins', 'Mode', 'Notes'];
    const rows = sessions.map(s => [
        new Date(s.date).toLocaleDateString(),
        Math.round(s.duration / 60),
        s.coins,
        s.mode || 'focus',
        (s.notes || '').replace(/,/g, ';')
    ]);

    const csv = [
        headers.join(','),
        ...rows.map(r => r.join(','))
    ].join('\n');

    return csv;
};

export const downloadCSV = (csv, filename = 'productivity_data.csv') => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
};
