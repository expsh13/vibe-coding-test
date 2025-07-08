export interface TodoApiResponse {
  id: string;
  content: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: Date;
}

export const todoApi = {
  // Todo一覧取得
  async getTodos(): Promise<TodoApiResponse[]> {
    const response = await fetch("/api/todos");
    if (!response.ok) {
      throw new Error("Failed to fetch todos");
    }
    return response.json();
  },

  // Todo作成
  async createTodo(
    todo: Omit<TodoApiResponse, "id" | "createdAt">
  ): Promise<TodoApiResponse> {
    const response = await fetch("/api/todos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    if (!response.ok) {
      throw new Error("Failed to create todo");
    }
    return response.json();
  },

  // Todo更新
  async updateTodo(
    id: string,
    updates: Partial<TodoApiResponse>
  ): Promise<TodoApiResponse> {
    const response = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updates),
    });
    if (!response.ok) {
      throw new Error("Failed to update todo");
    }
    return response.json();
  },

  // Todo削除
  async deleteTodo(id: string): Promise<void> {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete todo");
    }
  },
};
