import React from 'react';

const Timer = ({ time, isRunning, setIsRunning, setTime }) => {
    const formatTime = (seconds) => {
        const getSeconds = `0${seconds % 60}`.slice(-2);
        const minutes = Math.floor(seconds / 60);
        const getMinutes = `0${minutes % 60}`.slice(-2);
        const getHours = `0${Math.floor(seconds / 3600)}`.slice(-2);
        return `${getHours}:${getMinutes}:${getSeconds}`;
    };

    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{
                fontSize: '6rem',
                fontWeight: 'bold',
                color: 'var(--text-primary)',
                fontVariantNumeric: 'tabular-nums',
                textShadow: '0 0 20px rgba(255, 255, 255, 0.1)'
            }}>
                {formatTime(time)}
            </div>
            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        backgroundColor: isRunning ? 'var(--bg-secondary)' : 'var(--accent-color)',
                        color: isRunning ? 'var(--text-primary)' : 'var(--bg-primary)',
                        border: isRunning ? '1px solid var(--text-secondary)' : 'none',
                        boxShadow: isRunning ? 'none' : '0 0 15px var(--accent-glow)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    {isRunning ? 'Pause' : 'Start Focus'}
                </button>
                <button
                    onClick={() => { setIsRunning(false); setTime(0); }}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: '1.2rem',
                        borderRadius: '50px',
                        backgroundColor: 'transparent',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--text-secondary)',
                        transition: 'all 0.3s ease'
                    }}
                >
                    Reset
                </button>
            </div>
        </div>
    );
};

export default Timer;
