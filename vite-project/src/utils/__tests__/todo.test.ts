import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  createTodo,
  toggleTodoStatus,
  filterTodosByStatus,
  sortTodosByPriority,
} from "../todo";
import type { Todo } from "../../types/todo";

describe("Todoユーティリティ", () => {
  // テスト前のセットアップ
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("createTodo", () => {
    it("必須フィールドを持つTodoを作成する", () => {
      const content = "テストTodo内容";
      const todo = createTodo(content);

      expect(todo).toEqual({
        id: expect.any(String),
        content,
        status: "pending",
        priority: "medium",
        createdAt: expect.any(String),
      });
    });

    it("カスタム優先度でTodoを作成する", () => {
      const content = "高優先度Todo";
      const priority = "high";
      const todo = createTodo(content, priority);

      expect(todo.priority).toBe(priority);
      expect(todo.content).toBe(content);
    });

    it("各Todoに一意のIDを生成する", () => {
      const todo1 = createTodo("Todo 1");
      const todo2 = createTodo("Todo 2");

      expect(todo1.id).not.toBe(todo2.id);
    });

    it("createdAtを現在のタイムスタンプに設定する", () => {
      const beforeCreation = new Date().toISOString();
      const todo = createTodo("テストTodo");
      const afterCreation = new Date().toISOString();

      expect(todo.createdAt).toBeTypeOf("string");
      expect(new Date(todo.createdAt).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeCreation).getTime()
      );
      expect(new Date(todo.createdAt).getTime()).toBeLessThanOrEqual(
        new Date(afterCreation).getTime()
      );
    });
  });

  describe("toggleTodoStatus", () => {
    const mockTodo: Todo = {
      id: "1",
      content: "テストTodo",
      status: "pending",
      priority: "medium",
      createdAt: "2023-01-01T00:00:00.000Z",
    };

    it("ステータスをpendingからcompletedに切り替える", () => {
      const result = toggleTodoStatus(mockTodo);

      expect(result.status).toBe("completed");
      expect(result.completedAt).toEqual(expect.any(String)); // completedAtは文字列で設定される
      expect(result.updatedAt).toEqual(expect.any(String)); // updatedAtは必ず文字列
    });

    it("ステータスをcompletedからpendingに切り替える", () => {
      const completedTodo: Todo = {
        ...mockTodo,
        status: "completed",
        completedAt: "2023-01-01T12:00:00.000Z",
      };

      const result = toggleTodoStatus(completedTodo);

      expect(result.status).toBe("pending");
      expect(result.completedAt).toBeUndefined(); // completedAtはundefinedに戻る
      expect(result.updatedAt).toEqual(expect.any(String)); // updatedAtは必ず文字列
    });

    it("他のTodoプロパティを保持する", () => {
      const result = toggleTodoStatus(mockTodo);

      expect(result.id).toBe(mockTodo.id);
      expect(result.content).toBe(mockTodo.content);
      expect(result.priority).toBe(mockTodo.priority);
      expect(result.createdAt).toBe(mockTodo.createdAt);
    });

    it("updatedAtタイムスタンプを設定する", () => {
      const beforeToggle = new Date().toISOString();
      const result = toggleTodoStatus(mockTodo);
      const afterToggle = new Date().toISOString();

      expect(result.updatedAt).toEqual(expect.any(String)); // updatedAtは文字列型
      expect(new Date(result.updatedAt!).getTime()).toBeGreaterThanOrEqual(
        new Date(beforeToggle).getTime()
      );
      expect(new Date(result.updatedAt!).getTime()).toBeLessThanOrEqual(
        new Date(afterToggle).getTime()
      );
    });
  });

  describe("filterTodosByStatus", () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        content: "Pending Todo",
        status: "pending",
        priority: "medium",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        content: "進行中Todo",
        status: "in_progress",
        priority: "high",
        createdAt: "2023-01-01T01:00:00.000Z",
      },
      {
        id: "3",
        content: "完了Todo",
        status: "completed",
        priority: "low",
        createdAt: "2023-01-01T02:00:00.000Z",
      },
    ];

    it("ステータスフィルターが提供されていない場合、全てのTodoを返す", () => {
      const result = filterTodosByStatus(mockTodos);
      expect(result).toEqual(mockTodos);
    });

    it("pendingステータスでTodoをフィルタリングする", () => {
      const result = filterTodosByStatus(mockTodos, "pending");
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("pending");
    });

    it("in_progressステータスでTodoをフィルタリングする", () => {
      const result = filterTodosByStatus(mockTodos, "in_progress");
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("in_progress");
    });

    it("completedステータスでTodoをフィルタリングする", () => {
      const result = filterTodosByStatus(mockTodos, "completed");
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe("completed");
    });

    it("ステータスに一致するTodoがない場合、空配列を返す", () => {
      const pendingTodos = mockTodos.filter(
        (todo) => todo.status === "pending"
      );
      const result = filterTodosByStatus(pendingTodos, "completed");
      expect(result).toHaveLength(0);
    });
  });

  describe("sortTodosByPriority", () => {
    const mockTodos: Todo[] = [
      {
        id: "1",
        content: "低優先度完了",
        status: "completed",
        priority: "low",
        createdAt: "2023-01-01T00:00:00.000Z",
      },
      {
        id: "2",
        content: "高優先度未完了",
        status: "pending",
        priority: "high",
        createdAt: "2023-01-01T01:00:00.000Z",
      },
      {
        id: "3",
        content: "中優先度未完了",
        status: "pending",
        priority: "medium",
        createdAt: "2023-01-01T02:00:00.000Z",
      },
      {
        id: "4",
        content: "高優先度完了",
        status: "completed",
        priority: "high",
        createdAt: "2023-01-01T03:00:00.000Z",
      },
    ];

    it("pendingのTodoをcompletedのTodoより前にソートする", () => {
      const result = sortTodosByPriority(mockTodos);
      const pendingTodos = result.filter((todo) => todo.status === "pending");
      const completedTodos = result.filter(
        (todo) => todo.status === "completed"
      );

      expect(pendingTodos).toHaveLength(2);
      expect(completedTodos).toHaveLength(2);

      // 全てのpendingTodoがcompletedTodoより前に来るべき
      const lastPendingIndex = result.findIndex(
        (todo) => todo.status === "pending"
      );
      const firstCompletedIndex = result.findIndex(
        (todo) => todo.status === "completed"
      );

      expect(lastPendingIndex).toBeLessThan(firstCompletedIndex);
    });

    it("同じステータス内で優先度順にソートする（高 > 中 > 低）", () => {
      const result = sortTodosByPriority(mockTodos);
      const pendingTodos = result.filter((todo) => todo.status === "pending");

      expect(pendingTodos[0].priority).toBe("high");
      expect(pendingTodos[1].priority).toBe("medium");
    });

    it("元の配列を変更しない", () => {
      const originalTodos = [...mockTodos];
      sortTodosByPriority(mockTodos);

      expect(mockTodos).toEqual(originalTodos);
    });

    it("空配列を処理する", () => {
      const result = sortTodosByPriority([]);
      expect(result).toEqual([]);
    });

    it("単一のTodoを処理する", () => {
      const singleTodo = [mockTodos[0]];
      const result = sortTodosByPriority(singleTodo);
      expect(result).toEqual(singleTodo);
    });
  });
});
