import { useState } from "react";
import type { Todo, TodoPriority } from "../types/todo";
import {
  createTodo,
  toggleTodoStatus,
  sortTodosByPriority,
} from "../utils/todo";
import { TodoList } from "./TodoList";
import { AddTodo } from "./AddTodo";

export function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAddTodo = (content: string, priority: TodoPriority) => {
    const newTodo = createTodo(content, priority);
    setTodos((prevTodos) => sortTodosByPriority([...prevTodos, newTodo]));
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prevTodos) =>
      sortTodosByPriority(
        prevTodos.map((todo) =>
          todo.id === id ? toggleTodoStatus(todo) : todo
        )
      )
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="todo-app" data-testid="todo-app">
      <h1>Todo App</h1>
      <AddTodo onAdd={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggle={handleToggleTodo}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
}
