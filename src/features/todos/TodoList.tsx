import { useState } from 'react';
import { useStore } from '../../context/useStore';
import type { TodoFilter, TodoItem } from '../../types/types';
import { DeleteConfirmDialog } from './DeleteConfirmDialog';
import { EditTodoDialog } from './EditTodoDialog';
import { filterTodos } from './filterTodos';
import './TodoList.css';

type TodoListProps = {
    filter: TodoFilter;
};

const EditIcon = () => (
    <svg
        className="todoEditIcon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        aria-hidden="true"
        focusable="false"
    >
        <path
            fill="currentColor"
            d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z"
        />
    </svg>
);

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
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);

    const editingTodo = editingTodoId === null
        ? null
        : state.todos.find((todo) => todo.id === editingTodoId) ?? null;

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

    const updateTodo = (values: { name: string; description: string }) => {
        if (editingTodoId === null) {
            return;
        }

        dispatch({
            type: 'UPDATE_ITEM',
            payload: {
                id: editingTodoId,
                name: values.name,
                description: values.description,
            },
        });
        setEditingTodoId(null);
    };

    return (
        <>
            <ul className="todoList">
                {todos.map((todo: TodoItem) => (
                    <li key={todo.id} className={`todoItem ${todo.state}`}>
                        <div className="todoItemContent">
                            <button
                                type="button"
                                className="todoItemName"
                                onClick={() => toggleState(todo.id)}
                            >
                                {todo.name}
                            </button>
                            {todo.description ? (
                                <p className="todoItemDescription">{todo.description}</p>
                            ) : null}
                        </div>
                        <button
                            type="button"
                            className="todoEdit"
                            aria-label={`Edit ${todo.name}`}
                            onClick={() => setEditingTodoId(todo.id)}
                        >
                            <EditIcon />
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
            {editingTodo !== null && (
                <EditTodoDialog
                    todo={editingTodo}
                    onCancel={() => setEditingTodoId(null)}
                    onUpdate={updateTodo}
                />
            )}
        </>
    );
};
