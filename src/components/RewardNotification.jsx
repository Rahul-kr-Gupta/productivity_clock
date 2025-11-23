import React from 'react';

const RewardNotification = () => {
    return (
        <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(30, 41, 59, 0.95)',
            padding: '2rem 4rem',
            borderRadius: '20px',
            border: '1px solid var(--gold-color)',
            textAlign: 'center',
            boxShadow: '0 0 50px rgba(251, 191, 36, 0.3)',
            zIndex: 100,
            animation: 'popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🪙</div>
            <h2 style={{ color: 'var(--gold-color)', fontSize: '2rem', marginBottom: '0.5rem' }}>+1 Coin!</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Keep up the great work!</p>

            <style>{`
        @keyframes popIn {
          from { transform: translate(-50%, -50%) scale(0.5); opacity: 0; }
          to { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default RewardNotification;
