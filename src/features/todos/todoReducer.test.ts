import { describe, expect, it } from 'vitest';
import { todoReducer } from './todoReducer';
import type { TodoAction, TodoItem, TodoState } from '../../types/types';

const createTodo = (overrides: Partial<TodoItem> = {}): TodoItem => ({
    id: 1,
    name: 'Write tests',
    state: 'new',
    ...overrides,
});

describe('todoReducer', () => {
    describe('NEW_ITEM', () => {
        it('adds a new todo with state "new"', () => {
            const state: TodoState = { todos: [] };

            const nextState = todoReducer(state, {
                type: 'NEW_ITEM',
                payload: 'Buy milk',
            });

            expect(nextState.todos).toEqual([
                { id: 1, name: 'Buy milk', state: 'new' },
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
                payload: 'Next task',
            });

            expect(nextState.todos.at(-1)).toEqual({
                id: 6,
                name: 'Next task',
                state: 'new',
            });
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

    it('returns the original state for an unknown action', () => {
        const state: TodoState = {
            todos: [createTodo()],
        };
        const unknownAction = { type: 'UNKNOWN_ACTION' } as unknown as TodoAction;

        const nextState = todoReducer(state, unknownAction);

        expect(nextState).toBe(state);
    });
});
