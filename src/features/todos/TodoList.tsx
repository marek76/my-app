import { useStore } from '../../context/useStore';
import type { TodoFilter, TodoItem } from '../../types/types';
import { filterTodos } from './filterTodos';
import './TodoList.css';

type TodoListProps = {
    filter: TodoFilter;
};

export const TodoList = ({ filter }: TodoListProps) => {
    const { state, dispatch } = useStore();
    const todos = filterTodos(state.todos, filter);

    const toggleState = (id: number) => {
        dispatch({
            type: 'TOGGLE_STATE',
            payload: id,
        });
    };

    return (
        <ul className="todoList">
            {todos.map((todo: TodoItem) => (
                <li
                    onClick={() => toggleState(todo.id)}
                    key={todo.id}
                    className={`todoItem ${todo.state}`}
                >
                    {todo.name}
                </li>
            ))}
        </ul>
    );
};
