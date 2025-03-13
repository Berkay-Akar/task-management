import React, { useState, useEffect, useContext } from "react";
import { Task, User } from "../types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Button from "./Button";
import { FaPlus, FaTimes } from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";

interface TaskListProps {
  tasks: Task[];
  showAddForm?: boolean;
  searchTerm: string;
  filter: "all" | "priority" | "date";
  priorityOrder: "asc" | "desc";
  isAdmin?: boolean;
  users?: User[];
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  showAddForm = true,
  searchTerm,
  filter,
  priorityOrder,
  isAdmin = false,
  users = [],
}) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [popupPosition, setPopupPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [useCenteredModal, setUseCenteredModal] = useState(true);
  const { user: currentUser } = useContext(AuthContext);

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

  const canEditTask = (taskUserId: string) => {
    if (!currentUser) return false;
    return isAdmin || taskUserId === currentUser.id;
  };

  const handleEditTask = (taskId: string, cardElement: HTMLElement) => {
    if (!useCenteredModal) {
      // Position the popup over the card (original behavior)
      if (cardElement) {
        const rect = cardElement.getBoundingClientRect();
        const scrollTop = window.scrollY || document.documentElement.scrollTop;

        // Calculate position - center the popup on the card
        setPopupPosition({
          top: rect.top + scrollTop,
          left: rect.left,
          width: rect.width,
        });
      }
    }

    setEditingTaskId(taskId === editingTaskId ? null : taskId);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const popup = document.getElementById("task-edit-popup");
      const addPopup = document.getElementById("task-add-popup");

      if (popup && !popup.contains(e.target as Node) && editingTaskId) {
        setEditingTaskId(null);
      }

      if (addPopup && !addPopup.contains(e.target as Node) && isAddingTask) {
        setIsAddingTask(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editingTaskId, isAddingTask]);

  // Handle escape key to close popup
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (editingTaskId) {
          setEditingTaskId(null);
        }
        if (isAddingTask) {
          setIsAddingTask(false);
        }
      }
    };

    document.addEventListener("keydown", handleEscKey);
    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [editingTaskId, isAddingTask]);

  return (
    <div className="task-list w-full h-full overflow-auto custom-scrollbar relative">
      {showAddForm && (
        <div className="mb-4">
          <Button
            onClick={() => setIsAddingTask(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow"
            leftIcon={<FaPlus className="h-3.5 w-3.5" />}
          >
            Yeni Görev Ekle
          </Button>
        </div>
      )}

      {sortedTasks.length === 0 && !isAddingTask ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            Henüz görev bulunmamaktadır.
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Yeni görev eklemek için yukarıdaki butonu kullanabilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pb-6">
          {sortedTasks.map((task) => {
            if (!task || typeof task !== "object") return null;
            const user = users.find((u) => u.id === task.userId);

            // Determine if the current user can edit this task
            const userCanEdit = canEditTask(task.userId);

            return (
              <TaskCard
                key={task.id}
                task={task}
                userName={user?.name || task.userName || "Unknown User"}
                onEdit={handleEditTask}
                canEdit={userCanEdit}
              />
            );
          })}
        </div>
      )}

      {/* Centered modal version of task edit popup */}
      {editingTaskId && useCenteredModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setEditingTaskId(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-blue-500 animate-modal-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Görevi Düzenle
              </h3>
              <button
                onClick={() => setEditingTaskId(null)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <TaskForm
                task={
                  sortedTasks.find((t) => t.id === editingTaskId) || undefined
                }
                onSuccess={() => setEditingTaskId(null)}
                onCancel={() => setEditingTaskId(null)}
                isModal={true}
                isAdmin={isAdmin}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Centered modal version of add task popup */}
      {isAddingTask && useCenteredModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsAddingTask(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-md border border-green-500 animate-modal-slide-up overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Yeni Görev Ekle
              </h3>
              <button
                onClick={() => setIsAddingTask(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <FaTimes className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4">
              <TaskForm
                onSuccess={() => setIsAddingTask(false)}
                onCancel={() => setIsAddingTask(false)}
                isModal={true}
                isAdmin={isAdmin}
                users={users}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task Edit Popup - Original Position-based Version */}
      {editingTaskId && !useCenteredModal && (
        <div
          id="task-edit-popup"
          className="fixed z-50 animate-popup"
          style={{
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
            width: `${popupPosition.width}px`,
            maxWidth: "100%",
          }}
        >
          <div className="card p-4 shadow-xl border-2 border-primary bg-white dark:bg-gray-800 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">
                Görevi Düzenle
              </h3>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingTaskId(null)}
                className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700 p-1 border border-transparent hover:border-gray-300"
              >
                <FaTimes className="h-3 w-3" />
              </Button>
            </div>
            <TaskForm
              task={
                sortedTasks.find((t) => t.id === editingTaskId) || undefined
              }
              onSuccess={() => setEditingTaskId(null)}
              onCancel={() => setEditingTaskId(null)}
              isAdmin={isAdmin}
              users={users}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
