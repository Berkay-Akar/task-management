"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { initializeUsers } from "../../../utils/localStorage";

export default function LoginPage() {
  const [tcKimlikNo, setTcKimlikNo] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

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
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
          Görev Yönetim Uygulaması
        </h1>

        <h2 className="text-xl font-semibold mb-4 text-blue-600">Giriş Yap</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <Input
            label="TC Kimlik Numarası"
            type="text"
            value={tcKimlikNo}
            onChange={(e) => setTcKimlikNo(e.target.value)}
            placeholder="11 haneli TC Kimlik Numarası"
            className="w-full"
            required
            maxLength={11}
            pattern="[0-9]{11}"
          />

          <div className="mt-6 flex flex-col space-y-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            >
              {isLoading ? "Giriş Yapılıyor..." : "Giriş Yap"}
            </Button>

            <Button
              type="button"
              onClick={handleRegister}
              className="py-3 text-base font-medium border border-blue-600 text-blue-600 hover:bg-blue-50 rounded-md"
            >
              Kayıt Ol
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">TC Kimlik No: Admin (12345678910)</p>
        </div>
      </div>
    </div>
  );
}
