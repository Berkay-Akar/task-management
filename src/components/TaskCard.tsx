"use client";

import React, { useRef, useContext } from "react";
import { FaEdit, FaTrash, FaCheck, FaUndo } from "react-icons/fa";
import { Task } from "../types";
import { TaskContext } from "../context/TaskContext";
import Button from "./Button";

interface TaskCardProps {
  task: Task;
  userName: string;
  onEdit: (taskId: string, cardElement: HTMLElement) => void;
  canEdit: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userName,
  onEdit,
  canEdit,
}) => {
  const { toggleTaskStatus, deleteTask } = useContext(TaskContext);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleToggleStatus = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskStatus(task.id);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Bu görevi silmek istediğinizden emin misiniz?")) {
      deleteTask(task.id);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (cardRef.current) {
      onEdit(task.id, cardRef.current);
    }
  };

  // Priority badge styles - IMPROVED CONTRAST
  const priorityStyles = {
    high: "bg-[var(--priority-high-bg)] text-[var(--priority-high-text)] border border-[var(--priority-high-border)] font-bold",
    medium:
      "bg-[var(--priority-medium-bg)] text-[var(--priority-medium-text)] border border-[var(--priority-medium-border)] font-bold",
    low: "bg-[var(--priority-low-bg)] text-[var(--priority-low-text)] border border-[var(--priority-low-border)] font-bold",
  };

  // Card background based on status and priority - ENHANCED CONTRAST
  const cardBackground =
    task.status === "complete"
      ? "bg-gray-100 dark:bg-gray-800/50 border-2 border-gray-300 dark:border-gray-700"
      : task.priority === "high"
      ? "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 border-l-[6px] border-l-red-500 dark:border-l-red-600"
      : task.priority === "medium"
      ? "bg-amber-50 dark:bg-amber-900/20 border-2 border-amber-200 dark:border-amber-800 border-l-[6px] border-l-amber-500 dark:border-l-amber-600"
      : "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 border-l-[6px] border-l-green-500 dark:border-l-green-600";

  const editButtonClass =
    "text-blue-700 hover:text-white hover:bg-blue-600 dark:text-blue-400 dark:hover:text-white dark:hover:bg-blue-800 border border-blue-200 hover:border-blue-600 dark:border-blue-800 dark:hover:border-blue-800 shadow-sm";

  const deleteButtonClass =
    "text-red-700  hover:text-white hover:bg-red-600 dark:text-red-400 dark:hover:text-red-100 dark:hover:bg-red-800 border border-red-200 hover:border-red-600 dark:border-red-800 dark:hover:border-red-700 shadow-sm";

  const toggleButtonClass =
    task.status === "complete"
      ? "text-yellow-700  hover:text-white hover:bg-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-100 dark:hover:bg-yellow-800 border border-yellow-200 hover:border-yellow-600 dark:border-yellow-800 dark:hover:border-yellow-700 shadow-sm"
      : "text-green-700  hover:text-white hover:bg-green-600 dark:text-green-400 dark:hover:text-green-100 dark:hover:bg-green-800 border border-green-200 hover:border-green-600 dark:border-green-800 dark:hover:border-green-700 shadow-sm";

  // Text colors based on priority for better contrast
  const titleTextColor =
    task.status === "complete"
      ? "text-gray-600 dark:text-gray-400 line-through"
      : task.priority === "high"
      ? "text-red-800 dark:text-red-300"
      : task.priority === "medium"
      ? "text-amber-800 dark:text-amber-300"
      : "text-green-800 dark:text-green-300";

  const descriptionTextColor =
    task.status === "complete"
      ? "text-gray-600 dark:text-gray-400"
      : task.priority === "high"
      ? "text-red-700 dark:text-red-300/90"
      : task.priority === "medium"
      ? "text-amber-700 dark:text-amber-300/90"
      : "text-green-700 dark:text-green-300/90";

  return (
    <div
      ref={cardRef}
      className={`card ${cardBackground} shadow-sm hover:shadow-md transition-all duration-200 p-4 rounded-lg task-card-hover ${
        canEdit ? "cursor-pointer" : ""
      }`}
      onClick={canEdit ? handleEdit : undefined}
    >
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className={`text-lg font-bold ${titleTextColor}`}>
            {task.title}
          </h3>
          <div className="flex space-x-1">
            <span
              className={`text-xs px-2 py-1 rounded-full ${
                priorityStyles[task.priority as keyof typeof priorityStyles] ||
                priorityStyles.medium
              }`}
            >
              {task.priority === "high"
                ? "Yüksek"
                : task.priority === "medium"
                ? "Orta"
                : "Düşük"}
            </span>
          </div>
        </div>

        <p className={`text-sm mb-3 flex-grow ${descriptionTextColor}`}>
          {task.description}
        </p>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-300 dark:border-gray-700">
          <span className="text-xs text-gray-700 dark:text-gray-400 font-semibold">
            {userName}
          </span>

          <div className="flex space-x-1">
            {canEdit && (
              <>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleEdit}
                  className={editButtonClass}
                  title="Düzenle"
                >
                  <FaEdit className="h-3.5 w-3.5" />
                </Button>

                <Button
                  size="xs"
                  variant="ghost"
                  onClick={handleDelete}
                  className={deleteButtonClass}
                  title="Sil"
                >
                  <FaTrash className="h-3.5 w-3.5" />
                </Button>
              </>
            )}

            <Button
              size="xs"
              variant="ghost"
              onClick={handleToggleStatus}
              className={toggleButtonClass}
              title={
                task.status === "complete"
                  ? "Yapılmadı olarak işaretle"
                  : "Tamamlandı olarak işaretle"
              }
            >
              {task.status === "complete" ? (
                <FaUndo className="h-3.5 w-3.5" />
              ) : (
                <FaCheck className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
