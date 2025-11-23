import React from 'react';
import { useProductivity } from '../../context/ProductivityContext';
import { THEMES, COLOR_SCHEMES } from '../../utils/themes';
import { exportSessionsToCSV, downloadCSV } from '../../utils/storage';

const SettingsPanel = () => {
    const { settings, updateSettings } = useProductivity();

    const handleThemeChange = (theme) => {
        updateSettings({ ...settings, theme });
    };

    const handleColorSchemeChange = (colorScheme) => {
        updateSettings({ ...settings, colorScheme });
    };

    const handleSoundToggle = () => {
        updateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
    };

    const handleVolumeChange = (e) => {
        updateSettings({ ...settings, volume: parseFloat(e.target.value) });
    };

    const handlePomodoroChange = (field, value) => {
        updateSettings({ ...settings, [field]: Math.max(1, parseInt(value) || 1) });
    };

    const handleExport = () => {
        const csv = exportSessionsToCSV();
        downloadCSV(csv);
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
                ⚙️ Settings
            </h2>

            {/* Appearance */}
            <Section title="🎨 Appearance">
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        display: 'block',
                        marginBottom: '0.75rem'
                    }}>
                        Theme
                    </label>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        {Object.keys(THEMES).map(theme => (
                            <button
                                key={theme}
                                onClick={() => handleThemeChange(theme)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    background: settings.theme === theme
                                        ? 'var(--gradient-primary)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {THEMES[theme].name}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{
                        color: 'var(--text-secondary)',
                        fontSize: '0.9rem',
                        display: 'block',
                        marginBottom: '0.75rem'
                    }}>
                        Color Scheme
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
                        {Object.keys(COLOR_SCHEMES).map(scheme => (
                            <button
                                key={scheme}
                                onClick={() => handleColorSchemeChange(scheme)}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    borderRadius: '12px',
                                    background: settings.colorScheme === scheme
                                        ? 'var(--gradient-primary)'
                                        : 'rgba(255, 255, 255, 0.05)',
                                    color: 'var(--text-primary)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {COLOR_SCHEMES[scheme].name}
                            </button>
                        ))}
                    </div>
                </div>
            </Section>

            {/* Sound */}
            <Section title="🔊 Sound">
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Sound Effects</span>
                        <button
                            onClick={handleSoundToggle}
                            style={{
                                padding: '0.5rem 1.5rem',
                                borderRadius: '20px',
                                background: settings.soundEnabled
                                    ? 'var(--gradient-primary)'
                                    : 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                cursor: 'pointer',
                                fontWeight: '600'
                            }}
                        >
                            {settings.soundEnabled ? 'ON' : 'OFF'}
                        </button>
                    </div>
                </div>

                {settings.soundEnabled && (
                    <div>
                        <label style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            display: 'block',
                            marginBottom: '0.75rem'
                        }}>
                            Volume: {Math.round(settings.volume * 100)}%
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={settings.volume}
                            onChange={handleVolumeChange}
                            style={{
                                width: '100%',
                                accentColor: 'var(--accent-color)'
                            }}
                        />
                    </div>
                )}
            </Section>

            {/* Pomodoro */}
            <Section title="🍅 Pomodoro Settings">
                <div style={{ display: 'grid', gap: '1rem' }}>
                    <div>
                        <label style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            Work Duration (minutes)
                        </label>
                        <input
                            type="number"
                            value={settings.pomodoroWork}
                            onChange={(e) => handlePomodoroChange('pomodoroWork', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            Short Break (minutes)
                        </label>
                        <input
                            type="number"
                            value={settings.pomodoroBreak}
                            onChange={(e) => handlePomodoroChange('pomodoroBreak', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.9rem',
                            display: 'block',
                            marginBottom: '0.5rem'
                        }}>
                            Long Break (minutes)
                        </label>
                        <input
                            type="number"
                            value={settings.pomodoroLongBreak}
                            onChange={(e) => handlePomodoroChange('pomodoroLongBreak', e.target.value)}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                borderRadius: '12px',
                                background: 'rgba(255, 255, 255, 0.05)',
                                color: 'var(--text-primary)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                </div>
            </Section>

            {/* Data Export */}
            <Section title="📥 Data Export">
                <button
                    onClick={handleExport}
                    style={{
                        width: '100%',
                        padding: '1rem',
                        borderRadius: '12px',
                        background: 'var(--gradient-primary)',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '1rem',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.02)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                    }}
                >
                    📊 Export Sessions to CSV
                </button>
            </Section>
        </div>
    );
};

const Section = ({ title, children }) => (
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
            {title}
        </h3>
        {children}
    </div>
);

export default SettingsPanel;
