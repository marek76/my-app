import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { JobProvider } from '../../context/JobProvider';
import { JobList } from './JobList';

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
});
