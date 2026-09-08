import { describe, expect, it } from 'vitest';
import { todoReducer } from './todoReducer';
import type { TodoAction, TodoItem, TodoState } from '../../types/types';

const createTodo = (overrides: Partial<TodoItem> = {}): TodoItem => ({
    id: 1,
    name: 'Write tests',
    description: '',
    state: 'new',
    ...overrides,
});

describe('todoReducer', () => {
    describe('NEW_ITEM', () => {
        it('creates a task with name, description, state "new", and id 1 on empty list', () => {
            const state: TodoState = { todos: [] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: 'Buy milk',
                    description: '2% lactose free',
                },
            });

            expect(nextState.todos).toEqual([
                {
                    id: 1,
                    name: 'Buy milk',
                    description: '2% lactose free',
                    state: 'new',
                },
            ]);
        });

        it('creates a task with empty description when description is blank', () => {
            const state: TodoState = { todos: [] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: 'Call dentist',
                    description: '',
                },
            });

            expect(nextState.todos[0]).toMatchObject({
                name: 'Call dentist',
                description: '',
                state: 'new',
            });
        });

        it('trims name and description before saving', () => {
            const state: TodoState = { todos: [] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: '  Call dentist  ',
                    description: '  morning slot  ',
                },
            });

            expect(nextState.todos).toEqual([
                {
                    id: 1,
                    name: 'Call dentist',
                    description: 'morning slot',
                    state: 'new',
                },
            ]);
        });

        it('appends a new task without changing existing ones', () => {
            const existing = createTodo({ id: 1, name: 'First', description: 'Keep' });
            const state: TodoState = { todos: [existing] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: 'Second',
                    description: 'New notes',
                },
            });

            expect(nextState.todos).toEqual([
                existing,
                {
                    id: 2,
                    name: 'Second',
                    description: 'New notes',
                    state: 'new',
                },
            ]);
        });

        it('assigns autoincremented id based on the highest existing id', () => {
            const state: TodoState = {
                todos: [
                    createTodo({ id: 1, name: 'First' }),
                    createTodo({ id: 5, name: 'Fifth' }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: 'Next task',
                    description: 'Details',
                },
            });

            expect(nextState.todos.at(-1)).toEqual({
                id: 6,
                name: 'Next task',
                description: 'Details',
                state: 'new',
            });
        });

        it('does not add a todo when name is empty after trim', () => {
            const state: TodoState = { todos: [] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: {
                    name: '   ',
                    description: 'Should be ignored',
                },
            });

            expect(nextState).toBe(state);
        });
    });

    describe('TOGGLE_STATE', () => {
        it('cycles new -> inProgress -> done -> new', () => {
            const state: TodoState = {
                todos: [createTodo({ id: 1, state: 'new' })],
            };

            const afterNew = todoReducer(state, {
                type: 'TOGGLE_STATE',
                payload: 1,
            });
            expect(afterNew.todos[0].state).toBe('inProgress');

            const afterInProgress = todoReducer(afterNew, {
                type: 'TOGGLE_STATE',
                payload: 1,
            });
            expect(afterInProgress.todos[0].state).toBe('done');

            const afterDone = todoReducer(afterInProgress, {
                type: 'TOGGLE_STATE',
                payload: 1,
            });
            expect(afterDone.todos[0].state).toBe('new');
        });
    });

    describe('DELETE_ITEM', () => {
        it('deletes a task', () => {
            const state: TodoState = {
                todos: [createTodo({ id: 1, name: 'Write tests' })],
            };

            const nextState = todoReducer(state, {
                type: 'DELETE_ITEM',
                payload: 1,
            });

            expect(nextState.todos).toEqual([]);
        });

        it('removes the todo with the given id', () => {
            const state: TodoState = {
                todos: [
                    createTodo({ id: 1, name: 'Keep' }),
                    createTodo({ id: 2, name: 'Remove' }),
                    createTodo({ id: 3, name: 'Also keep' }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'DELETE_ITEM',
                payload: 2,
            });

            expect(nextState.todos).toEqual([
                createTodo({ id: 1, name: 'Keep' }),
                createTodo({ id: 3, name: 'Also keep' }),
            ]);
        });

        it('returns an equivalent todos list when id is missing', () => {
            const state: TodoState = {
                todos: [createTodo({ id: 1 })],
            };

            const nextState = todoReducer(state, {
                type: 'DELETE_ITEM',
                payload: 99,
            });

            expect(nextState.todos).toEqual(state.todos);
        });
    });

    describe('UPDATE_ITEM', () => {
        it('updates name and description of the matching task', () => {
            const state: TodoState = {
                todos: [
                    createTodo({ id: 1, name: 'Old name', description: 'Old notes' }),
                    createTodo({ id: 2, name: 'Other', description: 'Keep me' }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    name: '  New name  ',
                    description: '  Updated notes  ',
                },
            });

            expect(nextState.todos).toEqual([
                createTodo({ id: 1, name: 'New name', description: 'Updated notes' }),
                createTodo({ id: 2, name: 'Other', description: 'Keep me' }),
            ]);
        });

        it('updates only the description when name stays the same', () => {
            const state: TodoState = {
                todos: [
                    createTodo({
                        id: 1,
                        name: 'Write docs',
                        description: 'Draft',
                        state: 'inProgress',
                    }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    name: 'Write docs',
                    description: 'Final version',
                },
            });

            expect(nextState.todos[0]).toEqual(
                createTodo({
                    id: 1,
                    name: 'Write docs',
                    description: 'Final version',
                    state: 'inProgress',
                }),
            );
        });

        it('can clear the description', () => {
            const state: TodoState = {
                todos: [
                    createTodo({ id: 1, name: 'Task', description: 'Temporary note' }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    name: 'Task',
                    description: '   ',
                },
            });

            expect(nextState.todos[0].description).toBe('');
        });

        it('preserves task state when updating name and description', () => {
            const state: TodoState = {
                todos: [
                    createTodo({
                        id: 1,
                        name: 'Ship feature',
                        description: 'Almost done',
                        state: 'done',
                    }),
                ],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    name: 'Ship feature v2',
                    description: 'Released',
                },
            });

            expect(nextState.todos[0].state).toBe('done');
            expect(nextState.todos[0].name).toBe('Ship feature v2');
            expect(nextState.todos[0].description).toBe('Released');
        });

        it('does not change todos when id does not exist', () => {
            const state: TodoState = {
                todos: [createTodo({ id: 1, name: 'Keep', description: 'Same' })],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 99,
                    name: 'Missing',
                    description: 'No match',
                },
            });

            expect(nextState.todos).toEqual(state.todos);
        });

        it('does not update when name is empty after trim', () => {
            const state: TodoState = {
                todos: [createTodo({ id: 1, name: 'Keep name', description: 'Notes' })],
            };

            const nextState = todoReducer(state, {
                type: 'UPDATE_ITEM',
                payload: {
                    id: 1,
                    name: '   ',
                    description: 'Changed',
                },
            });

            expect(nextState).toBe(state);
        });
    });

    it('returns the original state for an unknown action', () => {
        const state: TodoState = {
            todos: [createTodo()],
        };
        const unknownAction = { type: 'UNKNOWN_ACTION' } as unknown as TodoAction;

        const nextState = todoReducer(state, unknownAction);

        expect(nextState).toBe(state);
    });
});
