import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoItem } from "../TodoItem";
import type { Todo } from "../../types/todo";

describe("TodoItemコンポーネント", () => {
  // arrange - テスト用のモックデータと関数を定義
  const mockTodo: Todo = {
    id: "1",
    content: "テストTodo内容",
    status: "pending",
    priority: "medium",
    createdAt: "2023-01-01T00:00:00.000Z",
  };

  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps = {
    todo: mockTodo,
    onToggle: mockOnToggle,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Todo内容を表示する", () => {
    // Arrange - デフォルトプロパティを準備

    // Act - コンポーネントをレンダリング
    render(<TodoItem {...defaultProps} />);

    // Assert - Todo内容が正しく表示されることを確認
    expect(screen.getByTestId(`todo-content-${mockTodo.id}`)).toHaveTextContent(
      mockTodo.content
    );
  });

  it("Todo優先度を表示する", () => {
    // Arrange - デフォルトプロパティを準備

    // Act - コンポーネントをレンダリング
    render(<TodoItem {...defaultProps} />);

    // Assert - Todo優先度が表示されることを確認
    expect(screen.getByText(mockTodo.priority)).toBeInTheDocument();
  });

  it("pendingTodoでチェックボックスが未チェック状態で表示される", () => {
    render(<TodoItem {...defaultProps} />);

    const checkbox = screen.getByTestId(`todo-checkbox-${mockTodo.id}`);
    expect(checkbox).not.toBeChecked();
  });

  it("completedTodoでチェックボックスがチェック状態で表示される", () => {
    const completedTodo: Todo = {
      ...mockTodo,
      status: "completed",
    };

    render(<TodoItem {...defaultProps} todo={completedTodo} />);

    const checkbox = screen.getByTestId(`todo-checkbox-${completedTodo.id}`);
    expect(checkbox).toBeChecked();
  });

  it("Todoが完了済みの場合、内容にcompletedクラスが適用される", () => {
    const completedTodo: Todo = {
      ...mockTodo,
      status: "completed",
    };

    render(<TodoItem {...defaultProps} todo={completedTodo} />);

    const content = screen.getByTestId(`todo-content-${completedTodo.id}`);
    expect(content).toHaveClass("completed");
  });

  it("Todoが未完了の場合、内容にcompletedクラスが適用されない", () => {
    render(<TodoItem {...defaultProps} />);

    const content = screen.getByTestId(`todo-content-${mockTodo.id}`);
    expect(content).not.toHaveClass("completed");
  });

  it("優先度spanに優先度クラスが適用される", () => {
    render(<TodoItem {...defaultProps} />);

    const prioritySpan = screen.getByText(mockTodo.priority);
    expect(prioritySpan).toHaveClass(`priority-${mockTodo.priority}`);
  });

  it("チェックボックスをクリックするとonToggleが呼ばれる", () => {
    // Arrange - コンポーネントをレンダリング
    render(<TodoItem {...defaultProps} />);

    // Act - チェックボックスをクリック
    const checkbox = screen.getByTestId(`todo-checkbox-${mockTodo.id}`);
    fireEvent.click(checkbox);

    // Assert - onToggleが正しいIDで呼ばれることを確認
    expect(mockOnToggle).toHaveBeenCalledWith(mockTodo.id);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("削除ボタンをクリックするとonDeleteが呼ばれる", () => {
    render(<TodoItem {...defaultProps} />);

    const deleteButton = screen.getByTestId(`todo-delete-${mockTodo.id}`);
    fireEvent.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(mockTodo.id);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("削除ボタンに正しいテキストが表示される", () => {
    render(<TodoItem {...defaultProps} />);

    const deleteButton = screen.getByTestId(`todo-delete-${mockTodo.id}`);
    expect(deleteButton).toHaveTextContent("削除");
  });

  it("全ての優先度レベルが正しく表示される", () => {
    const priorities: Array<Todo["priority"]> = ["high", "medium", "low"];

    priorities.forEach((priority) => {
      const todoWithPriority: Todo = {
        ...mockTodo,
        priority,
      };

      const { unmount } = render(
        <TodoItem {...defaultProps} todo={todoWithPriority} />
      );

      expect(screen.getByText(priority)).toBeInTheDocument();
      expect(screen.getByText(priority)).toHaveClass(`priority-${priority}`);

      unmount();
    });
  });

  it("異なるTodoステータスが正しく表示される", () => {
    const statuses: Array<Todo["status"]> = [
      "pending",
      "in_progress",
      "completed",
    ];

    statuses.forEach((status) => {
      const todoWithStatus: Todo = {
        ...mockTodo,
        status,
      };

      const { unmount } = render(
        <TodoItem {...defaultProps} todo={todoWithStatus} />
      );

      const checkbox = screen.getByTestId(`todo-checkbox-${todoWithStatus.id}`);
      const content = screen.getByTestId(`todo-content-${todoWithStatus.id}`);

      if (status === "completed") {
        expect(checkbox).toBeChecked();
        expect(content).toHaveClass("completed");
      } else {
        expect(checkbox).not.toBeChecked();
        expect(content).not.toHaveClass("completed");
      }

      unmount();
    });
  });
});
