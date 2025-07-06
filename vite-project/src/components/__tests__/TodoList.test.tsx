import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { TodoList } from "../TodoList";
import type { Todo } from "../../types/todo";

describe("TodoListコンポーネント", () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  const defaultProps = {
    todos: [],
    onToggle: mockOnToggle,
    onDelete: mockOnDelete,
  };

  const mockTodos: Todo[] = [
    {
      id: "1",
      content: "最初のTodo",
      status: "pending",
      priority: "high",
      createdAt: "2023-01-01T00:00:00.000Z",
    },
    {
      id: "2",
      content: "2番目のTodo",
      status: "completed",
      priority: "medium",
      createdAt: "2023-01-01T01:00:00.000Z",
    },
    {
      id: "3",
      content: "3番目のTodo",
      status: "in_progress",
      priority: "low",
      createdAt: "2023-01-01T02:00:00.000Z",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("Todoが提供されていない場合、空状態が表示される", () => {
    // Arrange - 空のTodoリストでコンポーネントを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} />);

    // Assert - 空状態の表示を確認
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
    expect(screen.getByText("Todoがありません")).toBeInTheDocument();
  });

  it("Todoが提供されていない場合、Todoリストはレンダリングされない", () => {
    // Arrange - 空のTodoリストでコンポーネントを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} />);

    // Assert - Todoリストが表示されないことを確認
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  it("Todoが提供された場合、Todoリストが表示される", () => {
    // Arrange - Todoリストを含むプロパティを準備
    
    // Act - Todoありでコンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - Todoリストの表示と空状態の非表示を確認
    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
  });

  it("全てのTodoがTodoItemコンポーネントとしてレンダリングされる", () => {
    // Arrange - 複数のTodoを含むプロパティを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - 各Todoの内容が表示されることを確認
    mockTodos.forEach((todo) => {
      expect(screen.getByTestId(`todo-content-${todo.id}`)).toBeInTheDocument();
      expect(screen.getByTestId(`todo-content-${todo.id}`)).toHaveTextContent(
        todo.content
      );
    });
  });

  it("正しい数のTodoアイテムがレンダリングされる", () => {
    // Arrange - 3つのTodoを含むプロパティを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - Todo数が一致することを確認
    const todoItems = screen.getAllByText(/Todo/i);
    expect(todoItems).toHaveLength(mockTodos.length);
  });

  it("TodoItemコンポーネントに正しいプロパティが渡される", () => {
    // Arrange - 異なる優先度のTodoを含むプロパティを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - 各Todo内容が正しく表示されることを確認
    expect(screen.getByText("最初のTodo")).toBeInTheDocument();
    expect(screen.getByText("2番目のTodo")).toBeInTheDocument();
    expect(screen.getByText("3番目のTodo")).toBeInTheDocument();
    
    // 全ての優先度レベルが表示されることを確認
    expect(screen.getByText("high")).toBeInTheDocument();
    expect(screen.getByText("medium")).toBeInTheDocument();
    expect(screen.getByText("low")).toBeInTheDocument();
  });

  it("TodoItemのチェックボックスがクリックされた時、onToggleが呼ばれる", () => {
    // Arrange - Todoリストとモック関数を準備
    
    // Act - コンポーネントをレンダリングし、チェックボックスをクリック
    render(<TodoList {...defaultProps} todos={mockTodos} />);
    const firstTodoCheckbox = screen.getByTestId("todo-checkbox-1");
    fireEvent.click(firstTodoCheckbox);

    // Assert - onToggleが正しいIDで呼ばれることを確認
    expect(mockOnToggle).toHaveBeenCalledWith("1");
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it("TodoItemの削除ボタンがクリックされた時、onDeleteが呼ばれる", () => {
    // Arrange - Todoリストとモック関数を準備
    
    // Act - コンポーネントをレンダリングし、削除ボタンをクリック
    render(<TodoList {...defaultProps} todos={mockTodos} />);
    const firstTodoDeleteButton = screen.getByTestId("todo-delete-1");
    fireEvent.click(firstTodoDeleteButton);

    // Assert - onDeleteが正しいIDで呼ばれることを確認
    expect(mockOnDelete).toHaveBeenCalledWith("1");
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it("単一のTodoが正しく処理される", () => {
    // Arrange - 単一のTodoを含む配列を準備
    const singleTodo = [mockTodos[0]];
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={singleTodo} />);

    // Assert - Todoリストが表示され、空状態が表示されないことを確認
    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
    expect(screen.getByText("最初のTodo")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
  });

  it("異なるステータスのTodoが正しくレンダリングされる", () => {
    // Arrange - 異なるステータスのTodoを含むプロパティを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - completedTodoにcompletedクラスが適用されることを確認
    const completedTodoContent = screen.getByTestId("todo-content-2");
    expect(completedTodoContent).toHaveClass("completed");

    // pendingTodoにcompletedクラスが適用されないことを確認
    const pendingTodoContent = screen.getByTestId("todo-content-1");
    expect(pendingTodoContent).not.toHaveClass("completed");
  });

  it("異なる優先度のTodoが正しくレンダリングされる", () => {
    // Arrange - 異なる優先度のTodoを含むプロパティを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - 優先度クラスが正しく適用されることを確認
    const priorities = ["high", "medium", "low"];
    priorities.forEach((priority) => {
      const priorityElement = screen.getByText(priority);
      expect(priorityElement).toHaveClass(`priority-${priority}`);
    });
  });

  it("propsで渡されたTodoの順序が維持される", () => {
    // Arrange - 特定の順序のTodoリストを準備
    
    // Act - コンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - Todo内容が正しい順序で表示されることを確認
    const todoContents = screen.getAllByTestId(/todo-content-/);
    
    expect(todoContents[0]).toHaveTextContent("最初のTodo");
    expect(todoContents[1]).toHaveTextContent("2番目のTodo");
    expect(todoContents[2]).toHaveTextContent("3番目のTodo");
  });

  it("空配列が正しく処理される", () => {
    // Arrange - 明示的に空配列を準備
    
    // Act - 空配列でコンポーネントをレンダリング
    render(<TodoList {...defaultProps} todos={[]} />);

    // Assert - 空状態が表示され、Todoリストが表示されないことを確認
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list")).not.toBeInTheDocument();
  });

  it("todosプロパティが変更された時、再レンダリングされる", () => {
    // Arrange - 初期状態として空配列を準備
    const { rerender } = render(<TodoList {...defaultProps} todos={[]} />);
    
    // Act - 空状態の確認後、Todoありで再レンダリング
    expect(screen.getByTestId("todo-list-empty")).toBeInTheDocument();
    
    rerender(<TodoList {...defaultProps} todos={mockTodos} />);

    // Assert - Todoリストが表示され、空状態が非表示になることを確認
    expect(screen.getByTestId("todo-list")).toBeInTheDocument();
    expect(screen.queryByTestId("todo-list-empty")).not.toBeInTheDocument();
  });

  it("全てのハンドラー関数がTodoItemコンポーネントに渡される", () => {
    // Arrange - 複数のTodoとモック関数を準備
    
    // Act - 異なるTodoのチェックボックスと削除ボタンをクリック
    render(<TodoList {...defaultProps} todos={mockTodos} />);
    const secondTodoCheckbox = screen.getByTestId("todo-checkbox-2");
    const thirdTodoDeleteButton = screen.getByTestId("todo-delete-3");
    
    fireEvent.click(secondTodoCheckbox);
    fireEvent.click(thirdTodoDeleteButton);

    // Assert - 各ハンドラーが正しいIDで1回ずつ呼ばれることを確認
    expect(mockOnToggle).toHaveBeenCalledWith("2");
    expect(mockOnDelete).toHaveBeenCalledWith("3");
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });
});