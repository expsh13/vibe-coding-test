import { useState } from "react";
import type { TodoPriority } from "../types/todo";

interface AddTodoProps {
  onAdd: (content: string, priority: TodoPriority) => void;
}

export function AddTodo({ onAdd }: AddTodoProps) {
  const [content, setContent] = useState("");
  const [priority, setPriority] = useState<TodoPriority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onAdd(content.trim(), priority);
      setContent("");
      setPriority("medium");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="add-todo-form"
      data-testid="add-todo-form"
    >
      <div className="form-group">
        <label htmlFor="todo-input">Todo内容</label>
        <input
          id="todo-input"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="新しいTodoを入力してください"
          data-testid="add-todo-input"
          className="todo-input"
        />
      </div>
      <div className="form-group">
        <label htmlFor="priority-select">優先度</label>
        <select
          id="priority-select"
          value={priority}
          onChange={(e) => setPriority(e.target.value as TodoPriority)}
          data-testid="add-todo-priority"
          className="priority-select"
        >
          <option value="low">低</option>
          <option value="medium">中</option>
          <option value="high">高</option>
        </select>
      </div>
      <button
        type="submit"
        disabled={!content.trim()}
        data-testid="add-todo-submit"
        className="submit-button"
      >
        追加
      </button>
    </form>
  );
}
