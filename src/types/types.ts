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
    state: TodoItemStateKey;
};

export type TodoFilter = 'all' | 'active' | 'completed';

export type TodoState = {
    todos: TodoItem[];
};

export type TodoAction =
    | { type: 'NEW_ITEM'; payload: string }
    | { type: 'TOGGLE_STATE'; payload: number };
