import { describe, it, expect, vi, beforeEach } from "vitest";
import { todoApi } from "../todoApi";

describe("todoApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getTodos", () => {
    it("Todo一覧を正常に取得する", async () => {
      // Arrange - MSWが/api/todosのレスポンスを提供

      // Act - API呼び出し
      const todos = await todoApi.getTodos();

      // Assert - モックデータが返される
      expect(todos).toHaveLength(2);
      expect(todos[0]).toMatchObject({
        id: "1",
        content: "モックTodo1",
        completed: false,
        priority: "high",
      });
      expect(todos[1]).toMatchObject({
        id: "2",
        content: "モックTodo2",
        completed: true,
        priority: "medium",
      });
    });

    it("APIエラー時に例外を投げる", async () => {
      // Arrange - MSWでエラーレスポンスを設定
      const { server } = await import("../../mocks/node");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.get("/api/todos", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      // Act & Assert - 例外が投げられる
      await expect(todoApi.getTodos()).rejects.toThrow("Failed to fetch todos");
    });
  });

  describe("createTodo", () => {
    it("新しいTodoを正常に作成する", async () => {
      // Arrange - 作成するTodoデータ
      const newTodo = {
        content: "新しいタスク",
        completed: false,
        priority: "high" as const,
      };

      // Act - API呼び出し
      const createdTodo = await todoApi.createTodo(newTodo);

      // Assert - 作成されたTodoが返される
      expect(createdTodo).toMatchObject({
        content: "新しいタスク",
        completed: false,
        priority: "high",
      });
      expect(createdTodo.id).toBeDefined();
      expect(createdTodo.createdAt).toBeDefined();
    });

    it("APIエラー時に例外を投げる", async () => {
      // Arrange - MSWでエラーレスポンスを設定
      const { server } = await import("../../mocks/node");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.post("/api/todos", () => {
          return new HttpResponse(null, { status: 400 });
        })
      );

      const newTodo = {
        content: "新しいタスク",
        completed: false,
        priority: "high" as const,
      };

      // Act & Assert - 例外が投げられる
      await expect(todoApi.createTodo(newTodo)).rejects.toThrow(
        "Failed to create todo"
      );
    });
  });

  describe("updateTodo", () => {
    it("Todoを正常に更新する", async () => {
      // Arrange - 更新データ
      const updates = { completed: true };

      // Act - API呼び出し
      const updatedTodo = await todoApi.updateTodo("1", updates);

      // Assert - 更新されたTodoが返される
      expect(updatedTodo).toMatchObject({
        id: "1",
        completed: true,
      });
    });

    it("存在しないTodoの更新時に例外を投げる", async () => {
      // Arrange - MSWで404レスポンスを設定
      const { server } = await import("../../mocks/node");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.put("/api/todos/999", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      // Act & Assert - 例外が投げられる
      await expect(
        todoApi.updateTodo("999", { completed: true })
      ).rejects.toThrow("Failed to update todo");
    });
  });

  describe("deleteTodo", () => {
    it("Todoを正常に削除する", async () => {
      // Arrange - 削除対象のID

      // Act - API呼び出し（例外が投げられないことを確認）
      await expect(todoApi.deleteTodo("1")).resolves.not.toThrow();
    });

    it("存在しないTodoの削除時に例外を投げる", async () => {
      // Arrange - MSWで404レスポンスを設定
      const { server } = await import("../../mocks/node");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.delete("/api/todos/999", () => {
          return new HttpResponse(null, { status: 404 });
        })
      );

      // Act & Assert - 例外が投げられる
      await expect(todoApi.deleteTodo("999")).rejects.toThrow(
        "Failed to delete todo"
      );
    });
  });
});
