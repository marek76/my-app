import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JobProvider } from '../../context/JobProvider';
import { JobApp } from './JobApp';
import { THEME_STORAGE_KEY } from './theme';

describe('JobApp', () => {
    beforeEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    afterEach(() => {
        localStorage.clear();
        document.documentElement.removeAttribute('data-theme');
    });

    it('shows a theme toggle and Show all control', () => {
        render(
            <JobProvider>
                <JobApp />
            </JobProvider>,
        );

        expect(screen.getByRole('button', { name: /Switch to (light|dark) theme/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Show all' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'New' })).not.toBeInTheDocument();
    });

    it('hides column jobs via checkbox and restores them with Show all', async () => {
        const user = userEvent.setup();
        localStorage.setItem('job_app_items', JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: null,
                state: 'new',
            },
        ]));

        render(
            <JobProvider>
                <JobApp />
            </JobProvider>,
        );

        expect(screen.getByText('Acme')).toBeInTheDocument();

        await user.click(screen.getByRole('checkbox', { name: 'Show New column' }));

        expect(screen.getByRole('region', { name: 'New' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Applied' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Accepted' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Rejected' })).toBeInTheDocument();
        expect(screen.queryByText('Acme')).not.toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Show New column' })).not.toBeChecked();

        await user.click(screen.getByRole('button', { name: 'Show all' }));

        expect(screen.getByText('Acme')).toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Show New column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Applied column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Accepted column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Rejected column' })).toBeChecked();
    });

    it('toggles the document theme from the header button', async () => {
        const user = userEvent.setup();
        localStorage.setItem(THEME_STORAGE_KEY, 'light');

        render(
            <JobProvider>
                <JobApp />
            </JobProvider>,
        );

        await user.click(screen.getByRole('button', { name: 'Switch to dark theme' }));

        expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    });
});
