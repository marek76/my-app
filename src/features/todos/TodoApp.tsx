import { useState } from 'react';
import type { TodoFilter as TodoFilterValue } from '../../types/types';
import { TodoFilter } from './TodoFilter';
import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import './TodoApp.css';

export const TodoApp = () => {
    const [filter, setFilter] = useState<TodoFilterValue>('all');

    return (
        <div className="todoApp">
            <h2>To do...</h2>
            <TodoInput />
            <TodoFilter value={filter} onChange={setFilter} />
            <TodoList filter={filter} />
        </div>
    );
};
