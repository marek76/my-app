import type { JobFilter, JobItem } from '../../types/types';

export const filterJobs = (jobs: JobItem[], filters: JobFilter): JobItem[] => {
    if (filters.length === 0) {
        return jobs;
    }

    return jobs.filter((job) => filters.includes(job.state));
};
