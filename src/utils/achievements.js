// Achievement definitions and checking logic

export const ACHIEVEMENTS = [
    {
        id: 'first_session',
        title: 'Getting Started',
        description: 'Complete your first focus session',
        icon: '🌟',
        condition: (stats) => stats.totalSessions >= 1
    },
    {
        id: 'one_hour',
        title: 'One Hour Focus',
        description: 'Study for a total of 1 hour',
        icon: '⏰',
        condition: (stats) => stats.totalTime >= 3600
    },
    {
        id: 'ten_hours',
        title: 'Dedicated Learner',
        description: 'Study for a total of 10 hours',
        icon: '📚',
        condition: (stats) => stats.totalTime >= 36000
    },
    {
        id: 'hundred_hours',
        title: 'Master Student',
        description: 'Study for a total of 100 hours',
        icon: '🎓',
        condition: (stats) => stats.totalTime >= 360000
    },
    {
        id: 'week_streak',
        title: 'Week Warrior',
        description: 'Maintain a 7-day study streak',
        icon: '🔥',
        condition: (stats) => stats.currentStreak >= 7
    },
    {
        id: 'month_streak',
        title: 'Consistency King',
        description: 'Maintain a 30-day study streak',
        icon: '👑',
        condition: (stats) => stats.currentStreak >= 30
    },
    {
        id: 'hundred_coins',
        title: 'Coin Collector',
        description: 'Earn 100 coins',
        icon: '🪙',
        condition: (stats) => stats.totalCoins >= 100
    },
    {
        id: 'early_bird',
        title: 'Early Bird',
        description: 'Complete a session before 7 AM',
        icon: '🌅',
        condition: (stats, sessions) => {
            return sessions.some(s => {
                const hour = new Date(s.date).getHours();
                return hour >= 5 && hour < 7;
            });
        }
    },
    {
        id: 'night_owl',
        title: 'Night Owl',
        description: 'Complete a session after 11 PM',
        icon: '🦉',
        condition: (stats, sessions) => {
            return sessions.some(s => {
                const hour = new Date(s.date).getHours();
                return hour >= 23 || hour < 5;
            });
        }
    },
    {
        id: 'marathon',
        title: 'Marathon Runner',
        description: 'Complete a 2-hour session without breaks',
        icon: '🏃',
        condition: (stats, sessions) => {
            return sessions.some(s => s.duration >= 7200);
        }
    }
];

export const checkAchievements = (stats, sessions) => {
    return ACHIEVEMENTS.map(achievement => ({
        ...achievement,
        unlocked: achievement.condition(stats, sessions)
    }));
};

export const getNewlyUnlocked = (previousAchievements, currentAchievements) => {
    return currentAchievements.filter(current => {
        const previous = previousAchievements.find(p => p.id === current.id);
        return current.unlocked && (!previous || !previous.unlocked);
    });
};
