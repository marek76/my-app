import { useState, type ChangeEvent, type SyntheticEvent } from 'react';
import { useStore } from '../../context/useStore';

export const TodoInput = () => {
    const [value, setValue] = useState('');
    const { dispatch } = useStore();

    const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!value.trim()) return;

        dispatch({
            type: 'NEW_ITEM',
            payload: value.trim(),
        });

        setValue('');
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                id="newTask"
                type="text"
                value={value}
                onChange={handleChange}
            />
            <button type="submit">
                Add new task
            </button>
        </form>
    );
};
