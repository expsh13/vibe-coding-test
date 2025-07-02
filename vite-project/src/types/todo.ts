export interface Todo {
  id: string;
  content: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  createdAt: string;
  completedAt?: string;
  updatedAt?: string;
}

export type TodoStatus = Todo['status'];
export type TodoPriority = Todo['priority'];