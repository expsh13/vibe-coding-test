import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { TodoApp } from "../TodoApp";

describe("TodoApp統合テスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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
