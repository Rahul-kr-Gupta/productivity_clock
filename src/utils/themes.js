// Theme definitions and configurations

export const THEMES = {
    dark: {
        name: 'Dark',
        colors: {
            bgPrimary: '#0a0e27',
            bgSecondary: '#1a1f3a',
            textPrimary: '#f8fafc',
            textSecondary: '#94a3b8',
        }
    },
    light: {
        name: 'Light',
        colors: {
            bgPrimary: '#f8fafc',
            bgSecondary: '#e2e8f0',
            textPrimary: '#1e293b',
            textSecondary: '#64748b',
        }
    }
};

export const COLOR_SCHEMES = {
    default: {
        name: 'Ocean',
        gradient1: '#06b6d4',
        gradient2: '#3b82f6',
        gradient3: '#8b5cf6',
        gradient4: '#d946ef',
        accentColor: '#38bdf8',
        goldColor: '#fbbf24',
    },
    forest: {
        name: 'Forest',
        gradient1: '#10b981',
        gradient2: '#059669',
        gradient3: '#047857',
        gradient4: '#065f46',
        accentColor: '#34d399',
        goldColor: '#fbbf24',
    },
    sunset: {
        name: 'Sunset',
        gradient1: '#f59e0b',
        gradient2: '#f97316',
        gradient3: '#ef4444',
        gradient4: '#dc2626',
        accentColor: '#fb923c',
        goldColor: '#fbbf24',
    },
    purple: {
        name: 'Purple Dream',
        gradient1: '#a78bfa',
        gradient2: '#8b5cf6',
        gradient3: '#7c3aed',
        gradient4: '#6d28d9',
        accentColor: '#c084fc',
        goldColor: '#fbbf24',
    }
};

export const applyTheme = (theme, colorScheme) => {
    const root = document.documentElement;
    const themeColors = THEMES[theme].colors;
    const schemeColors = COLOR_SCHEMES[colorScheme];

    // Apply theme colors
    root.style.setProperty('--bg-primary', themeColors.bgPrimary);
    root.style.setProperty('--bg-secondary', themeColors.bgSecondary);
    root.style.setProperty('--text-primary', themeColors.textPrimary);
    root.style.setProperty('--text-secondary', themeColors.textSecondary);

    // Apply color scheme
    root.style.setProperty('--gradient-1', schemeColors.gradient1);
    root.style.setProperty('--gradient-2', schemeColors.gradient2);
    root.style.setProperty('--gradient-3', schemeColors.gradient3);
    root.style.setProperty('--gradient-4', schemeColors.gradient4);
    root.style.setProperty('--accent-color', schemeColors.accentColor);
    root.style.setProperty('--gold-color', schemeColors.goldColor);

    // Update gradients
    const gradient1 = `linear-gradient(135deg, ${schemeColors.gradient1}, ${schemeColors.gradient2}, ${schemeColors.gradient3})`;
    const gradient2 = `linear-gradient(135deg, ${schemeColors.gradient2}, ${schemeColors.gradient3}, ${schemeColors.gradient4})`;
    const gradient3 = `linear-gradient(135deg, ${schemeColors.goldColor}, #f59e0b, #d97706)`;

    root.style.setProperty('--gradient-primary', gradient1);
    root.style.setProperty('--gradient-accent', gradient2);
    root.style.setProperty('--gradient-gold', gradient3);
};
