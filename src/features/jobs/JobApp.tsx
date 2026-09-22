import { useState } from 'react';
import type { JobFilter as JobFilterValue } from '../../types/types';
import { JobFilter } from './JobFilter';
import { JobInput } from './JobInput';
import { JobList } from './JobList';
import './JobApp.css';

export const JobApp = () => {
    const [filters, setFilters] = useState<JobFilterValue>([]);

    return (
        <div className="jobApp">
            <div className="jobAppHeader">
                <h2>JOBS management</h2>
                <JobInput />
            </div>
            <JobFilter value={filters} onChange={setFilters} />
            <JobList filter={filters} />
        </div>
    );
};
