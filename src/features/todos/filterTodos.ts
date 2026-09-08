import type { TodoFilter, TodoItem } from '../../types/types';

export const filterTodos = (todos: TodoItem[], filter: TodoFilter): TodoItem[] => {
    switch (filter) {
        case 'active':
            return todos.filter((todo) => todo.state !== 'done');
        case 'completed':
            return todos.filter((todo) => todo.state === 'done');
        case 'all':
        default:
            return todos;
    }
};
