import type { JobFilter as JobFilterValue } from '../../types/types';
import { JobItemState } from '../../types/types';
import './JobFilter.css';

const FILTERS: { value: JobFilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'new', label: JobItemState.new },
    { value: 'applied', label: JobItemState.applied },
    { value: 'accepted', label: JobItemState.accepted },
    { value: 'rejected', label: JobItemState.rejected },
];

type JobFilterProps = {
    value: JobFilterValue;
    onChange: (filter: JobFilterValue) => void;
};

export const JobFilter = ({ value, onChange }: JobFilterProps) => {
    return (
        <div className="jobFilter" role="group" aria-label="Filter jobs by status">
            {FILTERS.map((filter) => (
                <button
                    key={filter.value}
                    type="button"
                    className={value === filter.value ? 'isActive' : undefined}
                    aria-pressed={value === filter.value}
                    onClick={() => onChange(filter.value)}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};
