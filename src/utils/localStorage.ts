import { Task, User } from "../types";

// Local storage keys
const TASKS_KEY = "tasks-management-tasks";
const USERS_KEY = "tasks-management-users";
const CURRENT_USER_KEY = "tasks-management-current-user";

// Tasks functions
export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return [];

  const tasksJson = localStorage.getItem(TASKS_KEY);
  if (!tasksJson) return [];

  try {
    const tasks = JSON.parse(tasksJson);
    return tasks.map((task: any) => ({
      ...task,
      createdAt: new Date(task.createdAt),
      updatedAt: new Date(task.updatedAt),
    }));
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
};

// Users functions
export const getUsers = (): User[] => {
  if (typeof window === "undefined") return [];

  const usersJson = localStorage.getItem(USERS_KEY);
  if (!usersJson) return [];

  try {
    return JSON.parse(usersJson);
  } catch (error) {
    console.error("Error parsing users from localStorage:", error);
    return [];
  }
};

export const saveUsers = (users: User[]): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// Current user functions
export const getCurrentUser = (): User | null => {
  if (typeof window === "undefined") return null;

  const userJson = localStorage.getItem(CURRENT_USER_KEY);
  if (!userJson) return null;

  try {
    return JSON.parse(userJson);
  } catch (error) {
    console.error("Error parsing current user from localStorage:", error);
    return null;
  }
};

export const saveCurrentUser = (user: User | null): void => {
  if (typeof window === "undefined") return;

  if (user) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(CURRENT_USER_KEY);
  }
};

// Initialize with default admin user if no users exist
export const initializeUsers = (): void => {
  if (typeof window === "undefined") return;

  const users = getUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: "1",
      tcKimlikNo: "12345678910", // This is a dummy TC Kimlik No for demo purposes
      name: "Admin User",
      isAdmin: true,
    };

    saveUsers([adminUser]);
  }
};
