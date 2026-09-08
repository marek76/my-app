import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useStore } from '../../context/useStore';
import './TodoInput.css';

export const TodoInput = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const { dispatch } = useStore();

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!name.trim()) return;

        dispatch({
            type: 'NEW_ITEM',
            payload: {
                name: name.trim(),
                description: description.trim(),
            },
        });

        setName('');
        setDescription('');
    };

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleDescriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    return (
        <form className="todoInput" onSubmit={handleSubmit}>
            <label htmlFor="newTask">Name</label>
            <input
                id="newTask"
                type="text"
                value={name}
                onChange={handleNameChange}
            />

            <label htmlFor="newTaskDescription">Description</label>
            <textarea
                id="newTaskDescription"
                value={description}
                onChange={handleDescriptionChange}
                rows={3}
            />

            <button type="submit">
                Add new task
            </button>
        </form>
    );
};
