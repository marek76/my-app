import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JobProvider } from '../../context/JobProvider';
import { JobList } from './JobList';
import { todayDateInputValue } from './jobDates';

const STORAGE_KEY = 'job_app_items';

const renderJobList = () => render(
    <JobProvider>
        <JobList filter="all" />
    </JobProvider>,
);

describe('JobList', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('hides submission date when it is missing', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
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

        renderJobList();

        expect(screen.getByText('Acme')).toBeInTheDocument();
        expect(screen.getByText('Frontend developer')).toBeInTheDocument();
        expect(screen.getByText(/Open /)).toBeInTheDocument();
        expect(screen.queryByText(/Submit /)).not.toBeInTheDocument();
    });

    it('shows submission date when it is present', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: '2026-09-09T00:00:00',
                state: 'new',
            },
        ]));

        renderJobList();

        expect(screen.getByText(/Submit /)).toBeInTheDocument();
    });

    it('changes a new job to applied and sets the submission date to today', async () => {
        const user = userEvent.setup();
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
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

        renderJobList();

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));
        await user.click(screen.getByRole('menuitem', { name: 'Applied' }));

        expect(screen.getByRole('button', { name: 'Set status of Acme' })).toHaveTextContent('Applied');
        expect(screen.getByText(new RegExp(`Submit ${todayDateInputValue()}`))).toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')[0]).toMatchObject({
            state: 'applied',
        });
    });

    it('lets an applied job change to accepted or rejected', async () => {
        const user = userEvent.setup();
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: '2026-09-09T00:00:00',
                state: 'applied',
            },
        ]));

        renderJobList();

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));

        expect(screen.getByRole('menuitem', { name: 'Rejected' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Accepted' })).toBeInTheDocument();

        await user.click(screen.getByRole('menuitem', { name: 'Accepted' }));

        expect(screen.getByRole('button', { name: 'Set status of Acme' })).toHaveTextContent('Accepted');
    });

    it('lets an accepted job change to rejected', async () => {
        const user = userEvent.setup();
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: '2026-09-09T00:00:00',
                state: 'accepted',
            },
        ]));

        renderJobList();

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));
        await user.click(screen.getByRole('menuitem', { name: 'Rejected' }));

        expect(screen.getByText('Rejected')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Set status of Acme' })).not.toBeInTheDocument();
    });

    it('renders a separator between jobs', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: null,
                state: 'new',
            },
            {
                id: 2,
                companyName: 'Globex',
                position: 'Backend developer',
                description: '',
                openDate: '2026-09-02T00:00:00',
                submissionDate: null,
                state: 'new',
            },
        ]));

        const { container } = renderJobList();
        const items = container.querySelectorAll('.jobItem');

        expect(items).toHaveLength(2);
        expect(getComputedStyle(items[1]).borderTopWidth).not.toBe('0px');
    });
});
