import React, { useState } from 'react';
import { useProductivity } from '../../context/ProductivityContext';

const GoalsPanel = () => {
    const { goals, updateGoals, stats, sessions } = useProductivity();
    const [dailyGoal, setDailyGoal] = useState(Math.floor(goals.dailyGoal / 60)); // in minutes
    const [weeklyGoal, setWeeklyGoal] = useState(Math.floor(goals.weeklyGoal / 3600)); // in hours

    const handleSaveGoals = () => {
        updateGoals({
            dailyGoal: dailyGoal * 60,
            weeklyGoal: weeklyGoal * 3600
        });
    };

    // Calculate today's progress
    const getTodayProgress = () => {
        const today = new Date().toDateString();
        const todaySessions = sessions.filter(s =>
            new Date(s.date).toDateString() === today
        );
        const todayTime = todaySessions.reduce((sum, s) => sum + s.duration, 0);
        return {
            time: todayTime,
            percentage: Math.min((todayTime / goals.dailyGoal) * 100, 100)
        };
    };

    // Calculate this week's progress
    const getWeekProgress = () => {
        const now = new Date();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const weekSessions = sessions.filter(s =>
            new Date(s.date) >= weekAgo
        );
        const weekTime = weekSessions.reduce((sum, s) => sum + s.duration, 0);
        return {
            time: weekTime,
            percentage: Math.min((weekTime / goals.weeklyGoal) * 100, 100)
        };
    };

    const todayProgress = getTodayProgress();
    const weekProgress = getWeekProgress();

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '3rem',
                textAlign: 'center'
            }}>
                🎯 Your Goals
            </h2>

            {/* Daily Goal */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: '300',
                    letterSpacing: '1px',
                    marginBottom: '1.5rem'
                }}>
                    📅 Daily Goal
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <input
                        type="number"
                        value={dailyGoal}
                        onChange={(e) => setDailyGoal(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            width: '100px',
                            textAlign: 'center'
                        }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>minutes per day</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                    }}>
                        <span>Today's Progress</span>
                        <span>{formatTime(todayProgress.time)} / {formatTime(goals.dailyGoal)}</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '30px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${todayProgress.percentage}%`,
                            height: '100%',
                            background: 'var(--gradient-primary)',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '1rem'
                        }}>
                            {todayProgress.percentage > 20 && (
                                <span style={{
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '0.85rem'
                                }}>
                                    {Math.round(todayProgress.percentage)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {todayProgress.percentage >= 100 && (
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: '#22c55e',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>
                        🎉 Daily goal achieved! Great work!
                    </div>
                )}
            </div>

            {/* Weekly Goal */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: '300',
                    letterSpacing: '1px',
                    marginBottom: '1.5rem'
                }}>
                    📊 Weekly Goal
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem'
                }}>
                    <input
                        type="number"
                        value={weeklyGoal}
                        onChange={(e) => setWeeklyGoal(Math.max(0, parseInt(e.target.value) || 0))}
                        style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            padding: '0.75rem 1rem',
                            color: 'var(--text-primary)',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            width: '100px',
                            textAlign: 'center'
                        }}
                    />
                    <span style={{ color: 'var(--text-secondary)' }}>hours per week</span>
                </div>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        marginBottom: '0.5rem',
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem'
                    }}>
                        <span>This Week's Progress</span>
                        <span>{formatTime(weekProgress.time)} / {formatTime(goals.weeklyGoal)}</span>
                    </div>
                    <div style={{
                        width: '100%',
                        height: '30px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '15px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <div style={{
                            width: `${weekProgress.percentage}%`,
                            height: '100%',
                            background: 'var(--gradient-accent)',
                            transition: 'width 0.5s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'flex-end',
                            paddingRight: '1rem'
                        }}>
                            {weekProgress.percentage > 20 && (
                                <span style={{
                                    color: '#fff',
                                    fontWeight: '700',
                                    fontSize: '0.85rem'
                                }}>
                                    {Math.round(weekProgress.percentage)}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {weekProgress.percentage >= 100 && (
                    <div style={{
                        background: 'rgba(34, 197, 94, 0.1)',
                        border: '1px solid rgba(34, 197, 94, 0.3)',
                        borderRadius: '12px',
                        padding: '1rem',
                        color: '#22c55e',
                        textAlign: 'center',
                        fontWeight: '600'
                    }}>
                        🎉 Weekly goal achieved! Outstanding!
                    </div>
                )}
            </div>

            {/* Save Button */}
            <button
                onClick={handleSaveGoals}
                style={{
                    width: '100%',
                    padding: '1.2rem',
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    borderRadius: '15px',
                    background: 'var(--gradient-primary)',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(56, 189, 248, 0.3)'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(56, 189, 248, 0.4)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(56, 189, 248, 0.3)';
                }}
            >
                💾 Save Goals
            </button>
        </div>
    );
};

export default GoalsPanel;
