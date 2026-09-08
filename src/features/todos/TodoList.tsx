import { useStore } from '../../context/useStore';
import type { TodoItem } from '../../types/types';
import './TodoList.css';

export const TodoList = () => {
    const { state, dispatch } = useStore();
    const todos = state.todos;

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
