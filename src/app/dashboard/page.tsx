"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { useTasks } from "../../context/TaskContext";
import TaskList from "../../components/TaskList";
import Button from "../../components/Button";
import { FaSignOutAlt } from "react-icons/fa";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const { getAllTasks } = useTasks();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push("/auth/login");
  };

  if (!isAuthenticated || !user) {
    return null; // Don't render anything while redirecting
  }

  const tasks = getAllTasks();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900">
            Görev Yönetim Uygulaması
          </h1>

          <div className="flex items-center">
            <span className="mr-4 text-sm text-gray-600">
              {user.isAdmin ? "👑 " : ""}
              {user.name}
            </span>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleLogout}
              className="flex items-center"
            >
              <FaSignOutAlt className="mr-1" /> Çıkış
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-blue-600">
              {user.isAdmin ? "Tüm Görevler" : "Görevlerim"}
            </h2>
            <p className="text-gray-600 text-sm mt-1">
              {user.isAdmin
                ? "Yönetici olarak tüm görevleri görüntüleyebilir ve düzenleyebilirsiniz."
                : "Kendi görevlerinizi yönetebilirsiniz."}
            </p>
          </div>

          <TaskList tasks={tasks} />
        </div>
      </main>
    </div>
  );
}
