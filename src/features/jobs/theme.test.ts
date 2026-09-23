import { describe, expect, it } from 'vitest';
import { applyTheme, getPreferredTheme, THEME_STORAGE_KEY, toggleTheme } from './theme';

describe('theme', () => {
    it('reads a stored theme preference', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');

        expect(getPreferredTheme()).toBe('dark');
    });

    it('applies theme to the document element and storage', () => {
        applyTheme('light');

        expect(document.documentElement.dataset.theme).toBe('light');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });

    it('toggles light and dark', () => {
        expect(toggleTheme('light')).toBe('dark');
        expect(toggleTheme('dark')).toBe('light');
    });
});
