"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { initializeUsers } from "../../../utils/localStorage";
import { FaUser, FaLock, FaExclamationCircle } from "react-icons/fa";
import { useTheme } from "../../../components/ThemeProvider";

export default function LoginPage() {
  const [tcKimlikNo, setTcKimlikNo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Initialize default users if none exist
  useEffect(() => {
    initializeUsers();
  }, []);

  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate TC Kimlik No format
    if (!/^\d{11}$/.test(tcKimlikNo)) {
      setError("TC Kimlik Numarası 11 haneli olmalıdır");
      setIsLoading(false);
      return;
    }
    const result = login(tcKimlikNo);

    if (result.success) {
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
      setIsLoading(false);
    } else {
      setError(result.message);
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-theme-gradient">
      <div className="w-full max-w-md">
        {/* Card with subtle animation */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden transform transition-all duration-300 animate-modal-slide-up border border-gray-200 dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-900 px-6 py-6 text-white sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-center mb-1">
              Görev Yönetim
            </h1>
            <p className="text-center text-blue-100 dark:text-blue-200 opacity-90 text-sm">
              Hesabınıza giriş yapın
            </p>
          </div>

          <div className="p-5 sm:p-6">
            {error && (
              <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg mb-4 flex items-center animate-fade-in">
                <FaExclamationCircle className="mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  TC Kimlik Numarası
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <Input
                    type="text"
                    value={tcKimlikNo}
                    onChange={(e) => setTcKimlikNo(e.target.value)}
                    placeholder="11 haneli TC Kimlik Numarası"
                    className="pl-10 w-full py-2.5 text-base"
                    required
                    maxLength={11}
                    pattern="[0-9]{11}"
                  />
                </div>
              </div>

              <div className="pt-1">
                <Button
                  type="submit"
                  disabled={isLoading}
                  isFullWidth
                  className="py-2.5 text-base font-medium bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </div>
            </form>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    Hesabınız yok mu?
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <Button
                  type="button"
                  onClick={handleRegister}
                  isFullWidth
                  variant="ghost"
                  className="py-2.5 text-base font-medium border-2 border-blue-500 dark:border-blue-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                >
                  Kayıt Ol
                </Button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="inline-block px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="dashboard-heading text-sm">
                  <span className="font-medium">Demo Giriş:</span> Admin
                  (12345678910)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
