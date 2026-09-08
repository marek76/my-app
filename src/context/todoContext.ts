import { createContext, type Dispatch } from 'react';
import type { TodoAction, TodoState } from '../types/types';

export type TodoStore = {
    state: TodoState;
    dispatch: Dispatch<TodoAction>;
};

export const TodoContext = createContext<TodoStore | undefined>(undefined);
