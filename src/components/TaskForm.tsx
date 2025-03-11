import React, { useState, useEffect } from "react";
import { Task } from "../types";
import { useTasks } from "../context/TaskContext";
import Input from "./Input";
import Button from "./Button";
import { FaFlag } from "react-icons/fa";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onCancel }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});
  const { addTask, updateTask } = useTasks();

  // If task is provided, populate form fields for editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority || "medium");
    }
  }, [task]);

  const validate = (): boolean => {
    const newErrors: { title?: string; description?: string } = {};
    let isValid = true;

    if (!title.trim()) {
      newErrors.title = "Başlık gereklidir";
      isValid = false;
    }

    if (!description.trim()) {
      newErrors.description = "Açıklama gereklidir";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    if (task) {
      // Update existing task
      const success = updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
      });

      if (success && onSuccess) {
        onSuccess();
      }
    } else {
      // Add new task
      addTask(title.trim(), description.trim(), priority);
      setTitle("");
      setDescription("");
      setPriority("medium");

      if (onSuccess) {
        onSuccess();
      }
    }
  };

  const priorityOptions = [
    {
      value: "low",
      label: "Düşük",
      color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    },
    {
      value: "medium",
      label: "Orta",
      color:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    },
    {
      value: "high",
      label: "Yüksek",
      color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    },
  ];

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Görev başlığı"
        fullWidth
        error={errors.title}
      />

      <Input
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Görev açıklaması"
        fullWidth
        error={errors.description}
        as="textarea"
        rows={3}
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Öncelik
        </label>
        <div className="flex space-x-2">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`px-3 py-2 rounded-md flex items-center ${
                priority === option.value
                  ? `${option.color} ring-2 ring-offset-2 ring-indigo-500`
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
              onClick={() =>
                setPriority(option.value as "low" | "medium" | "high")
              }
            >
              <FaFlag className="mr-1" />
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            İptal
          </Button>
        )}

        <Button type="submit" variant="primary">
          {task ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
