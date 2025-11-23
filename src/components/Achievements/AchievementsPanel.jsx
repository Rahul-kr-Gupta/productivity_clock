import React from 'react';
import { useProductivity } from '../../context/ProductivityContext';

const AchievementsPanel = () => {
    const { achievements, stats } = useProductivity();

    const unlocked = achievements.filter(a => a.unlocked);
    const locked = achievements.filter(a => !a.unlocked);

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{
                fontSize: '2.5rem',
                fontWeight: '800',
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: '1rem',
                textAlign: 'center'
            }}>
                🏆 Achievements
            </h2>

            <div style={{
                textAlign: 'center',
                marginBottom: '3rem',
                color: 'var(--text-secondary)',
                fontSize: '1.1rem'
            }}>
                {unlocked.length} / {achievements.length} Unlocked
            </div>

            {/* Unlocked Achievements */}
            {unlocked.length > 0 && (
                <>
                    <h3 style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '1.5rem'
                    }}>
                        ✨ Unlocked
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '3rem'
                    }}>
                        {unlocked.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} unlocked={true} />
                        ))}
                    </div>
                </>
            )}

            {/* Locked Achievements */}
            {locked.length > 0 && (
                <>
                    <h3 style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.2rem',
                        fontWeight: '300',
                        letterSpacing: '1px',
                        marginBottom: '1.5rem'
                    }}>
                        🔒 Locked
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '1.5rem'
                    }}>
                        {locked.map(achievement => (
                            <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const AchievementCard = ({ achievement, unlocked }) => (
    <div style={{
        background: unlocked
            ? 'rgba(56, 189, 248, 0.1)'
            : 'rgba(255, 255, 255, 0.03)',
        borderRadius: '20px',
        padding: '2rem',
        border: unlocked
            ? '2px solid rgba(56, 189, 248, 0.3)'
            : '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        transition: 'all 0.3s ease',
        opacity: unlocked ? 1 : 0.6,
        boxShadow: unlocked
            ? '0 0 20px rgba(56, 189, 248, 0.2)'
            : 'none',
        position: 'relative',
        overflow: 'hidden'
    }}>
        {unlocked && (
            <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontSize: '1.5rem'
            }}>
                ✅
            </div>
        )}

        <div style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            filter: unlocked ? 'none' : 'grayscale(100%)'
        }}>
            {achievement.icon}
        </div>

        <h4 style={{
            color: 'var(--text-primary)',
            fontSize: '1.2rem',
            fontWeight: '700',
            marginBottom: '0.5rem'
        }}>
            {achievement.title}
        </h4>

        <p style={{
            color: 'var(--text-secondary)',
            fontSize: '0.9rem',
            lineHeight: '1.5'
        }}>
            {achievement.description}
        </p>

        {unlocked && achievement.unlockedDate && (
            <div style={{
                marginTop: '1rem',
                paddingTop: '1rem',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                fontSize: '0.75rem'
            }}>
                Unlocked: {new Date(achievement.unlockedDate).toLocaleDateString()}
            </div>
        )}
    </div>
);

export default AchievementsPanel;
