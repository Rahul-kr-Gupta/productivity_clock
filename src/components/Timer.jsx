import React, { useState } from 'react';

const Timer = ({ time, isRunning, setIsRunning, setTime }) => {
    const [ripples, setRipples] = useState([]);

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

    // Generate floating particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: Math.random() * 3 + 4
    }));

    return (
        <div style={{ position: 'relative', textAlign: 'center', padding: '2rem' }}>
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

            {/* Timer Display with Gradient Text */}
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

            {/* Buttons */}
            <div style={{ marginTop: '3rem', display: 'flex', gap: '1rem', justifyContent: 'center', position: 'relative', zIndex: 2 }}>
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
                    {isRunning ? '⏸ Pause' : '▶ Start Focus'}
                </button>

                <button
                    onClick={(e) => {
                        createRipple(e, 'reset');
                        setIsRunning(false);
                        setTime(0);
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.8)';
                        e.currentTarget.style.backgroundColor = 'rgba(148, 163, 184, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'rgba(148, 163, 184, 0.4)';
                        e.currentTarget.style.backgroundColor = 'transparent';
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
                    {ripples.filter(r => r.buttonId === 'reset').map(ripple => (
                        <span
                            key={ripple.id}
                            style={{
                                position: 'absolute',
                                left: ripple.x,
                                top: ripple.y,
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: 'rgba(148, 163, 184, 0.5)',
                                transform: 'translate(-50%, -50%)',
                                animation: 'ripple 0.6s ease-out',
                                pointerEvents: 'none'
                            }}
                        />
                    ))}
                    🔄 Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
