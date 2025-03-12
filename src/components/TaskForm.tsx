import React, { useState, useEffect } from "react";
import { Task, User } from "../types";
import { useTasks } from "../context/TaskContext";
import { useAuth } from "../context/AuthContext";
import { getUsers } from "../utils/localStorage";
import Input from "./Input";
import Button from "./Button";
import { FaFlag } from "react-icons/fa";

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

  useEffect(() => {
    const fetchedUsers = getUsers();
    setUsers(fetchedUsers);
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

    const taskData = {
      title: title.trim(),
      description: description.trim(),
      priority,
      userId: currentUser?.isAdmin ? assignedUserId : currentUser?.id || "",
      status: "incomplete" as "incomplete" | "complete",
      createdAt: task?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    if (task) {
      updateTask(task.id, { ...taskData });
    } else {
      // Use the same userId logic that you used for taskData
      const userId = currentUser?.isAdmin
        ? assignedUserId
        : currentUser?.id || "";
      addTask(title.trim(), description.trim(), priority, userId);
    }

    onSuccess?.();
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <Input
        label="Açıklama"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        type="textarea"
      />

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Öncelik
        </label>
        <div className="flex space-x-2">
          {["low", "medium", "high"].map((p) => (
            <Button
              key={p}
              type="button"
              className={`capitalize ${
                priority === p
                  ? "bg-primary text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
              onClick={() => setPriority(p as "low" | "medium" | "high")}
            >
              {p === "low" ? "Düşük" : p === "medium" ? "Orta" : "Yüksek"}
            </Button>
          ))}
        </div>
      </div>

      {currentUser?.isAdmin && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
            />
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className={`px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
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

      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button
            type="button"
            className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300"
            onClick={onCancel}
          >
            İptal
          </Button>
        )}
        <Button
          type="submit"
          className="bg-primary text-white hover:bg-primary-dark"
        >
          {task ? "Güncelle" : "Ekle"}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
