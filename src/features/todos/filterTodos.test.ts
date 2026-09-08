import { describe, expect, it } from 'vitest';
import { filterTodos } from './filterTodos';
import type { TodoItem } from '../../types/types';

const todos: TodoItem[] = [
    { id: 1, name: 'Open task', state: 'new' },
    { id: 2, name: 'In progress task', state: 'inProgress' },
    { id: 3, name: 'Done task', state: 'done' },
];

describe('filterTodos', () => {
    it('returns all todos for filter "all"', () => {
        expect(filterTodos(todos, 'all')).toEqual(todos);
    });

    it('returns only new todos for filter "open"', () => {
        expect(filterTodos(todos, 'open')).toEqual([
            { id: 1, name: 'Open task', state: 'new' },
        ]);
    });

    it('returns only in-progress todos for filter "inProgress"', () => {
        expect(filterTodos(todos, 'inProgress')).toEqual([
            { id: 2, name: 'In progress task', state: 'inProgress' },
        ]);
    });

    it('returns only done todos for filter "done"', () => {
        expect(filterTodos(todos, 'done')).toEqual([
            { id: 3, name: 'Done task', state: 'done' },
        ]);
    });
});
