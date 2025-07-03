import { Todo } from '../types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className="todo-item">
      <input
        type="checkbox"
        checked={todo.status === 'completed'}
        onChange={() => onToggle(todo.id)}
        data-testid={`todo-checkbox-${todo.id}`}
      />
      <span
        className={`todo-content ${todo.status === 'completed' ? 'completed' : ''}`}
        data-testid={`todo-content-${todo.id}`}
      >
        {todo.content}
      </span>
      <span className={`todo-priority priority-${todo.priority}`}>
        {todo.priority}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        data-testid={`todo-delete-${todo.id}`}
        className="delete-button"
      >
        削除
      </button>
    </div>
  )
}