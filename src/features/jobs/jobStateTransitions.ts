import type { JobItemStateKey } from '../../types/types';

export const JOB_STATE_TRANSITIONS: Record<JobItemStateKey, readonly JobItemStateKey[]> = {
    new: ['applied'],
    applied: ['rejected', 'accepted'],
    accepted: ['rejected'],
    rejected: [],
};

export const getNextJobStates = (state: JobItemStateKey): readonly JobItemStateKey[] =>
    JOB_STATE_TRANSITIONS[state];

export const canSetJobState = (from: JobItemStateKey, to: JobItemStateKey): boolean =>
    JOB_STATE_TRANSITIONS[from].includes(to);
