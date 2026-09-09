import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { JobStateSelect } from './JobStateSelect';

describe('JobStateSelect', () => {
    it('opens a dropdown with Applied when the current state is New', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(
            <JobStateSelect companyName="Acme" state="new" onSelect={onSelect} />,
        );

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));

        expect(screen.getByRole('menuitem', { name: 'Applied' })).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Rejected' })).not.toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Accepted' })).not.toBeInTheDocument();
    });

    it('opens a dropdown with Rejected and Accepted when the current state is Applied', async () => {
        const user = userEvent.setup();

        render(
            <JobStateSelect companyName="Acme" state="applied" onSelect={vi.fn()} />,
        );

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));

        expect(screen.getByRole('menuitem', { name: 'Rejected' })).toBeInTheDocument();
        expect(screen.getByRole('menuitem', { name: 'Accepted' })).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Applied' })).not.toBeInTheDocument();
    });

    it('opens a dropdown with Rejected when the current state is Accepted', async () => {
        const user = userEvent.setup();

        render(
            <JobStateSelect companyName="Acme" state="accepted" onSelect={vi.fn()} />,
        );

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));

        expect(screen.getByRole('menuitem', { name: 'Rejected' })).toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Applied' })).not.toBeInTheDocument();
        expect(screen.queryByRole('menuitem', { name: 'Accepted' })).not.toBeInTheDocument();
    });

    it('renders rejected as plain text without a dropdown', () => {
        render(
            <JobStateSelect companyName="Acme" state="rejected" onSelect={vi.fn()} />,
        );

        expect(screen.getByText('Rejected')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Set status of Acme' })).not.toBeInTheDocument();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('calls onSelect with the chosen state and closes the menu', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();

        render(
            <JobStateSelect companyName="Acme" state="new" onSelect={onSelect} />,
        );

        await user.click(screen.getByRole('button', { name: 'Set status of Acme' }));
        await user.click(screen.getByRole('menuitem', { name: 'Applied' }));

        expect(onSelect).toHaveBeenCalledOnce();
        expect(onSelect).toHaveBeenCalledWith('applied');
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });
});
