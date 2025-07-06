import type { Todo, TodoPriority } from "../types/todo";

export function createTodo(
  content: string,
  priority: TodoPriority = "medium"
): Todo {
  return {
    id: crypto.randomUUID(),
    content,
    status: "pending",
    priority,
    createdAt: new Date().toISOString(),
  };
}

export function toggleTodoStatus(todo: Todo): Todo {
  const newStatus = todo.status === "completed" ? "pending" : "completed";
  return {
    ...todo,
    status: newStatus,
    completedAt:
      newStatus === "completed" ? new Date().toISOString() : undefined,
    updatedAt: new Date().toISOString(),
  };
}

export function filterTodosByStatus(
  todos: Todo[],
  status?: Todo["status"]
): Todo[] {
  if (!status) return todos;
  return todos.filter((todo) => todo.status === status);
}

export function sortTodosByPriority(todos: Todo[]): Todo[] {
  const priorityOrder: Record<TodoPriority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  return [...todos].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "completed" ? 1 : -1;
    }
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}
