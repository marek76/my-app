import type { JobFilter as JobFilterValue, JobItemStateKey } from '../../types/types';
import { JobItemState } from '../../types/types';
import './JobFilter.css';

const STATUS_FILTERS: { value: JobItemStateKey; label: string }[] = [
    { value: 'new', label: JobItemState.new },
    { value: 'applied', label: JobItemState.applied },
    { value: 'accepted', label: JobItemState.accepted },
    { value: 'rejected', label: JobItemState.rejected },
];

type JobFilterProps = {
    value: JobFilterValue;
    onChange: (filters: JobFilterValue) => void;
};

export const JobFilter = ({ value, onChange }: JobFilterProps) => {
    const isAllActive = value.length === 0;

    const handleAllClick = () => {
        onChange([]);
    };

    const handleStatusClick = (status: JobItemStateKey) => {
        if (value.includes(status)) {
            onChange(value.filter((filter) => filter !== status));
            return;
        }

        onChange([...value, status]);
    };

    return (
        <div className="jobFilter" role="group" aria-label="Filter jobs by status">
            <button
                type="button"
                className={isAllActive ? 'isActive' : undefined}
                aria-pressed={isAllActive}
                onClick={handleAllClick}
            >
                All
            </button>
            {STATUS_FILTERS.map((filter) => {
                const isActive = value.includes(filter.value);

                return (
                    <button
                        key={filter.value}
                        type="button"
                        className={isActive ? 'isActive' : undefined}
                        aria-pressed={isActive}
                        onClick={() => handleStatusClick(filter.value)}
                    >
                        {filter.label}
                    </button>
                );
            })}
        </div>
    );
};
