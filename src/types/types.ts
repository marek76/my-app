export const JobItemState = {
    new: 'New',
    applied: 'Applied',
    accepted: 'Accepted',
    rejected: 'Rejected',
} as const;

export type JobItemState = typeof JobItemState[keyof typeof JobItemState];
export type JobItemStateKey = keyof typeof JobItemState;

export type JobItemFields = {
    companyName: string;
    position: string;
    description: string;
    openDate: Date;
    submissionDate: Date;
};

export type JobItem = JobItemFields & {
    id: number;
    state: JobItemStateKey;
};

export type JobFilter = 'all' | JobItemStateKey;

export type JobState = {
    jobs: JobItem[];
};

export type JobAction =
    | { type: 'NEW_ITEM'; payload: JobItemFields }
    | { type: 'DELETE_ITEM'; payload: number }
    | { type: 'UPDATE_ITEM'; payload: JobItemFields & { id: number } };
