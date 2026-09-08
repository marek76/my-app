import type { TodoAction, TodoItem, TodoItemStateKey, TodoState } from '../../types/types';

const NEXT_STATE: Record<TodoItemStateKey, TodoItemStateKey> = {
    new: 'inProgress',
    inProgress: 'done',
    done: 'new',
};

const nextTodoId = (todos: TodoItem[]): number => {
    if (todos.length === 0) {
        return 1;
    }

    return Math.max(...todos.map((todo) => todo.id)) + 1;
};

export const todoReducer = (state: TodoState, action: TodoAction): TodoState => {
    switch (action.type) {
        case 'NEW_ITEM': {
            const name = action.payload.name.trim();
            if (!name) {
                return state;
            }

            const newTodo: TodoItem = {
                id: nextTodoId(state.todos),
                name,
                description: action.payload.description.trim(),
                state: 'new',
            };

            return {
                ...state,
                todos: [...state.todos, newTodo],
            };
        }
        case 'TOGGLE_STATE': {
            return {
                ...state,
                todos: state.todos.map((todo) => {
                    if (todo.id !== action.payload) {
                        return todo;
                    }

                    return {
                        ...todo,
                        state: NEXT_STATE[todo.state],
                    };
                }),
            };
        }
        case 'DELETE_ITEM': {
            return {
                ...state,
                todos: state.todos.filter((todo) => todo.id !== action.payload),
            };
        }
        case 'UPDATE_ITEM': {
            const name = action.payload.name.trim();
            if (!name) {
                return state;
            }

            return {
                ...state,
                todos: state.todos.map((todo) => {
                    if (todo.id !== action.payload.id) {
                        return todo;
                    }

                    return {
                        ...todo,
                        name,
                        description: action.payload.description.trim(),
                    };
                }),
            };
        }
        default:
            return state;
    }
};
