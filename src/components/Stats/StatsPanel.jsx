import React, { useState } from 'react';
import { useProductivity } from '../../context/ProductivityContext';

const StatsPanel = () => {
    const { stats, sessions } = useProductivity();
    const [period, setPeriod] = useState('all'); // 'today', 'week', 'all'

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    };

    // Get stats for period
    const getFilteredStats = () => {
        const now = new Date();
        let filteredSessions = sessions;

        if (period === 'today') {
            const today = now.toDateString();
            filteredSessions = sessions.filter(s =>
                new Date(s.date).toDateString() === today
            );
        } else if (period === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filteredSessions = sessions.filter(s =>
                new Date(s.date) >= weekAgo
            );
        }

        const totalTime = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
        const totalCoins = filteredSessions.reduce((sum, s) => sum + s.coins, 0);
        const totalSessions = filteredSessions.length;

        return { totalTime, totalCoins, totalSessions, sessions: filteredSessions };
    };

    const periodStats = getFilteredStats();

    // Get last 7 days data for chart
    const getLast7Days = () => {
        const days = [];
        const now = new Date();

        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toDateString();

            const daySessions = sessions.filter(s =>
                new Date(s.date).toDateString() === dateStr
            );
            const dayTime = daySessions.reduce((sum, s) => sum + s.duration, 0);

            days.push({
                date: date.toLocaleDateString('en-US', { weekday: 'short' }),
                time: dayTime,
                sessions: daySessions.length
            });
        }

        return days;
    };

    const weekData = getLast7Days();
    const maxTime = Math.max(...weekData.map(d => d.time), 1);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            {/* Period Selector */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem',
                marginBottom: '2rem'
            }}>
                {['today', 'week', 'all'].map(p => (
                    <button
                        key={p}
                        onClick={() => setPeriod(p)}
                        style={{
                            padding: '0.75rem 2rem',
                            borderRadius: '12px',
                            background: period === p ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-primary)',
                            border: period === p ? 'none' : '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '1rem',
                            fontWeight: '600',
                            textTransform: 'capitalize',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {p === 'all' ? 'All Time' : p}
                    </button>
                ))}
            </div>

            {/* Stats Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                <StatCard
                    icon="⏱️"
                    label="Total Time"
                    value={formatTime(periodStats.totalTime)}
                    gradient="var(--gradient-primary)"
                />
                <StatCard
                    icon="🪙"
                    label="Coins Earned"
                    value={periodStats.totalCoins}
                    gradient="var(--gradient-gold)"
                />
                <StatCard
                    icon="📚"
                    label="Sessions"
                    value={periodStats.totalSessions}
                    gradient="var(--gradient-accent)"
                />
                <StatCard
                    icon="🔥"
                    label="Current Streak"
                    value={`${stats.currentStreak} days`}
                    gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
                />
            </div>

            {/* Activity Chart */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '2rem'
            }}>
                <h3 style={{
                    marginBottom: '2rem',
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: '300',
                    letterSpacing: '1px'
                }}>
                    Last 7 Days Activity
                </h3>

                <div style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    gap: '1rem',
                    height: '200px',
                    justifyContent: 'space-around'
                }}>
                    {weekData.map((day, index) => (
                        <div key={index} style={{
                            flex: 1,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <div style={{
                                width: '100%',
                                height: `${(day.time / maxTime) * 150}px`,
                                minHeight: day.time > 0 ? '10px' : '2px',
                                background: day.time > 0 ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.3s ease',
                                position: 'relative'
                            }}>
                                {day.time > 0 && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-2rem',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        whiteSpace: 'nowrap'
                                    }}>
                                        {Math.round(day.time / 60)}m
                                    </div>
                                )}
                            </div>
                            <div style={{
                                fontSize: '0.85rem',
                                color: 'var(--text-secondary)',
                                fontWeight: '500'
                            }}>
                                {day.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Sessions */}
            <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: '20px',
                padding: '2rem',
                border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                <h3 style={{
                    marginBottom: '1.5rem',
                    color: 'var(--text-secondary)',
                    fontSize: '1.2rem',
                    fontWeight: '300',
                    letterSpacing: '1px'
                }}>
                    Recent Sessions
                </h3>

                {periodStats.sessions.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>
                        No sessions yet. Start your first focus session!
                    </p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {periodStats.sessions.slice(-10).reverse().map(session => (
                            <div key={session.id} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '1rem',
                                background: 'rgba(255, 255, 255, 0.02)',
                                borderRadius: '12px',
                                border: '1px solid rgba(255, 255, 255, 0.05)'
                            }}>
                                <div>
                                    <div style={{ color: 'var(--text-primary)', fontWeight: '600' }}>
                                        {formatTime(session.duration)}
                                    </div>
                                    <div style={{
                                        color: 'var(--text-secondary)',
                                        fontSize: '0.85rem',
                                        marginTop: '0.25rem'
                                    }}>
                                        {new Date(session.date).toLocaleDateString()} {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                    {session.notes && (
                                        <div style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '0.85rem',
                                            marginTop: '0.5rem',
                                            fontStyle: 'italic'
                                        }}>
                                            "{session.notes}"
                                        </div>
                                    )}
                                </div>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    fontSize: '1.2rem',
                                    fontWeight: '700',
                                    background: 'var(--gradient-gold)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundClip: 'text'
                                }}>
                                    🪙 {session.coins}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

const StatCard = ({ icon, label, value, gradient }) => (
    <div style={{
        background: 'rgba(255, 255, 255, 0.03)',
        borderRadius: '20px',
        padding: '2rem',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center'
    }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
        <div style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '1px'
        }}>
            {label}
        </div>
        <div style={{
            background: gradient,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontSize: '2rem',
            fontWeight: '800'
        }}>
            {value}
        </div>
    </div>
);

export default StatsPanel;
