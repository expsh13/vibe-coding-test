import { useState, useEffect } from "react";
import { todoApi, type TodoApiResponse } from "../services/todoApi";
import { TodoList } from "./TodoList";
import { AddTodo } from "./AddTodo";
import type { Todo } from "../types/todo";

// API型からローカル型への変換
const convertApiToLocal = (apiTodo: TodoApiResponse): Todo => ({
  id: apiTodo.id,
  content: apiTodo.content,
  status: apiTodo.completed ? "completed" : "pending",
  priority: apiTodo.priority,
  createdAt: typeof apiTodo.createdAt === 'string' ? apiTodo.createdAt : apiTodo.createdAt.toISOString(),
});

export const TodoAppWithApi = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 初期データ読み込み
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const data = await todoApi.getTodos();
        setTodos(data.map(convertApiToLocal));
      } catch {
        setError("Todoの読み込みに失敗しました");
      } finally {
        setLoading(false);
      }
    };
    loadTodos();
  }, []);

  // Todo追加
  const handleAddTodo = async (
    content: string,
    priority: "low" | "medium" | "high"
  ) => {
    try {
      const newTodo = await todoApi.createTodo({
        content,
        completed: false,
        priority,
      });
      setTodos((prev) => [...prev, convertApiToLocal(newTodo)]);
    } catch {
      setError("Todoの追加に失敗しました");
    }
  };

  // Todo更新
  const handleUpdateTodo = async (
    id: string,
    updates: Partial<TodoApiResponse>
  ) => {
    try {
      const updatedTodo = await todoApi.updateTodo(id, updates);
      setTodos((prev) =>
        prev.map((todo) =>
          todo.id === id ? convertApiToLocal(updatedTodo) : todo
        )
      );
    } catch {
      setError("Todoの更新に失敗しました");
    }
  };

  // Todo削除
  const handleDeleteTodo = async (id: string) => {
    try {
      await todoApi.deleteTodo(id);
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    } catch {
      setError("Todoの削除に失敗しました");
    }
  };

  if (loading) return <div data-testid="loading">読み込み中...</div>;
  if (error) return <div data-testid="error">{error}</div>;

  return (
    <div className="todo-app" data-testid="todo-app-with-api">
      <h1>Todo App (API版)</h1>
      <AddTodo onAdd={handleAddTodo} />
      <TodoList
        todos={todos}
        onToggle={(id) => {
          const todo = todos.find((t) => t.id === id);
          if (todo) {
            handleUpdateTodo(id, { completed: todo.status !== "completed" });
          }
        }}
        onDelete={handleDeleteTodo}
      />
    </div>
  );
};
