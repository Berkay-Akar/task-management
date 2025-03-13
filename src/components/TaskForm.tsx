"use client";

import React, { useState, useContext, useEffect } from "react";
import { TaskContext } from "../context/TaskContext";
import { AuthContext } from "../context/AuthContext";
import { Task, User } from "../types";
import Button from "./Button";
import { FaFlag } from "react-icons/fa";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
  isAdmin?: boolean;
  users?: User[];
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSuccess,
  onCancel,
  isModal = false,
  isAdmin = false,
  users = [],
}) => {
  const { addTask, updateTask } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const isEditing = !!task;

  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority || "medium"
  );
  const [assignedUserId, setAssignedUserId] = useState<string>(
    task?.userId || user?.id || ""
  );
  const [error, setError] = useState("");

  // Reset form when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority || "medium");
      setAssignedUserId(task.userId);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setAssignedUserId(user?.id || "");
    }
  }, [task, user?.id]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Başlık alanı boş bırakılamaz");
      return;
    }

    if (!user) {
      setError("Kullanıcı oturumu bulunamadı");
      return;
    }

    try {
      // If editing, update the task
      if (isEditing && task) {
        const success = updateTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          // We don't include userId in updates as it's not allowed in the updateTask interface
        });

        if (!success) {
          setError("Görev güncellenemedi. Yetkiniz olmayabilir.");
          return;
        }
      } else {
        // If creating a new task
        const userId = isAdmin ? assignedUserId : user.id;
        addTask(title.trim(), description.trim(), priority, userId);
      }

      // Reset form
      setTitle("");
      setDescription("");
      setPriority("medium");

      // Call onSuccess if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error("Error saving task:", err);
      setError("Görev kaydedilirken bir hata oluştu");
    }
  };

  const inputClasses =
    "px-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-1 focus:ring-primary dark:bg-gray-700 dark:border-gray-600";

  // Priority options with their styles
  const priorityOptions = [
    {
      value: "low",
      label: "Düşük",
      color:
        "bg-[var(--priority-low-bg)] text-[var(--priority-low-text)] border border-[var(--priority-low-border)]",
    },
    {
      value: "medium",
      label: "Orta",
      color:
        "bg-[var(--priority-medium-bg)] text-[var(--priority-medium-text)] border border-[var(--priority-medium-border)]",
    },
    {
      value: "high",
      label: "Yüksek",
      color:
        "bg-[var(--priority-high-bg)] text-[var(--priority-high-text)] border border-[var(--priority-high-border)]",
    },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Başlık
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={inputClasses}
          placeholder="Görev başlığı"
          autoFocus
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Açıklama
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClasses} resize-none h-24`}
          placeholder="Görev açıklaması"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium mb-1">Öncelik</label>
        <div className="flex space-x-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`px-3 py-1.5 text-xs rounded-md transition-all duration-200 flex items-center ${
                option.color
              } ${
                priority === option.value
                  ? "ring-2 ring-offset-1 ring-primary shadow-sm transform scale-105"
                  : "hover:opacity-90 hover:shadow-sm"
              }`}
              onClick={() =>
                setPriority(option.value as "low" | "medium" | "high")
              }
            >
              <FaFlag className="h-2.5 w-2.5 mr-1" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* User assignment dropdown for admins */}
      {isAdmin && (
        <div>
          <label
            htmlFor="assignedUser"
            className="block text-sm font-medium mb-1"
          >
            Görev Atanacak Kullanıcı
          </label>
          <select
            id="assignedUser"
            value={assignedUserId}
            onChange={(e) => setAssignedUserId(e.target.value)}
            className={inputClasses}
          >
            <option value="" disabled>
              Kullanıcı seçin
            </option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            onClick={onCancel}
            variant="ghost"
            className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-700"
          >
            İptal
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          className="bg-primary hover:bg-primary-hover text-white"
        >
          {isEditing ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
