import React, { useState, useEffect } from "react";
import { Task, User } from "../types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Button from "./Button";
import { FaPlus } from "react-icons/fa";
import { getUsers } from "../utils/localStorage";

interface TaskListProps {
  tasks: Task[];
  showAddForm?: boolean;
  searchTerm: string;
  filter: "all" | "priority" | "date";
  priorityOrder: "asc" | "desc";
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  showAddForm = true,
  searchTerm,
  filter,
  priorityOrder,
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Fetch users when the component mounts
    const fetchedUsers = getUsers();
    setUsers(fetchedUsers);
  }, []);

  const filteredTasks = tasks.filter(
    (task) =>
      task?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || false
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "incomplete" ? -1 : 1;
    }

    if (filter === "priority") {
      const priorityOrderMap =
        priorityOrder === "asc"
          ? { low: 0, medium: 1, high: 2 }
          : { high: 0, medium: 1, low: 2 };
      const aPriority = a.priority || "medium";
      const bPriority = b.priority || "medium";

      if (aPriority !== bPriority) {
        return priorityOrderMap[aPriority] - priorityOrderMap[bPriority];
      }
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div>
      {showAddForm && (
        <div className="mb-6">
          {isAddingTask ? (
            <div className="card p-4 animate-fade-in">
              <h3 className="text-lg font-semibold mb-3">Yeni Görev Ekle</h3>
              <TaskForm
                onSuccess={() => setIsAddingTask(false)}
                onCancel={() => setIsAddingTask(false)}
              />
            </div>
          ) : (
            <Button
              onClick={() => setIsAddingTask(true)}
              variant="primary"
              leftIcon={<FaPlus />}
              className="w-full sm:w-auto"
            >
              Yeni Görev Ekle
            </Button>
          )}
        </div>
      )}

      {sortedTasks.length === 0 && !isAddingTask ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Henüz görev bulunmamaktadır.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => {
            if (!task || typeof task !== "object") return null;
            const user = users.find((u) => u.id === task.userId);
            return (
              <TaskCard
                key={task.id}
                task={task}
                userName={user?.name || task.userName || "Unknown User"}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
