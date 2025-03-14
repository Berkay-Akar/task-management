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

    try {
      const result = await login(tcKimlikNo);

      if (result.success) {
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else {
        setError(result.message);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Giriş yapılırken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    router.push("/auth/register");
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[var(--surface-0)] dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 animate-modal-slide-up border border-[var(--surface-2)] dark:border-gray-700 max-h-[90vh] overflow-y-auto">
          <div className="bg-[var(--primary)] dark:bg-[var(--primary-hover)] px-6 py-6 text-white sticky top-0 z-10">
            <h1 className="text-2xl font-bold text-center mb-1">
              Görev Yönetim
            </h1>
            <p className="text-center text-white/80 dark:text-white/90 opacity-90 text-sm">
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
                <label className="block text-sm font-medium text-[var(--dashboard-text-heading)] dark:text-gray-300">
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
                  className="py-2.5 text-base font-medium bg-[var(--primary)] hover:bg-[var(--primary-hover)] dark:bg-[var(--primary)] dark:hover:bg-[var(--primary-hover)] text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                >
                  {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
                </Button>
              </div>
            </form>

            <div className="mt-5">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[var(--surface-2)] dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2  dark:bg-gray-800 text-gray-500 dark:text-gray-400">
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
                  className="py-2.5 text-base font-medium border-2 border-[var(--primary)] dark:border-[var(--primary-hover)] text-[var(--primary)] dark:text-[var(--primary-light)] hover:bg-[var(--primary-subtle)] dark:hover:bg-[var(--primary-hover)]/20 rounded-lg transition-colors"
                >
                  Kayıt Ol
                </Button>
              </div>
            </div>

            <div className="mt-5 text-center">
              <div className="inline-block px-4 py-2 bg-[var(--primary-subtle)] dark:bg-[var(--primary-hover)]/20 rounded-lg border border-[var(--primary-light)] dark:border-[var(--primary-hover)]">
                <p className=" text-sm text-white dark:text-gray-300">
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
