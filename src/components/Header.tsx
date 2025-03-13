"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import MoonIcon from "./icons/moonIcon";
import SunIcon from "./icons/sunIcon";
import Button from "./Button";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  userName?: string;
}

const Header: React.FC<HeaderProps> = ({ userName }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    setIsAuth(isAuthenticated);
  }, [pathname, isAuthenticated]);

  const displayName = userName || user?.name || "";

  const handleLogout = async () => {
    logout();
    setTimeout(() => {
      router.push("/auth/login");
    }, 50);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="flex justify-center w-full">
        <div className="container max-w-7xl px-4 py-4 flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold text-white">
            Görev Yönetim Uygulaması
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              aria-label={
                theme === "light"
                  ? "Switch to dark theme"
                  : "Switch to light theme"
              }
            >
              {theme === "light" ? (
                <MoonIcon className="h-5 w-5" />
              ) : (
                <SunIcon className="h-5 w-5 text-yellow-300" />
              )}
            </button>

            {isAuth && (
              <>
                <span className="text-gray-700 dark:text-gray-300 hidden sm:inline-block">
                  {displayName}{" "}
                  {user?.isAdmin && <span className="text-yellow-500">👑</span>}
                </span>

                <Button variant="outline" onClick={handleLogout}>
                  Çıkış Yap
                </Button>
              </>
            )}

            {!isAuth && (
              <Button
                variant="outline"
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
