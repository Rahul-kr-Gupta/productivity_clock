import React, { useState, useEffect } from 'react';
import { useProductivity } from '../context/ProductivityContext';

const TimerView = () => {
    const {
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
        currentNotes,
        setCurrentNotes,
        saveSession,
        settings,
        stats
    } = useProductivity();

    const [ripples, setRipples] = useState([]);
    const [coins, setCoins] = useState(0);
    const [showReward, setShowReward] = useState(false);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isRunning) {
            interval = setInterval(() => {
                setTime((prevTime) => {
                    const newTime = prevTime + 1;

                    // Check for coin rewards (every 10 minutes)
                    if (newTime > 0 && newTime % 600 === 0) {
                        setCoins(prev => prev + 1);
                        setShowReward(true);
                        setTimeout(() => setShowReward(false), 3000);
                    }

                    // Pomodoro mode auto-switch
                    if (mode === 'pomodoro') {
                        const workDuration = settings.pomodoroWork * 60;
                        const breakDuration = pomodoroCount === 3
                            ? settings.pomodoroLongBreak * 60
                            : settings.pomodoroBreak * 60;

                        if (pomodoroPhase === 'work' && newTime >= workDuration) {
                            setPomodoroPhase('break');
                            setTime(0);
                            setPomodoroCount(prev => (prev + 1) % 4);
                            return 0;
                        } else if (pomodoroPhase === 'break' && newTime >= breakDuration) {
                            setPomodoroPhase('work');
                            setTime(0);
                            return 0;
                        }
                    }

                    return newTime;
                });
            }, 1000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [isRunning, mode, pomodoroPhase, pomodoroCount, settings, setTime, setPomodoroPhase, setPomodoroCount]);

    const formatTime = (seconds) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    const createRipple = (e, buttonId) => {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = {
            id: Date.now(),
            x,
            y,
            buttonId
        };

        setRipples(prev => [...prev, ripple]);
        setTimeout(() => {
            setRipples(prev => prev.filter(r => r.id !== ripple.id));
        }, 600);
    };

    const handleStop = () => {
        if (time > 0) {
            saveSession(time, coins);
            setCoins(0);
        }
        setIsRunning(false);
        setTime(0);
    };

    const handlePreset = (minutes) => {
        if (!isRunning) {
            setTime(0);
            setMode('focus');
            setIsRunning(true);
        }
    };

    const toggleMode = () => {
        if (!isRunning) {
            const newMode = mode === 'focus' ? 'pomodoro' : 'focus';
            setMode(newMode);
            setTime(0);
            setCoins(0);
            if (newMode === 'pomodoro') {
                setPomodoroPhase('work');
                setPomodoroCount(0);
            }
        }
    };

    // Generate floating particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 4
    }));

    const getTargetTime = () => {
        if (mode === 'pomodoro') {
            if (pomodoroPhase === 'work') {
                return settings.pomodoroWork * 60;
            } else {
                return pomodoroCount === 3
                    ? settings.pomodoroLongBreak * 60
                    : settings.pomodoroBreak * 60;
            }
        }
        return null;
    };

    const targetTime = getTargetTime();
    const progress = targetTime ? (time / targetTime) * 100 : 0;

    return (
        <div style={{
            display: 'flex',
            flexDirection: window.innerWidth > 968 ? 'row' : 'column',
            height: '100%',
            width: '100%'
        }}>
            {/* Left: Timer */}
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                padding: '2rem'
            }}>
                {/* Floating Particles */}
                {particles.map(particle => (
                    <div
                        key={particle.id}
                        style={{
                            position: 'absolute',
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            background: 'var(--gradient-primary)',
                            borderRadius: '50%',
                            left: `${particle.left}%`,
                            top: '50%',
                            opacity: 0.4,
                            animation: `float ${particle.duration}s ease-in-out infinite`,
                            animationDelay: `${particle.delay}s`,
                            boxShadow: '0 0 10px rgba(56, 189, 248, 0.5)'
                        }}
                    />
                ))}

                {/* Mode Toggle */}
                <div style={{
                    position: 'absolute',
                    top: '2rem',
                    display: 'flex',
                    gap: '1rem',
                    zIndex: 10
                }}>
                    <button
                        onClick={toggleMode}
                        disabled={isRunning}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '20px',
                            background: mode === 'focus' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            opacity: isRunning ? 0.5 : 1
                        }}
                    >
                        ⏱️ Focus
                    </button>
                    <button
                        onClick={toggleMode}
                        disabled={isRunning}
                        style={{
                            padding: '0.75rem 1.5rem',
                            borderRadius: '20px',
                            background: mode === 'pomodoro' ? 'var(--gradient-primary)' : 'rgba(255, 255, 255, 0.05)',
                            color: 'var(--text-primary)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            fontSize: '0.9rem',
                            fontWeight: '600',
                            cursor: isRunning ? 'not-allowed' : 'pointer',
                            opacity: isRunning ? 0.5 : 1
                        }}
                    >
                        🍅 Pomodoro
                    </button>
                </div>

                {/* Pomodoro Phase Indicator */}
                {mode === 'pomodoro' && (
                    <div style={{
                        position: 'absolute',
                        top: '5rem',
                        padding: '0.5rem 1.5rem',
                        borderRadius: '20px',
                        background: pomodoroPhase === 'work'
                            ? 'rgba(56, 189, 248, 0.1)'
                            : 'rgba(34, 197, 94, 0.1)',
                        border: pomodoroPhase === 'work'
                            ? '1px solid rgba(56, 189, 248, 0.3)'
                            : '1px solid rgba(34, 197, 94, 0.3)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                    }}>
                        {pomodoroPhase === 'work' ? '💼 Work Time' : '☕ Break Time'}
                        {' '}({pomodoroCount + 1}/4)
                    </div>
                )}

                {/* Timer Display */}
                <div style={{
                    fontSize: '6rem',
                    fontWeight: '800',
                    background: 'var(--gradient-primary)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    fontVariantNumeric: 'tabular-nums',
                    filter: isRunning ? 'drop-shadow(0 2px 8px rgba(56, 189, 248, 0.15))' : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    zIndex: 2
                }}>
                    {formatTime(time)}
                </div>

                {/* Pomodoro Progress Ring */}
                {mode === 'pomodoro' && targetTime && (
                    <div style={{
                        marginTop: '1rem',
                        width: '200px',
                        height: '8px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        position: 'relative',
                        zIndex: 2
                    }}>
                        <div style={{
                            width: `${Math.min(progress, 100)}%`,
                            height: '100%',
                            background: pomodoroPhase === 'work'
                                ? 'var(--gradient-primary)'
                                : 'linear-gradient(90deg, #10b981, #22c55e)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                )}

                {/* Quick Presets */}
                {!isRunning && mode === 'focus' && (
                    <div style={{
                        marginTop: '2rem',
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        zIndex: 2
                    }}>
                        {[25, 50, 60, 120].map(mins => (
                            <button
                                key={mins}
                                onClick={() => handlePreset(mins)}
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-secondary)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    fontSize: '0.85rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                                    e.currentTarget.style.color = 'var(--text-primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                }}
                            >
                                {mins}m
                            </button>
                        ))}
                    </div>
                )}

                {/* Control Buttons */}
                <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', zIndex: 2 }}>
                    <button
                        onClick={(e) => {
                            createRipple(e, 'start');
                            setIsRunning(!isRunning);
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = isRunning
                                ? '0 0 30px rgba(56, 189, 248, 0.3)'
                                : '0 0 40px rgba(56, 189, 248, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = isRunning
                                ? 'none'
                                : '0 0 20px rgba(56, 189, 248, 0.4)';
                        }}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            background: isRunning
                                ? 'rgba(255, 255, 255, 0.05)'
                                : 'var(--gradient-primary)',
                            color: 'var(--text-primary)',
                            border: isRunning ? '2px solid rgba(56, 189, 248, 0.3)' : 'none',
                            boxShadow: isRunning ? 'none' : '0 0 20px rgba(56, 189, 248, 0.4)',
                            backdropFilter: isRunning ? 'blur(10px)' : 'none',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {ripples.filter(r => r.buttonId === 'start').map(ripple => (
                            <span
                                key={ripple.id}
                                style={{
                                    position: 'absolute',
                                    left: ripple.x,
                                    top: ripple.y,
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '50%',
                                    background: 'rgba(255, 255, 255, 0.5)',
                                    transform: 'translate(-50%, -50%)',
                                    animation: 'ripple 0.6s ease-out',
                                    pointerEvents: 'none'
                                }}
                            />
                        ))}
                        {isRunning ? '⏸ Pause' : '▶ Start'}
                    </button>

                    <button
                        onClick={handleStop}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.8)';
                            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                            e.currentTarget.style.color = '#ef4444';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
                            e.currentTarget.style.background = 'transparent';
                            e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                        style={{
                            position: 'relative',
                            overflow: 'hidden',
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            fontWeight: '600',
                            borderRadius: '50px',
                            backgroundColor: 'transparent',
                            color: 'var(--text-secondary)',
                            border: '2px solid rgba(148, 163, 184, 0.4)',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        ⏹ Stop & Save
                    </button>
                </div>

                {/* Notes Input */}
                <div style={{
                    marginTop: '2rem',
                    width: '100%',
                    maxWidth: '500px',
                    zIndex: 2
                }}>
                    <input
                        type="text"
                        placeholder="Add notes about this session..."
                        value={currentNotes}
                        onChange={(e) => setCurrentNotes(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '15px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'var(--text-primary)',
                            fontSize: '0.95rem',
                            outline: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onFocus={(e) => {
                            e.currentTarget.style.borderColor = 'var(--accent-color)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                        }}
                        onBlur={(e) => {
                            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                        }}
                    />
                </div>

                {/* Stats Display */}
                <div style={{
                    marginTop: '2rem',
                    display: 'flex',
                    gap: '2rem',
                    zIndex: 2
                }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            Current Coins
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            background: 'var(--gradient-gold)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🪙 {coins}
                        </div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                            Today's Streak
                        </div>
                        <div style={{
                            fontSize: '1.5rem',
                            fontWeight: '700',
                            background: 'linear-gradient(135deg, #f59e0b, #ef4444)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text'
                        }}>
                            🔥 {stats.currentStreak}
                        </div>
                    </div>
                </div>
            </div>

            {/* Right: Knowledge Pool */}
            <div style={{
                flex: 1,
                position: 'relative',
                overflow: 'hidden',
                background: 'var(--bg-secondary)',
                borderLeft: window.innerWidth > 968 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none'
            }}>
                <KnowledgePoolMini time={time} coins={stats.totalCoins + coins} />
            </div>

            {/* Reward */}
            {showReward && <RewardNotificationMini />}
        </div>
    );
};

// Simplified versions for the timer view
const KnowledgePoolMini = ({ time, coins }) => {
    return (
        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
            }}>
                🪙
            </div>
            <div style={{
                fontSize: '3rem',
                fontWeight: '800',
                background: 'var(--gradient-gold)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                {coins}
            </div>
            <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                marginTop: '0.5rem',
                letterSpacing: '1px'
            }}>
                TOTAL COINS
            </div>
        </div>
    );
};

const RewardNotificationMini = () => {
    return (
        <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'rgba(26, 31, 58, 0.95)',
            backdropFilter: 'blur(20px)',
            padding: '2rem 3rem',
            borderRadius: '20px',
            border: '2px solid var(--gold-color)',
            boxShadow: '0 0 40px rgba(251, 191, 36, 0.4)',
            zIndex: 1000,
            animation: 'bounce-in 0.5s ease',
            textAlign: 'center'
        }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🪙</div>
            <div style={{
                fontSize: '1.5rem',
                fontWeight: '800',
                background: 'var(--gradient-gold)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                +1 Coin!
            </div>
        </div>
    );
};

export default TimerView;
