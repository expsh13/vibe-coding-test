import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoApp } from "../TodoApp";
import { TodoAppWithApi } from "../TodoAppWithApi";

describe("TodoApp統合テスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("ローカル状態版", () => {
    it("新しいTodoを追加すると一覧に表示される", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoApp />);

      // Act - 新しいTodoを追加
      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /追加/i });

      fireEvent.change(input, { target: { value: "新しいタスク" } });
      fireEvent.click(addButton);

      // Assert - 一覧に新しいTodoが表示される
      await waitFor(() => {
        expect(screen.getByText("新しいタスク")).toBeInTheDocument();
      });
    });

    it("複数のTodoを追加して一覧表示される", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoApp />);

      // Act - 2つのTodoを追加
      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /追加/i });

      fireEvent.change(input, { target: { value: "最初のタスク" } });
      fireEvent.click(addButton);

      fireEvent.change(input, { target: { value: "2番目のタスク" } });
      fireEvent.click(addButton);

      // Assert - 両方のTodoが表示される
      await waitFor(() => {
        expect(screen.getByText("最初のタスク")).toBeInTheDocument();
        expect(screen.getByText("2番目のタスク")).toBeInTheDocument();
      });
    });
  });

  describe("API版 - MSW統合テスト", () => {
    it("初期データがMSWから読み込まれる", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoAppWithApi />);

      // Act - 読み込み完了を待つ
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      // Assert - MSWのモックデータが表示される
      expect(screen.getByText("モックTodo1")).toBeInTheDocument();
      expect(screen.getByText("モックTodo2")).toBeInTheDocument();
    });

    it("新しいTodoをAPI経由で追加する", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoAppWithApi />);

      // 初期データの読み込み完了を待つ
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      // Act - 新しいTodoを追加
      const input = screen.getByRole("textbox");
      const addButton = screen.getByRole("button", { name: /追加/i });

      fireEvent.change(input, { target: { value: "API経由で追加" } });
      fireEvent.click(addButton);

      // Assert - MSW経由で追加されたTodoが表示される
      await waitFor(() => {
        expect(screen.getByText("API経由で追加")).toBeInTheDocument();
      });
    });

    it("TodoをAPI経由で完了状態に更新する", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoAppWithApi />);

      // 初期データの読み込み完了を待つ
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      // Act - 最初のTodoのチェックボックスをクリック
      const checkboxes = screen.getAllByRole("checkbox");
      fireEvent.click(checkboxes[0]);

      // Assert - API経由で更新されてチェック状態が反映される
      await waitFor(() => {
        expect(checkboxes[0]).toBeChecked();
      });
    });

    it("TodoをAPI経由で削除する", async () => {
      // Arrange - コンポーネントをレンダリング
      render(<TodoAppWithApi />);

      // 初期データの読み込み完了を待つ
      await waitFor(() => {
        expect(screen.queryByTestId("loading")).not.toBeInTheDocument();
      });

      // Act - 最初のTodoの削除ボタンをクリック
      const deleteButtons = screen.getAllByText(/削除/i);
      const firstTodoText = screen.getByText("モックTodo1");

      fireEvent.click(deleteButtons[0]);

      // Assert - API経由で削除されて一覧から消える
      await waitFor(() => {
        expect(firstTodoText).not.toBeInTheDocument();
      });
    });

    it("API読み込みエラー時にエラーメッセージを表示する", async () => {
      // Arrange - MSWでエラーレスポンスを設定
      const { server } = await import("../../mocks/node");
      const { http, HttpResponse } = await import("msw");

      server.use(
        http.get("/api/todos", () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      // Act - コンポーネントをレンダリング
      render(<TodoAppWithApi />);

      // Assert - エラーメッセージが表示される
      await waitFor(() => {
        expect(screen.getByTestId("error")).toBeInTheDocument();
        expect(screen.getByText("Todoの読み込みに失敗しました")).toBeInTheDocument();
      });
    });
  });
});