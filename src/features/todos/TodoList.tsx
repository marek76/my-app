import { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { TodoFilter, TodoItem } from '../../types/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { filterTodos } from './filterTodos';
import './TodoList.css';

type TodoListProps = {
    filter: TodoFilter;
};

const TrashIcon = () => (
    <svg
        className="todoDeleteIcon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
    >
        <path
            fill="currentColor"
            d="M9 3h6l1 2h4v2H4V5h4l1-2zm1 6h2v9h-2V9zm4 0h2v9h-2V9zM7 9h2v9H7V9zm-1 12h12a1 1 0 0 0 1-1V7H5v13a1 1 0 0 0 1 1z"
        />
    </svg>
);

export const TodoList = ({ filter }: TodoListProps) => {
    const { state, dispatch } = useStore();
    const todos = filterTodos(state.todos, filter);
    const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

    const toggleState = (id: number) => {
        dispatch({
            type: 'TOGGLE_STATE',
            payload: id,
        });
    };

    const confirmDelete = () => {
        if (pendingDeleteId === null) {
            return;
        }

        dispatch({
            type: 'DELETE_ITEM',
            payload: pendingDeleteId,
        });
        setPendingDeleteId(null);
    };

    return (
        <>
            <ul className="todoList">
                {todos.map((todo: TodoItem) => (
                    <li key={todo.id} className={`todoItem ${todo.state}`}>
                        <button
                            type="button"
                            className="todoItemName"
                            onClick={() => toggleState(todo.id)}
                        >
                            {todo.name}
                        </button>
                        <button
                            type="button"
                            className="todoDelete"
                            aria-label={`Delete ${todo.name}`}
                            onClick={() => setPendingDeleteId(todo.id)}
                        >
                            <TrashIcon />
                        </button>
                    </li>
                ))}
            </ul>
            {pendingDeleteId !== null && (
                <DeleteConfirmDialog
                    onConfirm={confirmDelete}
                    onCancel={() => setPendingDeleteId(null)}
                />
            )}
        </>
    );
};
