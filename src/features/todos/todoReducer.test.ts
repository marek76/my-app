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
        it('cycles new -> inProgress -> done -> inProgress', () => {
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
            expect(afterDone.todos[0].state).toBe('inProgress');
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
