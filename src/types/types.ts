export const TodoItemState = {
    new: 'New',
    inProgress: 'In progress',
    done: 'Done',
} as const;

export type TodoItemState = typeof TodoItemState[keyof typeof TodoItemState];
export type TodoItemStateKey = keyof typeof TodoItemState;

export type TodoItem = {
    id: number;
    name: string;
    description: string;
    state: TodoItemStateKey;
};

export type TodoFilter = 'all' | 'open' | 'inProgress' | 'done';

export type TodoState = {
    todos: TodoItem[];
};

export type TodoAction =
    | { type: 'NEW_ITEM'; payload: { name: string; description: string } }
    | { type: 'TOGGLE_STATE'; payload: number }
    | { type: 'DELETE_ITEM'; payload: number }
    | { type: 'UPDATE_ITEM'; payload: { id: number; name: string; description: string } };
