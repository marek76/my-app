import { createContext, type Dispatch } from 'react';
import type { JobAction, JobState } from '../types/types';

export type JobStore = {
    state: JobState;
    dispatch: Dispatch<JobAction>;
};

export const JobContext = createContext<JobStore | undefined>(undefined);
