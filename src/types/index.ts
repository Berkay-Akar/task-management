export interface User {
  id: string;
  tcKimlikNo: string;
  name: string;
  isAdmin: boolean;
  tasks?: Task[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: "incomplete" | "complete";
  priority: "low" | "medium" | "high";
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  userName: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface TasksState {
  tasks: Task[];
}
