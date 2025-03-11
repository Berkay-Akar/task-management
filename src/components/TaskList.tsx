import React, { useState } from "react";
import { Task } from "../types";
import TaskCard from "./TaskCard";
import TaskForm from "./TaskForm";
import Button from "./Button";
import Input from "./Input";
import { FaPlus, FaFilter, FaSearch } from "react-icons/fa";

interface TaskListProps {
  tasks: Task[];
  showAddForm?: boolean;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, showAddForm = true }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [filter, setFilter] = useState<"all" | "priority" | "date">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [priorityOrder, setPriorityOrder] = useState<"asc" | "desc">("asc");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handlePriorityOrderChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setPriorityOrder(e.target.value as "asc" | "desc");
    setFilter("priority");
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    // First sort by status (incomplete first)
    if (a.status !== b.status) {
      return a.status === "incomplete" ? -1 : 1;
    }

    if (filter === "priority") {
      // Then sort by priority (high to low or low to high based on priorityOrder)
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

    // Then sort by updated date (newest first)
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
        {showAddForm && (
          <div className="flex-1">
            {isAddingTask ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 animate-fade-in">
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

        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Input
            type="text"
            placeholder="Görev Ara"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full sm:w-auto"
            leftIcon={<FaSearch />}
          />

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Sırala:
            </span>
            <Button
              size="xs"
              variant={filter === "all" ? "primary" : "outline"}
              onClick={() => setFilter("all")}
            >
              Varsayılan
            </Button>
            <select
              value={priorityOrder}
              onChange={handlePriorityOrderChange}
              className="px-2 py-1 border rounded-md text-sm bg-white dark:bg-gray-800 dark:text-white"
            >
              <option value="asc">Öncelik: Düşükten Yükseğe</option>
              <option value="desc">Öncelik: Yüksekten Düşüğe</option>
            </select>
            <Button
              size="xs"
              variant={filter === "date" ? "primary" : "outline"}
              onClick={() => setFilter("date")}
            >
              Tarih
            </Button>
          </div>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">
            Henüz görev bulunmamaktadır.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
