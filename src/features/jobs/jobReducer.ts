import type { JobAction, JobItem, JobItemFields, JobState } from '../../types/types';
import { cloneDate, todayDate } from './jobDates';
import { canSetJobState } from './jobStateTransitions';

const nextJobId = (jobs: JobItem[]): number => {
    if (jobs.length === 0) {
        return 1;
    }

    return Math.max(...jobs.map((job) => job.id)) + 1;
};

const normalizeJobFields = (fields: JobItemFields): JobItemFields | null => {
    const companyName = fields.companyName.trim();
    const position = fields.position.trim();
    const openDate = cloneDate(fields.openDate);
    const submissionDate = fields.submissionDate === null
        ? null
        : cloneDate(fields.submissionDate);

    if (!companyName || !position || openDate === null) {
        return null;
    }

    return {
        companyName,
        position,
        description: fields.description.trim(),
        openDate,
        submissionDate,
    };
};

export const jobReducer = (state: JobState, action: JobAction): JobState => {
    switch (action.type) {
        case 'NEW_ITEM': {
            const fields = normalizeJobFields(action.payload);
            if (fields === null) {
                return state;
            }

            const newJob: JobItem = {
                id: nextJobId(state.jobs),
                ...fields,
                state: 'new',
            };

            return {
                ...state,
                jobs: [...state.jobs, newJob],
            };
        }
        case 'DELETE_ITEM': {
            return {
                ...state,
                jobs: state.jobs.filter((job) => job.id !== action.payload),
            };
        }
        case 'UPDATE_ITEM': {
            const fields = normalizeJobFields(action.payload);
            if (fields === null) {
                return state;
            }

            return {
                ...state,
                jobs: state.jobs.map((job) => {
                    if (job.id !== action.payload.id) {
                        return job;
                    }

                    return {
                        ...job,
                        ...fields,
                    };
                }),
            };
        }
        case 'SET_STATE': {
            const job = state.jobs.find((item) => item.id === action.payload.id);
            if (!job || !canSetJobState(job.state, action.payload.state)) {
                return state;
            }

            return {
                ...state,
                jobs: state.jobs.map((item) => {
                    if (item.id !== action.payload.id) {
                        return item;
                    }

                    return {
                        ...item,
                        state: action.payload.state,
                        submissionDate: action.payload.state === 'applied'
                            ? todayDate()
                            : item.submissionDate,
                    };
                }),
            };
        }
        default:
            return state;
    }
};
