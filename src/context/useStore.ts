import { useContext } from 'react';
import { TodoContext } from './todoContext';

export const useStore = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useStore must be used inside TodoProvider');
    }

    return context;
};
