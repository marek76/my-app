import { TodoInput } from './TodoInput';
import { TodoList } from './TodoList';
import './TodoApp.css';

export const TodoApp = () => {
    return (
        <div className="todoApp">
            <h2>To do...</h2>
            <TodoInput />
            <TodoList />
        </div>
    );
};
