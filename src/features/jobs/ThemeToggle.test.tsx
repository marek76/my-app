import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from './ThemeToggle';
import { THEME_STORAGE_KEY } from './theme';

describe('ThemeToggle', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    afterEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    it('applies the stored theme on mount', () => {
        localStorage.setItem(THEME_STORAGE_KEY, 'dark');

        render(<ThemeToggle />);

        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
        expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();
    });

    it('toggles between light and dark themes', async () => {
        const user = userEvent.setup();
        localStorage.setItem(THEME_STORAGE_KEY, 'light');

        render(<ThemeToggle />);

        await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
        expect(screen.getByRole('button', { name: 'Switch to light theme' })).toBeInTheDocument();

        await user.click(screen.getByRole('button', { name: 'Switch to light theme' }));

        expect(document.documentElement).toHaveAttribute('data-theme', 'light');
        expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
    });
});
