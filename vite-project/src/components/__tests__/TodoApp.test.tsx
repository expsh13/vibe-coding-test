import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoApp } from "../TodoApp";
import {
  createTodo,
  toggleTodoStatus,
  sortTodosByPriority,
} from "../../utils/todo";

// モック関数を使ってユーティリティ関数をより予測可能にする
vi.mock("../../utils/todo", () => ({
  createTodo: vi.fn((content, priority) => ({
    id: `mock-id-${Date.now()}`,
    content,
    status: "pending",
    priority,
    createdAt: "2023-01-01T00:00:00.000Z",
  })),
  toggleTodoStatus: vi.fn((todo) => ({
    ...todo,
    status: todo.status === "completed" ? "pending" : "completed",
    completedAt:
      todo.status === "completed" ? undefined : "2023-01-01T12:00:00.000Z",
    updatedAt: "2023-01-01T12:00:00.000Z",
  })),
  sortTodosByPriority: vi.fn((todos) => [...todos]),
}));

describe("TodoAppコンポーネント", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("メインアプリの構造がレンダリングされる", () => {
    // Arrange - 初期状態の準備

    // Act - コンポーネントをレンダリング
    render(<TodoApp />);

    // Assert - 必要な要素が全て表示されることを確認
    expect(screen.getByTestId("todo-app")).toBeInTheDocument();
    expect(screen.getByText("Todo App")).toBeInTheDocument();
    expect(screen.getByTestId("add-todo-form")).toBeInTheDocument();
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
  });

  it("空のTodoリストで開始される", () => {
    // Arrange - 初期状態の準備

    // Act - コンポーネントをレンダリング
    render(<TodoApp />);

    // Assert - 空状態が表示されることを確認
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
    expect(screen.getByText("Todoがありません")).toBeInTheDocument();
  });

  it("フォーム送信時に新しいTodoが追加される", async () => {
    // Arrange - 入力データを準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - フォームに入力して送信
    fireEvent.change(input, { target: { value: "新しいTodoアイテム" } });
    fireEvent.click(submitButton);

    // Assert - Todoが追加されることを確認
    await waitFor(() => {
      expect(screen.getByText("新しいTodoアイテム")).toBeInTheDocument();
    });

    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
  });

  it("カスタム優先度でTodoが追加される", async () => {
    // Arrange - カスタム優先度の入力データを準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const prioritySelect = screen.getByTestId("add-todo-priority");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - 高優先度でTodoを作成
    fireEvent.change(input, { target: { value: "高優先度Todo" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.click(submitButton);

    // Assert - 高優先度Todoが作成されることを確認
    await waitFor(() => {
      expect(screen.getByText("高優先度Todo")).toBeInTheDocument();
      expect(screen.getByText("high")).toBeInTheDocument();
    });
  });

  it("チェックボックスクリック時にTodoステータスが切り替わる", async () => {
    // Arrange - Todoを追加してからテスト
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    fireEvent.change(input, { target: { value: "切り替えテストTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("切り替えテストTodo")).toBeInTheDocument();
    });

    // Act - チェックボックスをクリック
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Assert - toggleTodoStatusが呼ばれることを確認
    expect(vi.mocked(toggleTodoStatus)).toHaveBeenCalled();
  });

  it("削除ボタンクリック時にTodoが削除される", async () => {
    // Arrange - Todoを追加してからテスト
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    fireEvent.change(input, { target: { value: "削除テストTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("削除テストTodo")).toBeInTheDocument();
    });

    // Act - 削除ボタンをクリック
    const deleteButton = screen.getByText("削除");
    fireEvent.click(deleteButton);

    // Assert - Todoが削除されることを確認
    await waitFor(() => {
      expect(screen.queryByText("削除テストTodo")).not.toBeInTheDocument();
    });

    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
  });

  it("複数のTodoが正しく処理される", async () => {
    // Arrange - 複数のTodo作成の準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - 複数のTodoを追加
    fireEvent.change(input, { target: { value: "最初のTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("最初のTodo")).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "2番目のTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("2番目のTodo")).toBeInTheDocument();
    });

    // Assert - 両方のTodoが表示されることを確認
    expect(screen.getByText("最初のTodo")).toBeInTheDocument();
    expect(screen.getByText("2番目のTodo")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
  });

  it("新しいTodo追加時に優先度でソートされる", async () => {
    // Arrange - Todoとモック関数の準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - Todoを追加
    fireEvent.change(input, { target: { value: "テストTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("テストTodo")).toBeInTheDocument();
    });

    // Assert - sortTodosByPriorityが呼ばれることを確認
    expect(vi.mocked(sortTodosByPriority)).toHaveBeenCalled();
  });

  it("ステータス切り替え時に優先度でソートされる", async () => {
    // Arrange - Todoを追加してからテスト
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    fireEvent.change(input, { target: { value: "切り替えTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("切り替えTodo")).toBeInTheDocument();
    });

    // Act - Todoのステータスを切り替え
    const checkbox = screen.getByRole("checkbox");
    fireEvent.click(checkbox);

    // Assert - sortTodosByPriorityが2回呼ばれることを確認（追加時と切り替え時）
    expect(vi.mocked(sortTodosByPriority)).toHaveBeenCalledTimes(2);
  });

  it("createTodoが正しいパラメータで呼ばれる", async () => {
    // Arrange - 入力データの準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const prioritySelect = screen.getByTestId("add-todo-priority");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - 特定の内容と優先度でTodoを作成
    fireEvent.change(input, { target: { value: "テストTodo内容" } });
    fireEvent.change(prioritySelect, { target: { value: "low" } });
    fireEvent.click(submitButton);

    // Assert - createTodoが正しい引数で呼ばれることを確認
    expect(vi.mocked(createTodo)).toHaveBeenCalledWith("テストTodo内容", "low");
  });

  it("正しい階層でレンダリングされる", () => {
    // Arrange - コンポーネントの準備

    // Act - コンポーネントをレンダリング
    render(<TodoApp />);

    // Assert - 主要コンポーネントの存在を確認
    const app = screen.getByTestId("todo-app");
    expect(app).toBeInTheDocument();

    expect(screen.getByText("Todo App")).toBeInTheDocument();
    expect(screen.getByTestId("add-todo-form")).toBeInTheDocument();
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
  });

  it("Todo追加後にフォームがリセットされる", async () => {
    // Arrange - フォーム入力の準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input") as HTMLInputElement;
    const prioritySelect = screen.getByTestId(
      "add-todo-priority"
    ) as HTMLSelectElement;
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - フォームに入力して送信
    fireEvent.change(input, { target: { value: "テストTodo" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("テストTodo")).toBeInTheDocument();
    });

    // Assert - フォームがリセットされることを確認
    expect(input.value).toBe("");
    expect(prioritySelect.value).toBe("medium");
  });

  it("操作全体を通してTodoステートが正しく維持される", async () => {
    // Arrange - 複数の操作テストの準備
    render(<TodoApp />);
    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    // Act - 複数のTodoを追加
    fireEvent.change(input, { target: { value: "最初のTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("最初のTodo")).toBeInTheDocument();
    });

    fireEvent.change(input, { target: { value: "2番目のTodo" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("2番目のTodo")).toBeInTheDocument();
    });

    // 一つのTodoを削除
    const deleteButtons = screen.getAllByText("削除");
    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("2番目のTodo")).toBeInTheDocument();
    });

    // Assert - 一つのTodoが残り、空状態が表示されないことを確認
    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
  });
});
