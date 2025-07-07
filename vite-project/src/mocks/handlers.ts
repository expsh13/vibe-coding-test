import { http, HttpResponse } from "msw";

export interface Todo {
  id: string;
  content: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

// モックデータ
const todos: Todo[] = [
  {
    id: "1",
    content: "モックTodo1",
    completed: false,
    priority: "high",
    createdAt: new Date("2025-07-01"),
  },
  {
    id: "2",
    content: "モックTodo2",
    completed: true,
    priority: "medium",
    createdAt: new Date("2025-07-02"),
  },
];

export const handlers = [
  // GET /api/todos - Todo一覧取得
  http.get("/api/todos", () => {
    return HttpResponse.json(todos);
  }),

  // POST /api/todos - Todo作成
  http.post("/api/todos", async ({ request }) => {
    const newTodo = (await request.json()) as Omit<Todo, "id" | "createdAt">;
    const todo: Todo = {
      id: crypto.randomUUID(),
      createdAt: new Date(),
      ...newTodo,
    };
    todos.push(todo);
    return HttpResponse.json(todo, { status: 201 });
  }),

  // PUT /api/todos/:id - Todo更新
  http.put("/api/todos/:id", async ({ request, params }) => {
    const { id } = params;
    const updates = (await request.json()) as Partial<Todo>;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    todos[todoIndex] = { ...todos[todoIndex], ...updates };
    return HttpResponse.json(todos[todoIndex]);
  }),

  // DELETE /api/todos/:id - Todo削除
  http.delete("/api/todos/:id", ({ params }) => {
    const { id } = params;
    const todoIndex = todos.findIndex((todo) => todo.id === id);

    if (todoIndex === -1) {
      return new HttpResponse(null, { status: 404 });
    }

    todos.splice(todoIndex, 1);
    return new HttpResponse(null, { status: 204 });
  }),
];
