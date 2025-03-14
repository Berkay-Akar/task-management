"use client";

import React, { useState, useEffect, useContext, useMemo } from "react";
import { TaskContext } from "@/context/TaskContext";
import { AuthContext } from "@/context/AuthContext";
import TaskList from "@/components/TaskList";
import Button from "@/components/Button";
import { getUsers } from "@/utils/localStorage";
import { User } from "@/types";
import {
  FaSearch,
  FaSort,
  FaSortAmountUp,
  FaSortAmountDown,
} from "react-icons/fa";

export default function Dashboard() {
  const { tasks } = useContext(TaskContext);
  const { user } = useContext(AuthContext);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "priority" | "date">("all");
  const [priorityOrder, setPriorityOrder] = useState<"asc" | "desc">("desc");
  const [dateOrder, setDateOrder] = useState<"asc" | "desc">("desc");
  const [users, setUsers] = useState<User[]>([]);

  // Load users from localStorage
  useEffect(() => {
    const loadedUsers = getUsers();
    setUsers(loadedUsers);
  }, []);

  // Filter tasks based on user role
  const filteredTasks = useMemo(() => {
    if (!user) return [];

    // Admin can see all tasks
    if (user.isAdmin) {
      return tasks;
    }

    // Regular users can only see their tasks
    return tasks.filter((task) => task.userId === user.id);
  }, [tasks, user]);

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-page h-full p-4 sm:p-6">
      <div className="dashboard-container h-full flex flex-col">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4 sticky top-0 z-20 bg-white dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700">
            <h2 className="dashboard-heading text-xl">
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
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-primary dark:focus:border-primary"
                />
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400" />
              </div>
              <div className="grid grid-cols-3 gap-1 sm:flex sm:gap-2 w-full sm:w-auto">
                <Button
                  variant={filter === "all" ? "primary" : "ghost"}
                  onClick={() => setFilter("all")}
                  leftIcon={<FaSort className="h-3 w-3 sm:h-4 sm:w-4" />}
                  className={`${
                    filter === "all"
                      ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  } text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 min-w-[90px] md:min-w-[110px] whitespace-nowrap`}
                >
                  <span className="hidden sm:inline">Varsayılan</span>
                  <span className="sm:hidden">Var</span>
                </Button>
                <Button
                  variant={filter === "date" ? "primary" : "ghost"}
                  onClick={() => {
                    setFilter("date");
                    setDateOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  leftIcon={
                    dateOrder === "asc" ? (
                      <FaSortAmountUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <FaSortAmountDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    )
                  }
                  className={`${
                    filter === "date"
                      ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  } text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 min-w-[90px] md:min-w-[110px] whitespace-nowrap`}
                >
                  <span className="hidden sm:inline">Tarih</span>
                  <span className="sm:hidden">Tar</span>
                </Button>
                <Button
                  variant={filter === "priority" ? "primary" : "ghost"}
                  onClick={() => {
                    setFilter("priority");
                    setPriorityOrder((prev) =>
                      prev === "asc" ? "desc" : "asc"
                    );
                  }}
                  leftIcon={
                    priorityOrder === "asc" ? (
                      <FaSortAmountUp className="h-3 w-3 sm:h-4 sm:w-4" />
                    ) : (
                      <FaSortAmountDown className="h-3 w-3 sm:h-4 sm:w-4" />
                    )
                  }
                  className={`${
                    filter === "priority"
                      ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-800"
                      : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                  } text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-4 min-w-[90px] md:min-w-[110px] whitespace-nowrap`}
                >
                  <span className="hidden sm:inline">Öncelik</span>
                  <span className="sm:hidden">Önc</span>
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-grow overflow-hidden">
            <TaskList
              tasks={filteredTasks}
              searchTerm={searchTerm}
              filter={filter}
              priorityOrder={priorityOrder}
              dateOrder={dateOrder}
              isAdmin={user.isAdmin}
              users={users}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
