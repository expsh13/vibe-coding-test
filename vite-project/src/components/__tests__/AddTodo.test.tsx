import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { AddTodo } from "../AddTodo";
import type { TodoPriority } from "../../types/todo";

describe("AddTodoコンポーネント", () => {
  // arrange - テスト用のモック関数とデフォルトプロパティを定義
  const mockOnAdd = vi.fn();

  const defaultProps = {
    onAdd: mockOnAdd,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("全ての要素を持つフォームが表示される", () => {
    // Arrange - デフォルトプロパティを準備

    // Act - コンポーネントをレンダリング
    render(<AddTodo {...defaultProps} />);

    // Assert - 必要なフォーム要素が全て表示されることを確認
    expect(screen.getByTestId("add-todo-form")).toBeInTheDocument();
    expect(screen.getByTestId("add-todo-input")).toBeInTheDocument();
    expect(screen.getByTestId("add-todo-priority")).toBeInTheDocument();
    expect(screen.getByTestId("add-todo-submit")).toBeInTheDocument();
  });

  it("正しいプレースホルダーとラベルが表示される", () => {
    render(<AddTodo {...defaultProps} />);

    expect(screen.getByLabelText("Todo内容")).toBeInTheDocument();
    expect(screen.getByLabelText("優先度")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("新しいTodoを入力してください")
    ).toBeInTheDocument();
  });

  it("全ての選択肢を持つ優先度セレクトが表示される", () => {
    render(<AddTodo {...defaultProps} />);

    const prioritySelect = screen.getByTestId("add-todo-priority");
    expect(prioritySelect).toBeInTheDocument();

    expect(screen.getByDisplayValue("中")).toBeInTheDocument(); // デフォルトのmedium
    expect(screen.getByText("低")).toBeInTheDocument();
    expect(screen.getByText("中")).toBeInTheDocument();
    expect(screen.getByText("高")).toBeInTheDocument();
  });

  it("デフォルトで中優先度が選択されている", () => {
    render(<AddTodo {...defaultProps} />);

    const prioritySelect = screen.getByTestId(
      "add-todo-priority"
    ) as HTMLSelectElement;
    expect(prioritySelect.value).toBe("medium");
  });

  it("入力が空の場合、送信ボタンが無効になる", () => {
    render(<AddTodo {...defaultProps} />);

    const submitButton = screen.getByTestId("add-todo-submit");
    expect(submitButton).toBeDisabled();
  });

  it("入力に内容がある場合、送信ボタンが有効になる", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    fireEvent.change(input, { target: { value: "テストTodo" } });

    expect(submitButton).not.toBeDisabled();
  });

  it("入力が空白のみの場合、送信ボタンが無効になる", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input");
    const submitButton = screen.getByTestId("add-todo-submit");

    fireEvent.change(input, { target: { value: "   " } });

    expect(submitButton).toBeDisabled();
  });

  it("入力値が正しく更新される", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input") as HTMLInputElement;

    fireEvent.change(input, { target: { value: "新しいTodoアイテム" } });

    expect(input.value).toBe("新しいTodoアイテム");
  });

  it("優先度選択が正しく更新される", () => {
    render(<AddTodo {...defaultProps} />);

    const prioritySelect = screen.getByTestId(
      "add-todo-priority"
    ) as HTMLSelectElement;

    fireEvent.change(prioritySelect, { target: { value: "high" } });

    expect(prioritySelect.value).toBe("high");
  });

  it("フォーム送信時に正しいパラメータでonAddが呼ばれる", () => {
    // Arrange - コンポーネントとフォーム要素を準備
    render(<AddTodo {...defaultProps} />);
    const input = screen.getByTestId("add-todo-input");
    const prioritySelect = screen.getByTestId("add-todo-priority");
    const form = screen.getByTestId("add-todo-form");

    // Act - フォームに入力して送信
    fireEvent.change(input, { target: { value: "テストTodo内容" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.submit(form);

    // Assert - onAddが正しいパラメータで呼ばれることを確認
    expect(mockOnAdd).toHaveBeenCalledWith("テストTodo内容", "high");
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it("トリムされた内容でonAddが呼ばれる", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input");
    const form = screen.getByTestId("add-todo-form");

    fireEvent.change(input, {
      target: { value: "  スペース付きテストTodo  " },
    });
    fireEvent.submit(form);

    expect(mockOnAdd).toHaveBeenCalledWith("スペース付きテストTodo", "medium");
  });

  it("送信成功後にフォームがリセットされる", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input") as HTMLInputElement;
    const prioritySelect = screen.getByTestId(
      "add-todo-priority"
    ) as HTMLSelectElement;
    const form = screen.getByTestId("add-todo-form");

    fireEvent.change(input, { target: { value: "テストTodo" } });
    fireEvent.change(prioritySelect, { target: { value: "high" } });
    fireEvent.submit(form);

    expect(input.value).toBe("");
    expect(prioritySelect.value).toBe("medium");
  });

  it("空の内容でフォーム送信してもonAddが呼ばれない", () => {
    render(<AddTodo {...defaultProps} />);

    const form = screen.getByTestId("add-todo-form");

    fireEvent.submit(form);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("空白のみの内容でフォーム送信してもonAddが呼ばれない", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input");
    const form = screen.getByTestId("add-todo-form");

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.submit(form);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it("全ての優先度値が正しく処理される", () => {
    const priorities: TodoPriority[] = ["low", "medium", "high"];

    priorities.forEach((priority) => {
      const { unmount } = render(<AddTodo {...defaultProps} />);

      const input = screen.getByTestId("add-todo-input");
      const prioritySelect = screen.getByTestId("add-todo-priority");
      const form = screen.getByTestId("add-todo-form");

      fireEvent.change(input, {
        target: { value: `${priority}優先度Todo` },
      });
      fireEvent.change(prioritySelect, { target: { value: priority } });
      fireEvent.submit(form);

      expect(mockOnAdd).toHaveBeenCalledWith(`${priority}優先度Todo`, priority);

      unmount();
      vi.clearAllMocks();
    });
  });

  it("preventDefaultが呼ばれてフォーム送信が阻止される", () => {
    render(<AddTodo {...defaultProps} />);

    const input = screen.getByTestId("add-todo-input");
    const form = screen.getByTestId("add-todo-form");

    fireEvent.change(input, { target: { value: "テストTodo" } });

    const submitEvent = new Event("submit", {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = vi.spyOn(submitEvent, "preventDefault");

    fireEvent(form, submitEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});
