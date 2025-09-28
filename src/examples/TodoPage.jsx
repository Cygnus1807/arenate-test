import { useEffect, useState } from 'react';
import supabase from '../utils/supabase';

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getTodos = async () => {
      const { data, error } = await supabase.from('todos').select();

      if (error) {
        setError(error.message);
        return;
      }

      setTodos(data ?? []);
    };

    getTodos();
  }, []);

  if (error) {
    return <div className="text-red-600">{error}</div>;
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <li key={todo.id ?? todo.title} className="rounded border border-gray-200 p-2">
          {todo.title ?? JSON.stringify(todo)}
        </li>
      ))}
    </ul>
  );
};

export default TodoPage;
