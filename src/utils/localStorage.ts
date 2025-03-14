import { Task, User } from "../types";

const TASKS_KEY = "tasks-management-tasks";
const USERS_KEY = "tasks-management-users";
const CURRENT_USER_KEY = "tasks-management-current-user";

// Tasks functions
export const getTasks = (): Task[] => {
  if (typeof window === "undefined") return [];

  const tasksJson = localStorage.getItem(TASKS_KEY);
  const oldTasksJson = localStorage.getItem("tasks");

  if (!tasksJson && oldTasksJson) {
    try {
      const oldTasks = JSON.parse(oldTasksJson);
      if (Array.isArray(oldTasks) && oldTasks.length > 0) {
        saveTasks(oldTasks);
        // Remove old data
        localStorage.removeItem("tasks");
        return oldTasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }));
      }
    } catch (error) {
      console.error("Error migrating old tasks:", error);
    }
  }

  if (!tasksJson) return [];

  try {
    const tasks = JSON.parse(tasksJson);
    return Array.isArray(tasks)
      ? tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }))
      : [];
  } catch (error) {
    console.error("Error parsing tasks from localStorage:", error);
    return [];
  }
};

export const saveTasks = (tasks: Task[]): void => {
  if (typeof window === "undefined") return;

  try {
    const tasksToSave = tasks.map((task) => ({
      ...task,
      createdAt:
        task.createdAt instanceof Date
          ? task.createdAt.toISOString()
          : task.createdAt,
      updatedAt:
        task.updatedAt instanceof Date
          ? task.updatedAt.toISOString()
          : task.updatedAt,
    }));

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasksToSave));

    if (localStorage.getItem("tasks")) {
      localStorage.removeItem("tasks");
    }
  } catch (error) {
    console.error("Error saving tasks to localStorage:", error);
  }
};

export const saveTask = (task: Task): void => {
  if (typeof window === "undefined") return;

  try {
    const tasks = getTasks();
    const existingTaskIndex = tasks.findIndex((t) => t.id === task.id);

    const taskToSave = {
      ...task,
      createdAt:
        task.createdAt instanceof Date
          ? task.createdAt
          : new Date(task.createdAt),
      updatedAt:
        task.updatedAt instanceof Date
          ? task.updatedAt
          : new Date(task.updatedAt),
    };

    if (existingTaskIndex >= 0) {
      tasks[existingTaskIndex] = taskToSave;
    } else {
      tasks.push(taskToSave);
    }

    saveTasks(tasks);
  } catch (error) {
    console.error("Error saving task to localStorage:", error);
  }
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

export const initializeUsers = (): void => {
  if (typeof window === "undefined") return;

  const users = getUsers();
  if (users.length === 0) {
    const adminUser: User = {
      id: "1",
      tcKimlikNo: "10000000146",
      name: "Admin User",
      isAdmin: true,
    };

    saveUsers([adminUser]);
  }
};
