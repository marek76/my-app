import { useEffect, useReducer, type ReactNode } from 'react';
import { jobReducer } from '../features/jobs/jobReducer';
import { parseStoredDate } from '../features/jobs/jobDates';
import type { JobItem, JobItemStateKey, JobState } from '../types/types';
import { JobContext } from './jobContext';

const STORAGE_KEY = 'job_app_items';

const isJobItemStateKey = (value: unknown): value is JobItemStateKey =>
    value === 'new' || value === 'applied' || value === 'accepted' || value === 'rejected';

const normalizeJobs = (value: unknown): JobItem[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.flatMap((item, index) => {
        if (typeof item !== 'object' || item === null) {
            return [];
        }

        const candidate = item as {
            id?: unknown;
            companyName?: unknown;
            name?: unknown;
            position?: unknown;
            description?: unknown;
            openDate?: unknown;
            submissionDate?: unknown;
            state?: unknown;
        };

        const companyName = typeof candidate.companyName === 'string'
            ? candidate.companyName
            : typeof candidate.name === 'string'
                ? candidate.name
                : '';
        const position = typeof candidate.position === 'string' ? candidate.position : '';
        const openDate = parseStoredDate(candidate.openDate);

        if (!companyName || !position || openDate === null) {
            return [];
        }

        const state: JobItemStateKey = isJobItemStateKey(candidate.state)
            ? candidate.state
            : 'new';

        return [{
            id: typeof candidate.id === 'number' ? candidate.id : index + 1,
            companyName,
            position,
            description: typeof candidate.description === 'string' ? candidate.description : '',
            openDate,
            submissionDate: parseStoredDate(candidate.submissionDate),
            state,
        }];
    });
};

const loadInitialState = (): JobState => {
    try {
        const savedJobs = localStorage.getItem(STORAGE_KEY);
        if (savedJobs) {
            return { jobs: normalizeJobs(JSON.parse(savedJobs)) };
        }
    } catch (error) {
        console.error('Failed to load jobs from localStorage:', error);
    }

    return { jobs: [] };
};

export const JobProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(jobReducer, null, loadInitialState);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.jobs));
        } catch (error) {
            console.error('Failed to save jobs to localStorage:', error);
        }
    }, [state.jobs]);

    return (
        <JobContext.Provider value={{ state, dispatch }}>
            {children}
        </JobContext.Provider>
    );
};
