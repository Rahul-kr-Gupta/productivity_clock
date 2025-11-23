import React, { useEffect, useState } from 'react';

const KnowledgePool = ({ time, coins }) => {
    const [drops, setDrops] = useState([]);

    // Create a visual "drop" every second the timer runs
    useEffect(() => {
        if (time > 0 && time % 1 === 0) { // Every second
            const id = Date.now();
            const left = Math.random() * 90 + 5; // Random position 5-95%
            setDrops((prev) => [...prev, { id, left }]);

            // Cleanup drop after animation
            setTimeout(() => {
                setDrops((prev) => prev.filter(d => d.id !== id));
            }, 2000);
        }
    }, [time]);

    // Calculate pool height based on time (capped at 100% for visual)
    // Let's say 1 hour fills the pool visual for this demo
    const poolHeight = Math.min((time % 3600) / 36, 100);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
            {/* Title */}
            <div style={{ position: 'absolute', top: '2rem', width: '100%', textAlign: 'center', zIndex: 10 }}>
                <h2 style={{ color: 'var(--text-secondary)', fontWeight: 'normal', letterSpacing: '2px' }}>KNOWLEDGE POOL</h2>
                <div style={{
                    marginTop: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px'
                }}>
                    <span style={{ fontSize: '1.5rem' }}>🪙</span>
                    <span style={{ fontSize: '1.5rem', color: 'var(--gold-color)', fontWeight: 'bold' }}>{coins}</span>
                </div>
            </div>

            {/* Drops */}
            {drops.map(drop => (
                <div
                    key={drop.id}
                    style={{
                        position: 'absolute',
                        top: '-20px',
                        left: `${drop.left}%`,
                        width: '4px',
                        height: '15px',
                        backgroundColor: 'var(--accent-color)',
                        borderRadius: '2px',
                        animation: 'fall 2s linear forwards',
                        opacity: 0.7
                    }}
                />
            ))}

            {/* The Pool */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: `${poolHeight}%`,
                backgroundColor: 'var(--accent-color)',
                opacity: 0.2,
                transition: 'height 1s linear',
                boxShadow: '0 0 50px var(--accent-glow)'
            }} />

            {/* Wave effect on top of pool */}
            <div style={{
                position: 'absolute',
                bottom: `${poolHeight}%`,
                left: 0,
                width: '100%',
                height: '10px',
                background: 'linear-gradient(to bottom, transparent, var(--accent-color))',
                opacity: 0.3,
                transition: 'bottom 1s linear'
            }} />

            <style>{`
        @keyframes fall {
          to { top: 100%; opacity: 0; }
        }
      `}</style>
        </div>
    );
};

export default KnowledgePool;
