export type Theme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'job_app_theme';

export const getPreferredTheme = (): Theme => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);

    if (stored === 'light' || stored === 'dark') {
        return stored;
    }

    if (typeof window.matchMedia !== 'function') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme: Theme): void => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const toggleTheme = (theme: Theme): Theme => (theme === 'light' ? 'dark' : 'light');
