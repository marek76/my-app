import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { JobFilter } from './JobFilter';

describe('JobFilter', () => {
    it('marks All as active when no status filters are selected', () => {
        render(<JobFilter value={[]} onChange={vi.fn()} />);

        expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
        expect(screen.getByRole('button', { name: 'New' })).toHaveAttribute('aria-pressed', 'false');
    });

    it('resets filters to empty when All is clicked', () => {
        const onChange = vi.fn();

        render(<JobFilter value={['new', 'applied']} onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'All' }));

        expect(onChange).toHaveBeenCalledWith([]);
    });

    it('adds a status filter when it is clicked', () => {
        const onChange = vi.fn();

        render(<JobFilter value={['new']} onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'Applied' }));

        expect(onChange).toHaveBeenCalledWith(['new', 'applied']);
    });

    it('removes a status filter when an active status is clicked', () => {
        const onChange = vi.fn();

        render(<JobFilter value={['new', 'applied']} onChange={onChange} />);

        fireEvent.click(screen.getByRole('button', { name: 'New' }));

        expect(onChange).toHaveBeenCalledWith(['applied']);
    });
});
