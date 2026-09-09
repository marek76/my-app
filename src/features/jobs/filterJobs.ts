import type { JobFilter, JobItem } from '../../types/types';

export const filterJobs = (jobs: JobItem[], filter: JobFilter): JobItem[] => {
    if (filter === 'all') {
        return jobs;
    }

    return jobs.filter((job) => job.state === filter);
};
