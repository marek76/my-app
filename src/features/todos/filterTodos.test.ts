import { describe, expect, it } from 'vitest';
import { filterTodos } from './filterTodos';
import type { TodoItem } from '../../types/types';

const todos: TodoItem[] = [
    { id: 1, name: 'New task', state: 'new' },
    { id: 2, name: 'Active task', state: 'inProgress' },
    { id: 3, name: 'Done task', state: 'done' },
];

describe('filterTodos', () => {
    it('returns all todos for filter "all"', () => {
        expect(filterTodos(todos, 'all')).toEqual(todos);
    });

    it('returns only incomplete todos for filter "active"', () => {
        expect(filterTodos(todos, 'active')).toEqual([
            { id: 1, name: 'New task', state: 'new' },
            { id: 2, name: 'Active task', state: 'inProgress' },
        ]);
    });

    it('returns only done todos for filter "completed"', () => {
        expect(filterTodos(todos, 'completed')).toEqual([
            { id: 3, name: 'Done task', state: 'done' },
        ]);
    });
});
