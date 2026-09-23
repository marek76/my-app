import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { JobProvider } from '../../context/JobProvider';
import type { ColumnVisibility } from '../../types/types';
import { JobList } from './JobList';
import { todayDateInputValue } from './jobDates';

const STORAGE_KEY = 'job_app_items';

const ALL_VISIBLE: ColumnVisibility = {
    new: true,
    applied: true,
    accepted: true,
    rejected: true,
};

const createDataTransfer = () => {
    const store: Record<string, string> = {};

    return {
        effectAllowed: 'all' as string,
        dropEffect: 'move' as string,
        setData: (format: string, value: string) => {
            store[format] = value;
        },
        getData: (format: string) => store[format] ?? '',
    };
};

const dragJobToColumn = (jobName: string, columnName: string) => {
    const dataTransfer = createDataTransfer();
    const jobItem = screen.getByText(jobName).closest('.jobItem');
    const column = screen.getByRole('region', { name: columnName });

    expect(jobItem).not.toBeNull();

    fireEvent.dragStart(jobItem!, { dataTransfer });
    fireEvent.dragOver(column, { dataTransfer });
    fireEvent.drop(column, { dataTransfer });
    fireEvent.dragEnd(jobItem!, { dataTransfer });
};

const renderJobList = (
    columnVisibility: ColumnVisibility = ALL_VISIBLE,
    onColumnVisibilityChange = vi.fn(),
) => render(
    <JobProvider>
        <JobList
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={onColumnVisibilityChange}
        />
    </JobProvider>,
);

describe('JobList', () => {
    beforeEach(() => {
        localStorage.clear();
    });

    afterEach(() => {
        localStorage.clear();
    });

    it('displays jobs in four status columns', () => {
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
                submissionDate: '2026-09-03T00:00:00',
                state: 'applied',
            },
            {
                id: 3,
                companyName: 'Initech',
                position: 'Full stack developer',
                description: '',
                openDate: '2026-09-04T00:00:00',
                submissionDate: '2026-09-05T00:00:00',
                state: 'accepted',
            },
            {
                id: 4,
                companyName: 'Umbrella',
                position: 'QA engineer',
                description: '',
                openDate: '2026-09-06T00:00:00',
                submissionDate: '2026-09-07T00:00:00',
                state: 'rejected',
            },
        ]));

        renderJobList();

        const newColumn = screen.getByRole('region', { name: 'New' });
        const appliedColumn = screen.getByRole('region', { name: 'Applied' });
        const acceptedColumn = screen.getByRole('region', { name: 'Accepted' });
        const rejectedColumn = screen.getByRole('region', { name: 'Rejected' });

        expect(within(newColumn).getByText('Acme')).toBeInTheDocument();
        expect(within(appliedColumn).getByText('Globex')).toBeInTheDocument();
        expect(within(acceptedColumn).getByText('Initech')).toBeInTheDocument();
        expect(within(rejectedColumn).getByText('Umbrella')).toBeInTheDocument();
    });

    it('keeps empty status columns visible', () => {
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
                submissionDate: '2026-09-03T00:00:00',
                state: 'applied',
            },
        ]));

        renderJobList();

        expect(screen.getByRole('region', { name: 'New' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Applied' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Accepted' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Rejected' })).toBeInTheDocument();
    });

    it('renders checked visibility checkboxes by default', () => {
        renderJobList();

        expect(screen.getByRole('checkbox', { name: 'Show New column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Applied column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Accepted column' })).toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Rejected column' })).toBeChecked();
    });

    it('hides column jobs when its visibility checkbox is unchecked', async () => {
        const user = userEvent.setup();
        const onColumnVisibilityChange = vi.fn();
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

        renderJobList(ALL_VISIBLE, onColumnVisibilityChange);

        await user.click(screen.getByRole('checkbox', { name: 'Show New column' }));

        expect(onColumnVisibilityChange).toHaveBeenCalledWith('new', false);
    });

    it('keeps filtered-out columns visible without their jobs', () => {
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
                submissionDate: '2026-09-03T00:00:00',
                state: 'applied',
            },
        ]));

        renderJobList({
            new: true,
            applied: false,
            accepted: true,
            rejected: false,
        });

        expect(screen.getByRole('region', { name: 'New' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Applied' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Accepted' })).toBeInTheDocument();
        expect(screen.getByRole('region', { name: 'Rejected' })).toBeInTheDocument();
        expect(within(screen.getByRole('region', { name: 'New' })).getByText('Acme')).toBeInTheDocument();
        expect(within(screen.getByRole('region', { name: 'Applied' })).queryByText('Globex')).not.toBeInTheDocument();
        expect(screen.getByRole('checkbox', { name: 'Show Applied column' })).not.toBeChecked();
        expect(screen.getByRole('checkbox', { name: 'Show Rejected column' })).not.toBeChecked();
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
        expect(within(screen.getByRole('region', { name: 'Applied' })).getByText('Acme')).toBeInTheDocument();
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

        expect(within(screen.getByRole('region', { name: 'Rejected' })).getByText('Acme')).toBeInTheDocument();
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

    it('renders a clickable job link that opens in a new window', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                link: 'https://example.com/jobs/acme',
                openDate: '2026-09-01T00:00:00',
                submissionDate: null,
                state: 'new',
            },
        ]));

        renderJobList();

        const link = screen.getByRole('link', { name: 'https://example.com/jobs/acme' });
        expect(link).toHaveAttribute('href', 'https://example.com/jobs/acme');
        expect(link).toHaveAttribute('target', '_blank');
        expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });

    it('hides the job link when it is empty', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                link: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: null,
                state: 'new',
            },
        ]));

        renderJobList();

        expect(screen.queryByRole('link')).not.toBeInTheDocument();
    });

    it('moves a job to another column by drag and drop when the transition is allowed', () => {
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

        dragJobToColumn('Acme', 'Applied');

        expect(within(screen.getByRole('region', { name: 'Applied' })).getByText('Acme')).toBeInTheDocument();
        expect(within(screen.getByRole('region', { name: 'New' })).queryByText('Acme')).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')[0]).toMatchObject({
            state: 'applied',
        });
        expect(screen.getByText(new RegExp(`Submit ${todayDateInputValue()}`))).toBeInTheDocument();
    });

    it('does not move a job when the state transition is not allowed', () => {
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

        dragJobToColumn('Acme', 'Accepted');

        expect(within(screen.getByRole('region', { name: 'New' })).getByText('Acme')).toBeInTheDocument();
        expect(within(screen.getByRole('region', { name: 'Accepted' })).queryByText('Acme')).not.toBeInTheDocument();
        expect(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')[0]).toMatchObject({
            state: 'new',
        });
    });

    it('does not allow dragging a rejected job', () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([
            {
                id: 1,
                companyName: 'Acme',
                position: 'Frontend developer',
                description: '',
                openDate: '2026-09-01T00:00:00',
                submissionDate: '2026-09-09T00:00:00',
                state: 'rejected',
            },
        ]));

        renderJobList();

        const jobItem = screen.getByText('Acme').closest('.jobItem');
        expect(jobItem).toHaveAttribute('draggable', 'false');
    });
});
