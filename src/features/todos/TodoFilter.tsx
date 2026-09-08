import type { TodoFilter as TodoFilterValue } from '../../types/types';
import './TodoFilter.css';

const FILTERS: { value: TodoFilterValue; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
];

type TodoFilterProps = {
    value: TodoFilterValue;
    onChange: (filter: TodoFilterValue) => void;
};

export const TodoFilter = ({ value, onChange }: TodoFilterProps) => {
    return (
        <div className="todoFilter" role="group" aria-label="Filter todos by status">
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
