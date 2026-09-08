import { useEffect, useReducer, type ReactNode } from 'react';
import { todoReducer } from '../features/todos/todoReducer';
import type { TodoItem, TodoItemStateKey, TodoState } from '../types/types';
import { TodoContext } from './todoContext';

const STORAGE_KEY = 'todo_app_items';

const isTodoItemStateKey = (value: unknown): value is TodoItemStateKey =>
    value === 'new' || value === 'inProgress' || value === 'done';

const normalizeTodos = (value: unknown): TodoItem[] => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value.flatMap((item, index) => {
        if (typeof item !== 'object' || item === null) {
            return [];
        }

        const candidate = item as {
            id?: unknown;
            name?: unknown;
            description?: unknown;
            state?: unknown;
        };

        if (typeof candidate.name !== 'string') {
            return [];
        }

        const state: TodoItemStateKey =
            candidate.state === 'open' || !isTodoItemStateKey(candidate.state)
                ? 'new'
                : candidate.state;

        return [{
            id: typeof candidate.id === 'number' ? candidate.id : index + 1,
            name: candidate.name,
            description: typeof candidate.description === 'string' ? candidate.description : '',
            state,
        }];
    });
};

const loadInitialState = (): TodoState => {
    try {
        const savedTodos = localStorage.getItem(STORAGE_KEY);
        if (savedTodos) {
            return { todos: normalizeTodos(JSON.parse(savedTodos)) };
        }
    } catch (error) {
        console.error('Failed to load todos from localStorage:', error);
    }

    return { todos: [] };
};

export const TodoProvider = ({ children }: { children: ReactNode }) => {
    const [state, dispatch] = useReducer(todoReducer, null, loadInitialState);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos));
        } catch (error) {
            console.error('Failed to save todos to localStorage:', error);
        }
    }, [state.todos]);

    return (
        <TodoContext.Provider value={{ state, dispatch }}>
            {children}
        </TodoContext.Provider>
    );
};
