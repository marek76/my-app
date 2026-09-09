import { afterEach, describe, expect, it, vi } from 'vitest';
import { jobReducer } from './jobReducer';
import type { JobAction, JobItem, JobItemFields, JobState } from '../../types/types';

const openDate = new Date('2026-09-01T00:00:00');
const submissionDate = new Date('2026-09-09T00:00:00');

const jobFields = (overrides: Partial<JobItemFields> = {}): JobItemFields => ({
    companyName: 'Acme',
    position: 'Frontend developer',
    description: '',
    openDate,
    submissionDate,
    ...overrides,
});

const createJob = (overrides: Partial<JobItem> = {}): JobItem => ({
    id: 1,
    ...jobFields(),
    state: 'new',
    ...overrides,
});

describe('jobReducer', () => {
    describe('NEW_ITEM', () => {
        it('creates a job with company, position, dates, state "new", and id 1 on empty list', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: 'Globex',
                    position: 'Backend developer',
                    description: 'Remote role',
                }),
            });

            expect(nextState.jobs).toEqual([
                {
                    id: 1,
                    companyName: 'Globex',
                    position: 'Backend developer',
                    description: 'Remote role',
                    openDate,
                    submissionDate,
                    state: 'new',
                },
            ]);
        });

        it('creates a job with empty description when description is blank', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: 'Initech',
                    position: 'QA engineer',
                    description: '',
                }),
            });

            expect(nextState.jobs[0]).toMatchObject({
                companyName: 'Initech',
                position: 'QA engineer',
                description: '',
                state: 'new',
            });
        });

        it('trims company name, position, and description before saving', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: '  Initech  ',
                    position: '  QA engineer  ',
                    description: '  morning slot  ',
                }),
            });

            expect(nextState.jobs).toEqual([
                {
                    id: 1,
                    companyName: 'Initech',
                    position: 'QA engineer',
                    description: 'morning slot',
                    openDate,
                    submissionDate,
                    state: 'new',
                },
            ]);
        });

        it('appends a new job without changing existing ones', () => {
            const existing = createJob({
                id: 1,
                companyName: 'First',
                position: 'Designer',
                description: 'Keep',
            });
            const state: JobState = { jobs: [existing] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: 'Second',
                    position: 'PM',
                    description: 'New notes',
                }),
            });

            expect(nextState.jobs).toEqual([
                existing,
                {
                    id: 2,
                    companyName: 'Second',
                    position: 'PM',
                    description: 'New notes',
                    openDate,
                    submissionDate,
                    state: 'new',
                },
            ]);
        });

        it('assigns autoincremented id based on the highest existing id', () => {
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'First' }),
                    createJob({ id: 5, companyName: 'Fifth' }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: 'Next job',
                    position: 'Analyst',
                    description: 'Details',
                }),
            });

            expect(nextState.jobs.at(-1)).toEqual({
                id: 6,
                companyName: 'Next job',
                position: 'Analyst',
                description: 'Details',
                openDate,
                submissionDate,
                state: 'new',
            });
        });

        it('does not add a job when company name is empty after trim', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: '   ',
                    position: 'Engineer',
                    description: 'Should be ignored',
                }),
            });

            expect(nextState).toBe(state);
        });

        it('does not add a job when position is empty after trim', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    companyName: 'Acme',
                    position: '   ',
                }),
            });

            expect(nextState).toBe(state);
        });

        it('does not add a job when openDate is invalid', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    openDate: new Date('invalid'),
                }),
            });

            expect(nextState).toBe(state);
        });

        it('adds a job when submissionDate is missing', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    submissionDate: null,
                }),
            });

            expect(nextState.jobs[0]).toMatchObject({
                companyName: 'Acme',
                position: 'Frontend developer',
                submissionDate: null,
            });
        });

        it('adds a job with null submissionDate when the date is invalid', () => {
            const state: JobState = { jobs: [] };

            const nextState = jobReducer(state, {
                type: 'NEW_ITEM',
                payload: jobFields({
                    submissionDate: new Date('invalid'),
                }),
            });

            expect(nextState.jobs[0].submissionDate).toBeNull();
        });
    });

    describe('DELETE_ITEM', () => {
        it('deletes a job', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, companyName: 'Write tests' })],
            };

            const nextState = jobReducer(state, {
                type: 'DELETE_ITEM',
                payload: 1,
            });

            expect(nextState.jobs).toEqual([]);
        });

        it('removes the job with the given id', () => {
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'Keep' }),
                    createJob({ id: 2, companyName: 'Remove' }),
                    createJob({ id: 3, companyName: 'Also keep' }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'DELETE_ITEM',
                payload: 2,
            });

            expect(nextState.jobs).toEqual([
                createJob({ id: 1, companyName: 'Keep' }),
                createJob({ id: 3, companyName: 'Also keep' }),
            ]);
        });

        it('returns an equivalent jobs list when id is missing', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1 })],
            };

            const nextState = jobReducer(state, {
                type: 'DELETE_ITEM',
                payload: 99,
            });

            expect(nextState.jobs).toEqual(state.jobs);
        });
    });

    describe('UPDATE_ITEM', () => {
        it('updates fields of the matching job', () => {
            const laterOpenDate = new Date('2026-10-01T00:00:00');
            const laterSubmissionDate = new Date('2026-10-15T00:00:00');
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'Old name', description: 'Old notes' }),
                    createJob({ id: 2, companyName: 'Other', description: 'Keep me' }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    companyName: '  New name  ',
                    position: '  Lead  ',
                    description: '  Updated notes  ',
                    openDate: laterOpenDate,
                    submissionDate: laterSubmissionDate,
                },
            });

            expect(nextState.jobs).toEqual([
                createJob({
                    id: 1,
                    companyName: 'New name',
                    position: 'Lead',
                    description: 'Updated notes',
                    openDate: laterOpenDate,
                    submissionDate: laterSubmissionDate,
                }),
                createJob({ id: 2, companyName: 'Other', description: 'Keep me' }),
            ]);
        });

        it('updates only the description when other fields stay the same', () => {
            const state: JobState = {
                jobs: [
                    createJob({
                        id: 1,
                        companyName: 'Write docs',
                        description: 'Draft',
                        state: 'applied',
                    }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    ...jobFields({
                        companyName: 'Write docs',
                        description: 'Final version',
                    }),
                },
            });

            expect(nextState.jobs[0]).toEqual(
                createJob({
                    id: 1,
                    companyName: 'Write docs',
                    description: 'Final version',
                    state: 'applied',
                }),
            );
        });

        it('can clear the submission date', () => {
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'Job', submissionDate }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    ...jobFields({
                        companyName: 'Job',
                        submissionDate: null,
                    }),
                },
            });

            expect(nextState.jobs[0].submissionDate).toBeNull();
        });

        it('can clear the description', () => {
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'Job', description: 'Temporary note' }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    ...jobFields({
                        companyName: 'Job',
                        description: '   ',
                    }),
                },
            });

            expect(nextState.jobs[0].description).toBe('');
        });

        it('preserves job state when updating fields', () => {
            const state: JobState = {
                jobs: [
                    createJob({
                        id: 1,
                        companyName: 'Ship feature',
                        description: 'Almost done',
                        state: 'accepted',
                    }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    ...jobFields({
                        companyName: 'Ship feature v2',
                        description: 'Released',
                    }),
                },
            });

            expect(nextState.jobs[0].state).toBe('accepted');
            expect(nextState.jobs[0].companyName).toBe('Ship feature v2');
            expect(nextState.jobs[0].description).toBe('Released');
        });

        it('does not change jobs when id does not exist', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, companyName: 'Keep', description: 'Same' })],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 99,
                    ...jobFields({
                        companyName: 'Missing',
                        description: 'No match',
                    }),
                },
            });

            expect(nextState.jobs).toEqual(state.jobs);
        });

        it('does not update when company name is empty after trim', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, companyName: 'Keep name', description: 'Notes' })],
            };

            const nextState = jobReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    ...jobFields({
                        companyName: '   ',
                        description: 'Changed',
                    }),
                },
            });

            expect(nextState).toBe(state);
        });
    });

    describe('SET_STATE', () => {
        afterEach(() => {
            vi.useRealTimers();
        });

        it('changes new to applied and sets submissionDate to today', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2026, 8, 9, 15, 30, 0));

            const state: JobState = {
                jobs: [createJob({ id: 1, submissionDate: null, state: 'new' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'applied' },
            });

            expect(nextState.jobs[0].state).toBe('applied');
            expect(nextState.jobs[0].submissionDate).toEqual(new Date('2026-09-09T00:00:00'));
        });

        it('overwrites an existing submissionDate when changing to applied', () => {
            vi.useFakeTimers();
            vi.setSystemTime(new Date(2026, 8, 9, 15, 30, 0));

            const state: JobState = {
                jobs: [createJob({
                    id: 1,
                    submissionDate: new Date('2026-08-01T00:00:00'),
                    state: 'new',
                })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'applied' },
            });

            expect(nextState.jobs[0].submissionDate).toEqual(new Date('2026-09-09T00:00:00'));
        });

        it('changes applied to accepted without changing submissionDate', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'applied' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'accepted' },
            });

            expect(nextState.jobs[0].state).toBe('accepted');
            expect(nextState.jobs[0].submissionDate).toEqual(submissionDate);
        });

        it('changes applied to rejected without changing submissionDate', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'applied' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'rejected' },
            });

            expect(nextState.jobs[0].state).toBe('rejected');
            expect(nextState.jobs[0].submissionDate).toEqual(submissionDate);
        });

        it('changes accepted to rejected', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'accepted' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'rejected' },
            });

            expect(nextState.jobs[0].state).toBe('rejected');
        });

        it('does not change other jobs', () => {
            const state: JobState = {
                jobs: [
                    createJob({ id: 1, companyName: 'First', state: 'new' }),
                    createJob({ id: 2, companyName: 'Second', state: 'applied' }),
                ],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'applied' },
            });

            expect(nextState.jobs[1]).toEqual(state.jobs[1]);
        });

        it('ignores an invalid transition', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'new' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'accepted' },
            });

            expect(nextState).toBe(state);
        });

        it('ignores a change from rejected', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'rejected' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 1, state: 'applied' },
            });

            expect(nextState).toBe(state);
        });

        it('does not change jobs when id does not exist', () => {
            const state: JobState = {
                jobs: [createJob({ id: 1, state: 'new' })],
            };

            const nextState = jobReducer(state, {
                type: 'SET_STATE',
                payload: { id: 99, state: 'applied' },
            });

            expect(nextState).toBe(state);
        });
    });

    it('returns the original state for an unknown action', () => {
        const state: JobState = {
            jobs: [createJob()],
        };
        const unknownAction = { type: 'TOGGLE_STATE' } as unknown as JobAction;

        const nextState = jobReducer(state, unknownAction);

        expect(nextState).toBe(state);
    });
});
