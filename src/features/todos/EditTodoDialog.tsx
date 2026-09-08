import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { TodoItem } from '../../types/types';
import './EditTodoDialog.css';

type EditTodoDialogProps = {
    todo: TodoItem;
    onCancel: () => void;
    onUpdate: (values: { name: string; description: string }) => void;
};

export const EditTodoDialog = ({ todo, onCancel, onUpdate }: EditTodoDialogProps) => {
    const [name, setName] = useState(todo.name);
    const [description, setDescription] = useState(todo.description);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) {
            return;
        }

        onUpdate({
            name: name.trim(),
            description: description.trim(),
        });
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    return (
        <div className="editTodoOverlay" role="presentation" onClick={onCancel}>
            <div
                className="editTodoDialog"
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-todo-title"
                onClick={(event) => event.stopPropagation()}
            >
                <h3 id="edit-todo-title">Edit task</h3>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="edit-todo-name">Name</label>
                    <input
                        id="edit-todo-name"
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        autoFocus
                    />

                    <label htmlFor="edit-todo-description">Description</label>
                    <textarea
                        id="edit-todo-description"
                        value={description}
                        onChange={handleDescriptionChange}
                        rows={4}
                    />

                    <div className="editTodoActions">
                        <button type="button" onClick={onCancel}>
                            Cancel
                        </button>
                        <button type="submit">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
