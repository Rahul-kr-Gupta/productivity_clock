import React from 'react';

const RewardNotification = () => {
  // Generate confetti pieces
  const confettiColors = [
    'rgba(6, 182, 212, 0.8)',    // cyan
    'rgba(59, 130, 246, 0.8)',   // blue
    'rgba(139, 92, 246, 0.8)',   // purple
    'rgba(217, 70, 239, 0.8)',   // pink
    'rgba(251, 191, 36, 0.8)',   // gold
    'rgba(34, 197, 94, 0.8)'     // green
  ];

  const confetti = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
    left: Math.random() * 100,
    size: Math.random() * 8 + 4,
    delay: Math.random() * 0.3,
    duration: Math.random() * 1 + 2
  }));

  // Generate starburst rays
  const starburstRays = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    rotation: (i * 30) - 15
  }));

  return (
    <>
      {/* Confetti */}
      {confetti.map(piece => (
        <div
          key={piece.id}
          style={{
            position: 'fixed',
            top: '-20px',
            left: `${piece.left}%`,
            width: `${piece.size}px`,
            height: `${piece.size * 1.5}px`,
            backgroundColor: piece.color,
            borderRadius: '2px',
            animation: `confetti-fall ${piece.duration}s linear forwards`,
            animationDelay: `${piece.delay}s`,
            zIndex: 999,
            boxShadow: `0 0 10px ${piece.color}`
          }}
        />
      ))}

      {/* Main Notification */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(26, 31, 58, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '3rem 5rem',
        borderRadius: '30px',
        border: '3px solid transparent',
        backgroundImage: 'linear-gradient(rgba(26, 31, 58, 0.85), rgba(26, 31, 58, 0.85)), var(--gradient-gold)',
        backgroundOrigin: 'border-box',
        backgroundClip: 'padding-box, border-box',
        textAlign: 'center',
        boxShadow: '0 0 80px rgba(251, 191, 36, 0.4), inset 0 0 40px rgba(251, 191, 36, 0.1)',
        zIndex: 1000,
        animation: 'bounce-in 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        position: 'fixed'
      }}>
        {/* Starburst Background */}
        {starburstRays.map(ray => (
          <div
            key={ray.id}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '4px',
              height: '100px',
              background: 'linear-gradient(to bottom, rgba(251, 191, 36, 0.6), transparent)',
              transformOrigin: 'top center',
              transform: `translate(-50%, -50%) rotate(${ray.rotation}deg)`,
              animation: 'starburst 1s ease-out forwards',
              borderRadius: '2px'
            }}
          />
        ))}

        {/* Coin Icon with Flip Animation */}
        <div style={{
          fontSize: '5rem',
          marginBottom: '1.5rem',
          animation: 'coin-flip 1s ease-in-out',
          filter: 'drop-shadow(0 0 20px rgba(251, 191, 36, 0.6))',
          position: 'relative',
          zIndex: 2
        }}>
          🪙
        </div>

        {/* Text Content */}
        <h2 style={{
          background: 'var(--gradient-gold)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          fontSize: '2.5rem',
          marginBottom: '0.75rem',
          fontWeight: '800',
          letterSpacing: '1px',
          position: 'relative',
          zIndex: 2
        }}>
          +1 Coin Earned!
        </h2>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1.2rem',
          fontWeight: '300',
          position: 'relative',
          zIndex: 2
        }}>
          ✨ Keep up the amazing work! ✨
        </p>

        {/* Glow Pulse Effect */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '120%',
          height: '120%',
          borderRadius: '30px',
          background: 'radial-gradient(circle, rgba(251, 191, 36, 0.2), transparent)',
          animation: 'pulse-glow 2s ease-in-out infinite',
          zIndex: -1,
          pointerEvents: 'none'
        }} />
      </div>
    </>
  );
};

export default RewardNotification;
