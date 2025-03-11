import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { Task, TasksState } from "../types";
import { getTasks, saveTasks } from "../utils/localStorage";
import { useAuth } from "./AuthContext";

interface TaskContextType extends TasksState {
  addTask: (
    title: string,
    description: string,
    priority: "low" | "medium" | "high"
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
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // Load tasks from localStorage on initial render
    const storedTasks = getTasks();
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = (
    title: string,
    description: string,
    priority: "low" | "medium" | "high" = "medium"
  ) => {
    if (!isAuthenticated || !user) return;

    const newTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: "incomplete",
      priority,
      userId: user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const updateTask = (
    taskId: string,
    updates: Partial<Omit<Task, "id" | "userId" | "createdAt" | "updatedAt">>
  ) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    // Check if user has permission to update this task
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
    return true;
  };

  const deleteTask = (taskId: string) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    // Check if user has permission to delete this task
    if (task.userId !== user.id && !user.isAdmin) {
      return false;
    }

    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    return true;
  };

  const toggleTaskStatus = (taskId: string) => {
    if (!isAuthenticated || !user) return false;

    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return false;

    const task = tasks[taskIndex];

    // Check if user has permission to update this task
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
    return true;
  };

  const getUserTasks = () => {
    if (!isAuthenticated || !user) return [];
    return tasks.filter((task) => task.userId === user.id);
  };

  const getAllTasks = () => {
    if (!isAuthenticated || !user) return [];

    // If user is admin, return all tasks
    if (user.isAdmin) {
      return tasks;
    }

    // Otherwise, return only user's tasks
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
