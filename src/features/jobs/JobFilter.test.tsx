import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JobFilter } from './JobFilter';

describe('JobFilter', () => {
    it('renders a Show all button', () => {
        render(<JobFilter onShowAll={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'Show all' })).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'New' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Applied' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Accepted' })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Rejected' })).not.toBeInTheDocument();
    });

    it('calls onShowAll when Show all is clicked', () => {
        const onShowAll = vi.fn();

        render(<JobFilter onShowAll={onShowAll} />);

        fireEvent.click(screen.getByRole('button', { name: 'Show all' }));

        expect(onShowAll).toHaveBeenCalledTimes(1);
    });
});
