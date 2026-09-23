import { useEffect, useState } from 'react';
import { applyTheme, getPreferredTheme, toggleTheme, type Theme } from './theme';
import './ThemeToggle.css';

export const ThemeToggle = () => {
    const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const nextTheme = toggleTheme(theme);

    return (
        <button
            type="button"
            className="themeToggle"
            aria-label={`Switch to ${nextTheme} theme`}
            onClick={() => setTheme(nextTheme)}
        >
            {nextTheme === 'dark' ? 'Dark' : 'Light'}
        </button>
    );
};
