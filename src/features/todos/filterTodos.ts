import type { TodoFilter, TodoItem } from '../../types/types';

export const filterTodos = (todos: TodoItem[], filter: TodoFilter): TodoItem[] => {
    switch (filter) {
        case 'open':
            return todos.filter((todo) => todo.state === 'new');
        case 'inProgress':
            return todos.filter((todo) => todo.state === 'inProgress');
        case 'done':
            return todos.filter((todo) => todo.state === 'done');
        case 'all':
        default:
            return todos;
    }
};
