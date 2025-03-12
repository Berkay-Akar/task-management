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

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  const tasks = getAllTasks();

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold mb-4 md:mb-0">
              {user.isAdmin
                ? "Tüm görevleri yönetebilirsiniz."
                : "Kendi görevlerinizi yönetebilirsiniz."}
            </h2>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Görev ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              <div className="flex space-x-2">
                <Button
                  variant={filter === "all" ? "primary" : "outline"}
                  onClick={() => setFilter("all")}
                  leftIcon={<FaSort />}
                >
                  Varsayılan
                </Button>
                <Button
                  variant={filter === "date" ? "primary" : "outline"}
                  onClick={() => setFilter("date")}
                  leftIcon={<FaSort />}
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
                >
                  Öncelik
                </Button>
              </div>
            </div>
          </div>
          <TaskList
            tasks={tasks}
            searchTerm={searchTerm}
            filter={filter}
            priorityOrder={priorityOrder}
          />
        </div>
      </main>
    </div>
  );
}
