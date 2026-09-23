import { useState } from 'react';
import type { ColumnVisibility, JobItemStateKey } from '../../types/types';
import { JobFilter } from './JobFilter';
import { JobInput } from './JobInput';
import { JobList } from './JobList';
import { ThemeToggle } from './ThemeToggle';
import './JobApp.css';

export const ALL_COLUMNS_VISIBLE: ColumnVisibility = {
    new: true,
    applied: true,
    accepted: true,
    rejected: true,
};

export const JobApp = () => {
    const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>(ALL_COLUMNS_VISIBLE);

    const setColumnVisible = (column: JobItemStateKey, visible: boolean) => {
        setColumnVisibility((current) => ({
            ...current,
            [column]: visible,
        }));
    };

    return (
        <div className="jobApp">
            <div className="jobAppHeader">
                <h2>JOBS management</h2>
                <div className="jobAppHeaderActions">
                    <ThemeToggle />
                    <JobInput />
                </div>
            </div>
            <JobFilter onShowAll={() => setColumnVisibility(ALL_COLUMNS_VISIBLE)} />
            <JobList
                columnVisibility={columnVisibility}
                onColumnVisibilityChange={setColumnVisible}
            />
        </div>
    );
};
