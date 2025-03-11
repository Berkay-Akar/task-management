import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo, FaFlag } from "react-icons/fa";
import { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [isEditing, setIsEditing] = useState(false);
  const { toggleTaskStatus, deleteTask } = useTasks();
  const { user } = useAuth();

  const handleToggleStatus = () => {
    toggleTaskStatus(task.id);
  };

  const handleDelete = () => {
    if (window.confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      deleteTask(task.id);
    }
  };

  const canEdit = user?.isAdmin || user?.id === task.userId;

  const priorityColors = {
    low: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    medium:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  };

  const priorityLabels = {
    low: "Düşük",
    medium: "Orta",
    high: "Yüksek",
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 animate-fade-in">
        <TaskForm
          task={task}
          onCancel={() => setIsEditing(false)}
          onSuccess={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg ${
        task.status === "complete"
          ? "border-l-4 border-green-500"
          : task.priority === "high"
          ? "border-l-4 border-red-500"
          : task.priority === "medium"
          ? "border-l-4 border-yellow-500"
          : "border-l-4 border-blue-500"
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3
              className={`text-lg font-semibold ${
                task.status === "complete" ? "line-through text-gray-500" : ""
              }`}
            >
              {task.title}
            </h3>
            <span
              className={`ml-2 text-xs px-2 py-1 rounded-full ${
                priorityColors[task.priority || "medium"]
              }`}
            >
              <FaFlag className="inline mr-1" size={10} />
              {priorityLabels[task.priority || "medium"]}
            </span>
          </div>
          <p
            className={`mt-1 text-gray-600 dark:text-gray-300 ${
              task.status === "complete" ? "line-through text-gray-400" : ""
            }`}
          >
            {task.description}
          </p>
          <div className="mt-2 text-xs text-gray-500">
            {new Date(task.updatedAt).toLocaleString("tr-TR")}
          </div>
        </div>

        <div className="flex space-x-2">
          {canEdit && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleStatus}
                title={
                  task.status === "complete"
                    ? "Tamamlanmadı olarak işaretle"
                    : "Tamamlandı olarak işaretle"
                }
              >
                {task.status === "complete" ? <FaUndo /> : <FaCheck />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
                title="Düzenle"
              >
                <FaEdit />
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={handleDelete}
                title="Sil"
              >
                <FaTrash />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
