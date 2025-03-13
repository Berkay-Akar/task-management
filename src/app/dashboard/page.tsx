"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTasks } from "@/context/TaskContext";
import TaskList from "@/components/TaskList";
import Button from "@/components/Button";
import {
  FaSearch,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
} from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { getAllTasks } = useTasks();
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "priority" | "date">("all");
  const [priorityOrder, setPriorityOrder] = useState<"asc" | "desc">("desc");

  const tasks = getAllTasks();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex justify-center">
      <main className="w-full max-w-7xl px-4 py-6 flex-1">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <h2 className="text-xl font-semibold text-white">
              {user.isAdmin
                ? "Tüm görevleri yönetebilirsiniz."
                : "Kendi görevlerinizi yönetebilirsiniz."}
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full lg:w-auto">
              <div className="relative flex-grow sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Görev ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex gap-2 flex-wrap sm:flex-nowrap">
                <Button
                  variant={filter === "all" ? "primary" : "outline"}
                  onClick={() => setFilter("all")}
                  leftIcon={<FaSort />}
                  className={`${
                    filter === "all" ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  Varsayılan
                </Button>
                <Button
                  variant={filter === "date" ? "primary" : "outline"}
                  onClick={() => setFilter("date")}
                  leftIcon={<FaSort />}
                  className={`${
                    filter === "date" ? "ring-2 ring-primary ring-offset-2" : ""
                  }`}
                >
                  Tarih
                </Button>
                <Button
                  variant={filter === "priority" ? "primary" : "outline"}
                  onClick={() => {
                    setFilter("priority");
                    setPriorityOrder((prev) =>
                      prev === "asc" ? "desc" : "asc"
                    );
                  }}
                  leftIcon={
                    priorityOrder === "asc" ? (
                      <FaSortAmountUp />
                    ) : (
                      <FaSortAmountDown />
                    )
                  }
                  className={`${
                    filter === "priority"
                      ? "ring-2 ring-primary ring-offset-2"
                      : ""
                  }`}
                >
                  Öncelik
                </Button>
              </div>
            </div>
          </div>
          <div className="task-list-container h-[calc(100vh-240px)] overflow-y-auto pr-2 custom-scrollbar">
            <TaskList
              tasks={tasks}
              searchTerm={searchTerm}
              filter={filter}
              priorityOrder={priorityOrder}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
