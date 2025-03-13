import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TasksState, User } from "../types";
import {
  getTasks,
  saveTasks,
  saveTask,
  getUsers,
  saveUsers,
  getCurrentUser,
  saveCurrentUser,
} from "../utils/localStorage";
import { useAuth } from "./AuthContext";

interface TaskContextType extends TasksState {
  addTask: (
    title: string,
    description: string,
    priority: "low" | "medium" | "high",
    userId: string
  ) => void;
  updateTask: (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ) => boolean;
  deleteTask: (taskId: string) => boolean;
  toggleTaskStatus: (taskId: string) => boolean;
  getUserTasks: () => Task[];
  getAllTasks: () => Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTasks must be used within a TaskProvider");
  }
  return context;
};

interface TaskProviderProps {
  children: ReactNode;
}

export const TaskProvider: React.FC<TaskProviderProps> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const storedTasks = getTasks();
    setTasks(storedTasks);
    setIsLoaded(true);

    console.log("Initial tasks loaded:", storedTasks);
    console.log("localStorage state:", {
      tasks: localStorage.getItem("tasks"),
      managementTasks: localStorage.getItem("tasks-management-tasks"),
      users: localStorage.getItem("tasks-management-users"),
      currentUser: localStorage.getItem("tasks-management-current-user"),
    });

    if (localStorage.getItem("tasks")) {
      localStorage.removeItem("tasks");
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    console.log("Tasks saved to localStorage:", tasks);
    saveTasks(tasks);
  }, [tasks, isLoaded]);

  const addTaskToUser = (userId: string, task: Task) => {
    const users = getUsers();
    const currentUser = getCurrentUser();

    const userToUpdate = users.find((user) => user.id === userId);

    if (userToUpdate) {
      if (!userToUpdate.tasks) userToUpdate.tasks = [];
      userToUpdate.tasks.push(task);
      saveUsers(users);
    } else if (currentUser && currentUser.id === userId) {
      if (!currentUser.tasks) currentUser.tasks = [];
      currentUser.tasks.push(task);
      saveCurrentUser(currentUser);
    }
  };

  const addTask = (
    title: string,
    description: string,
    priority: "low" | "medium" | "high" = "medium",
    userId: string
  ) => {
    if (!isAuthenticated || !user) return;

    const assignedUserId = userId || user.id;

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: "incomplete",
      priority,
      userName: user.name,
      userId: assignedUserId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);

    saveTasks(updatedTasks);

    addTaskToUser(assignedUserId, newTask);
  };

  const updateTask = (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    if (task.userId !== user.id && !user.isAdmin) {
      return false;
    }

    const updatedTask = {
      ...task,
      ...updates,
      updatedAt: new Date(),
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return true;
  };

  const deleteTask = (taskId: string) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    if (task.userId !== user.id && !user.isAdmin) {
      return false;
    }

    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return true;
  };

  const toggleTaskStatus = (taskId: string) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    if (task.userId !== user.id && !user.isAdmin) {
      return false;
    }

    const newStatus: "incomplete" | "complete" =
      task.status === "incomplete" ? "complete" : "incomplete";

    const updatedTask = {
      ...task,
      status: newStatus,
      updatedAt: new Date(),
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = updatedTask;

    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return true;
  };

  const getUserTasks = () => {
    if (!isAuthenticated || !user) return [];
    return tasks.filter((task) => task.userId === user.id);
  };

  const getAllTasks = () => {
    if (!isAuthenticated || !user) return [];

    if (user.isAdmin) {
      return tasks;
    }

    return tasks.filter((task) => task.userId === user.id);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskStatus,
        getUserTasks,
        getAllTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};
