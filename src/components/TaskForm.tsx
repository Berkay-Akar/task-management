import React, { useState, useEffect, useRef } from "react";
import { Task, User } from "../types";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../utils/localStorage";
import Input from "./Input";
import Button from "./Button";
import { FaFlag, FaUser, FaTimes, FaPlus, FaCheck } from "react-icons/fa";

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSuccess, onCancel }) => {
  const { addTask, updateTask } = useTasks();
  const { user: currentUser } = useAuth();
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [priority, setPriority] = useState<"low" | "medium" | "high">(
    task?.priority || "medium"
  );
  const [assignedUserId, setAssignedUserId] = useState(task?.userId || "");
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchedUsers = getUsers();
    setUsers(fetchedUsers);

    if (task?.userId) {
      const assignedUser = fetchedUsers.find((user) => user.id === task.userId);
      if (assignedUser) {
        setSearchTerm(assignedUser.name);
        setAssignedUserId(assignedUser.id);
      }
    }
  }, [task]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      alert("Lütfen başlık ve açıklama alanlarını doldurunuz.");
      return;
    }

    const userId =
      currentUser?.isAdmin && assignedUserId ? assignedUserId : currentUser?.id;

    if (!userId) {
      alert("Kullanıcı kimliği bulunamadı. Lütfen tekrar giriş yapın.");
      return;
    }

    try {
      if (task) {
        updateTask(task.id, {
          title: title.trim(),
          description: description.trim(),
          priority,
          status: task.status,
        });
      } else {
        addTask(title.trim(), description.trim(), priority, userId);
      }
      if (!task) {
        setTitle("");
        setDescription("");
        setPriority("medium");
        setAssignedUserId("");
        setSearchTerm("");
      }

      onSuccess?.();
    } catch (error) {
      console.error("Error handling task:", error);
      alert("Görev işlenirken bir hata oluştu.");
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
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Input
          label="Başlık"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Görev başlığı"
          className="text-sm py-1.5 text-gray-800 dark:text-gray-200"
        />
      </div>

      <Input
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        type="textarea"
        rows={2}
        placeholder="Görev açıklaması"
        className="text-sm py-1.5"
      />
      <div className="flex flex-col space-y-1">
        <label className="text-xs font-medium text-gray-700 dark:text-gray-300">
          Öncelik
        </label>
        <div className="flex space-x-1">
          {priorityOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`px-2 py-1 text-xs rounded-md transition-all duration-200 ${
                option.color
              } ${
                priority === option.value
                  ? "ring-1 ring-offset-1 ring-primary shadow-sm"
                  : "hover:opacity-80"
              }`}
              onClick={(e) => {
                e.preventDefault();
                setPriority(option.value as "low" | "medium" | "high");
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {currentUser?.isAdmin && (
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Görevi Ata
          </label>
          <div className="relative">
            <Input
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsDropdownOpen(true);
              }}
              placeholder="Kullanıcı ara..."
              onFocus={() => setIsDropdownOpen(true)}
              leftIcon={<FaUser className="text-gray-400 h-3 w-3" />}
              className="text-sm py-1.5"
            />
            {isDropdownOpen && (
              <div className="absolute z-20 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-32 overflow-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`px-3 py-1.5 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      assignedUserId === user.id
                        ? "bg-blue-50 dark:bg-blue-900"
                        : ""
                    }`}
                    onClick={() => {
                      setAssignedUserId(user.id);
                      setSearchTerm(user.name);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {user.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-2">
        {onCancel && (
          <Button
            type="button"
            size="sm"
            className="bg-red-100 hover:bg-red-200 dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
            onClick={onCancel}
            leftIcon={<FaTimes className="h-3 w-3" />}
          >
            İptal
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          className="bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
          leftIcon={
            task ? (
              <FaCheck className="h-3 w-3" />
            ) : (
              <FaPlus className="h-3 w-3" />
            )
          }
        >
          {task ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
