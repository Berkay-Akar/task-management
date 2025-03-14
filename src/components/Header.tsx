"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import MoonIcon from "./icons/moonIcon";
import SunIcon from "./icons/sunIcon";
import Button from "./Button";
import { useRouter, usePathname } from "next/navigation";
import { FaUser } from "react-icons/fa";

function useLocalStorage(key: string) {
  const [value, setValue] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return null;
  });

  useEffect(() => {
    function handleStorageChange() {
      setValue(localStorage.getItem(key));
    }

    window.addEventListener("storage", handleStorageChange);
    const interval = setInterval(() => {
      const currentValue = localStorage.getItem(key);
      if (currentValue !== value) {
        setValue(currentValue);
      }
    }, 100);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, [key, value]);

  return value;
}

interface HeaderProps {
  userName?: string;
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ userName, className = "" }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);
  const currentUserJson = useLocalStorage("tasks-management-current-user");

  useEffect(() => {
    setIsAuth(isAuthenticated || !!currentUserJson);
  }, [isAuthenticated, currentUserJson]);

  const displayName =
    userName ||
    user?.name ||
    (currentUserJson ? JSON.parse(currentUserJson).name : "");
  const isAdmin =
    user?.isAdmin ||
    (currentUserJson ? JSON.parse(currentUserJson).isAdmin : false);

  const handleLogout = async () => {
    try {
      await logout();
      setTimeout(() => {
        router.push("/auth/login");
      }, 50);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={`bg-white dark:bg-gray-800 shadow-md ${className}`}>
      <div className="flex justify-center w-full">
        <div className="container max-w-7xl px-4 py-4 flex justify-between items-center w-full">
          <h1 className="dashboard-heading text-xl">
            Görev Yönetim Uygulaması
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:hover:bg-gray-600 transition-colors cursor-pointer"
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5 text-gray-700" />
              ) : (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              )}
            </button>

            {isAuth && (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded-full p-2.5">
                    <FaUser className="h-4 w-4 text-white dark:text-gray-300" />
                  </div>
                  <span className="dashboard-heading text-sm">
                    {displayName}
                    {isAdmin && (
                      <span className="ml-1 text-yellow-500">👑</span>
                    )}
                  </span>
                </div>

                <Button
                  className="text-gray-800 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                  variant="ghost"
                  onClick={handleLogout}
                >
                  Çıkış Yap
                </Button>
              </>
            )}

            {!isAuth && (
              <Button
                className="text-gray-800 border border-gray-300 hover:bg-gray-200 hover:text-gray-900 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white"
                variant="ghost"
                onClick={() => router.push("/auth/login")}
              >
                Giriş Yap
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
