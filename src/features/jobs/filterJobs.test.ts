import { describe, expect, it } from 'vitest';
import { filterJobs } from './filterJobs';
import type { JobItem } from '../../types/types';

const openDate = new Date('2026-09-01T00:00:00');
const submissionDate = new Date('2026-09-09T00:00:00');

const jobs: JobItem[] = [
    {
        id: 1,
        companyName: 'New Co',
        position: 'Dev',
        description: '',
        openDate,
        submissionDate,
        state: 'new',
    },
    {
        id: 2,
        companyName: 'Applied Co',
        position: 'Dev',
        description: '',
        openDate,
        submissionDate,
        state: 'applied',
    },
    {
        id: 3,
        companyName: 'Accepted Co',
        position: 'Dev',
        description: '',
        openDate,
        submissionDate,
        state: 'accepted',
    },
    {
        id: 4,
        companyName: 'Rejected Co',
        position: 'Dev',
        description: '',
        openDate,
        submissionDate,
        state: 'rejected',
    },
];

describe('filterJobs', () => {
    it('returns all jobs for filter "all"', () => {
        expect(filterJobs(jobs, 'all')).toEqual(jobs);
    });

    it('returns only new jobs for filter "new"', () => {
        expect(filterJobs(jobs, 'new')).toEqual([jobs[0]]);
    });

    it('returns only applied jobs for filter "applied"', () => {
        expect(filterJobs(jobs, 'applied')).toEqual([jobs[1]]);
    });

    it('returns only accepted jobs for filter "accepted"', () => {
        expect(filterJobs(jobs, 'accepted')).toEqual([jobs[2]]);
    });

    it('returns only rejected jobs for filter "rejected"', () => {
        expect(filterJobs(jobs, 'rejected')).toEqual([jobs[3]]);
    });
});
