import React, { useEffect, useState } from 'react';

const KnowledgePool = ({ time, coins }) => {
    const [drops, setDrops] = useState([]);
    const [bubbles, setBubbles] = useState([]);
    const [displayCoins, setDisplayCoins] = useState(0);
    const [prevCoins, setPrevCoins] = useState(0);

    // Animated coin counter
    useEffect(() => {
        if (coins > prevCoins) {
            let current = prevCoins;
            const increment = () => {
                current += 1;
                setDisplayCoins(current);
                if (current < coins) {
                    setTimeout(increment, 100);
                }
            };
            increment();
            setPrevCoins(coins);
        } else {
            setDisplayCoins(coins);
            setPrevCoins(coins);
        }
    }, [coins]);

    // Create a visual "drop" every second the timer runs
    useEffect(() => {
        if (time > 0 && time % 1 === 0) {
            const id = Date.now();
            const left = Math.random() * 90 + 5;
            const size = Math.random() * 3 + 2;
            setDrops((prev) => [...prev, { id, left, size }]);

            setTimeout(() => {
                setDrops((prev) => prev.filter(d => d.id !== id));
            }, 2000);
        }
    }, [time]);

    // Generate bubbles from the pool
    useEffect(() => {
        if (time > 0 && poolHeight > 10) {
            const interval = setInterval(() => {
                const id = Date.now() + Math.random();
                const left = Math.random() * 90 + 5;
                const size = Math.random() * 8 + 4;
                const duration = Math.random() * 3 + 4;

                setBubbles((prev) => [...prev, { id, left, size, duration }]);

                setTimeout(() => {
                    setBubbles((prev) => prev.filter(b => b.id !== id));
                }, duration * 1000);
            }, 800);

            return () => clearInterval(interval);
        }
    }, [time]);

    // Calculate pool height based on time
    const poolHeight = Math.min((time % 3600) / 36, 100);

    return (
        <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
            {/* Animated Gradient Background */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    radial-gradient(ellipse at 30% 40%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
                    radial-gradient(ellipse at 70% 60%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)
                `,
                zIndex: 0
            }} />

            {/* Title */}
            <div style={{ position: 'absolute', top: '2rem', width: '100%', textAlign: 'center', zIndex: 10 }}>
                <h2 style={{
                    color: 'var(--text-secondary)',
                    fontWeight: '300',
                    letterSpacing: '3px',
                    fontSize: '1rem',
                    textTransform: 'uppercase'
                }}>
                    Knowledge Pool
                </h2>

                {/* Coin Counter with Glassmorphism */}
                <div style={{
                    marginTop: '1.5rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    background: 'rgba(251, 191, 36, 0.1)',
                    backdropFilter: 'blur(10px)',
                    padding: '0.75rem 2rem',
                    borderRadius: '30px',
                    border: '2px solid rgba(251, 191, 36, 0.3)',
                    boxShadow: '0 0 30px rgba(251, 191, 36, 0.2)',
                    animation: coins > 0 ? 'pulse-glow 2s ease-in-out infinite' : 'none'
                }}>
                    <span style={{
                        fontSize: '2rem',
                        animation: coins !== prevCoins ? 'coin-flip 0.6s ease' : 'none'
                    }}>
                        🪙
                    </span>
                    <span style={{
                        fontSize: '2rem',
                        background: 'var(--gradient-gold)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                        fontWeight: '800',
                        animation: coins !== displayCoins ? 'count-up 0.3s ease' : 'none'
                    }}>
                        {displayCoins}
                    </span>
                </div>
            </div>

            {/* Drops with shimmer effect */}
            {drops.map(drop => (
                <React.Fragment key={drop.id}>
                    {/* Main drop */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            left: `${drop.left}%`,
                            width: `${drop.size}px`,
                            height: `${drop.size * 3}px`,
                            background: 'linear-gradient(to bottom, rgba(56, 189, 248, 0.8), rgba(56, 189, 248, 0.4))',
                            borderRadius: `${drop.size}px`,
                            animation: 'fall 2s linear forwards',
                            boxShadow: '0 0 10px rgba(56, 189, 248, 0.6)',
                            filter: 'brightness(1.5)'
                        }}
                    />
                    {/* Shimmer trail */}
                    <div
                        style={{
                            position: 'absolute',
                            top: '-20px',
                            left: `${drop.left}%`,
                            width: `${drop.size * 0.5}px`,
                            height: `${drop.size * 6}px`,
                            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent)',
                            borderRadius: `${drop.size}px`,
                            animation: 'fall 2s linear forwards',
                            opacity: 0.4
                        }}
                    />
                </React.Fragment>
            ))}

            {/* Floating Bubbles */}
            {bubbles.map(bubble => (
                <div
                    key={bubble.id}
                    style={{
                        position: 'absolute',
                        bottom: `${poolHeight}%`,
                        left: `${bubble.left}%`,
                        width: `${bubble.size}px`,
                        height: `${bubble.size}px`,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.3), rgba(56, 189, 248, 0.2))',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        animation: `float-up ${bubble.duration}s linear forwards`,
                        boxShadow: 'inset 0 0 10px rgba(255, 255, 255, 0.2)'
                    }}
                />
            ))}

            {/* The Pool with gradient fill */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: `${poolHeight}%`,
                background: 'linear-gradient(to top, rgba(56, 189, 248, 0.3), rgba(56, 189, 248, 0.1))',
                transition: 'height 1s linear',
                boxShadow: '0 0 60px rgba(56, 189, 248, 0.4), inset 0 0 60px rgba(56, 189, 248, 0.2)'
            }} />

            {/* Wave effects on top of pool - Multiple layers */}
            <div style={{
                position: 'absolute',
                bottom: `${poolHeight}%`,
                left: 0,
                width: '100%',
                height: '20px',
                transition: 'bottom 1s linear',
                overflow: 'hidden'
            }}>
                {/* Wave layer 1 */}
                <div style={{
                    position: 'absolute',
                    width: '200%',
                    height: '100%',
                    background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.4) 0%, transparent 70%)',
                    animation: 'wave 3s ease-in-out infinite'
                }} />

                {/* Wave layer 2 */}
                <div style={{
                    position: 'absolute',
                    width: '200%',
                    height: '100%',
                    background: 'radial-gradient(ellipse at center, rgba(56, 189, 248, 0.3) 0%, transparent 70%)',
                    animation: 'wave 4s ease-in-out infinite',
                    animationDelay: '0.5s'
                }} />

                {/* Shimmer on surface */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '3px',
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 3s linear infinite'
                }} />
            </div>

            <style>{`
                @keyframes fall {
                    to { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    );
};

export default KnowledgePool;
