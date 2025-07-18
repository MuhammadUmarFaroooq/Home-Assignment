// types/task.ts
export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assignee_id: string;
  due_date: Date;
  attachment_url?: string;
}

// Mock users data
export const users = [
  { id: '1', name: 'John Doe', avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', name: 'Jane Smith', avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: '3', name: 'Bob Johnson', avatar: 'https://i.pravatar.cc/150?img=3' },
];

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Implement authentication',
    description: 'Set up JWT authentication for the app',
    status: 'todo',
    priority: 'high',
    assignee_id: '1',
    due_date: new Date('2023-12-15'),
  },
  {
    id: '2',
    title: 'Design dashboard UI',
    description: 'Create mockups for the dashboard page',
    status: 'in_progress',
    priority: 'medium',
    assignee_id: '2',
    due_date: new Date('2023-12-10'),
  },
  {
    id: '3',
    title: 'Fix login bug',
    description: 'Users unable to login on mobile devices',
    status: 'done',
    priority: 'high',
    assignee_id: '3',
    due_date: new Date('2023-12-05'),
  },
  {
    id: '4',
    title: 'Write API documentation',
    status: 'todo',
    priority: 'low',
    assignee_id: '1',
    due_date: new Date('2023-12-20'),
  },
];