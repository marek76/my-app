import './JobFilter.css';

type JobFilterProps = {
    onShowAll: () => void;
};

export const JobFilter = ({ onShowAll }: JobFilterProps) => (
    <div className="jobFilter" role="group" aria-label="Column visibility">
        <button type="button" onClick={onShowAll}>
            Show all
        </button>
    </div>
);
