import { useState } from 'react';
import type { JobFilter as JobFilterValue } from '../../types/types';
import { JobFilter } from './JobFilter';
import { JobInput } from './JobInput';
import { JobList } from './JobList';
import './JobApp.css';

export const JobApp = () => {
    const [filter, setFilter] = useState<JobFilterValue>('all');

    return (
        <div className="jobApp">
            <div className="jobAppHeader">
                <h2>JOBS management</h2>
                <JobInput />
            </div>
            <JobFilter value={filter} onChange={setFilter} />
            <JobList filter={filter} />
        </div>
    );
};
