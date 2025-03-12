"use client";

import React, { useState } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo } from "react-icons/fa";
import { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import Button from "./Button";
import TaskForm from "./TaskForm";

interface TaskCardProps {
  task: Task;
  userName: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, userName }) => {
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

  if (isEditing) {
    return (
      <div className="card p-4 mb-4 animate-fade-in">
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
      className={`card p-4 mb-4 transition-all hover:shadow-lg ${
        task.status === "complete"
          ? "border-l-4 border-green-500"
          : `priority-${task.priority || "medium"}`
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            <h3
              className={`text-lg font-semibold ${
                task.status === "complete" ? "status-complete" : ""
              }`}
            >
              {task.title}
            </h3>
          </div>
          <p
            className={`mt-1 ${
              task.status === "complete" ? "status-complete" : ""
            }`}
          >
            {task.description}
          </p>
          {user?.isAdmin && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Kullanıcı: {userName}
            </p>
          )}
          <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
