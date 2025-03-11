"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import Input from "../../../components/Input";
import Button from "../../../components/Button";

export default function RegisterPage() {
  const [tcKimlikNo, setTcKimlikNo] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate inputs
    if (!name.trim()) {
      setError("Ad Soyad alanı gereklidir");
      setIsLoading(false);
      return;
    }

    if (!/^\d{11}$/.test(tcKimlikNo)) {
      setError("TC Kimlik Numarası 11 haneli olmalıdır");
      setIsLoading(false);
      return;
    }

    // Attempt registration
    const result = register(tcKimlikNo, name);

    if (result.success) {
      router.push("/dashboard");
    } else {
      setError(result.message);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">
          Görev Yönetim Uygulaması
        </h1>

        <h2 className="text-xl font-semibold mb-4">Kayıt Ol</h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <Input
            label="Ad Soyad"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ad Soyad"
            fullWidth
            required
          />

          <Input
            label="TC Kimlik Numarası"
            type="text"
            value={tcKimlikNo}
            onChange={(e) => setTcKimlikNo(e.target.value)}
            placeholder="11 haneli TC Kimlik Numarası"
            fullWidth
            required
            maxLength={11}
            pattern="[0-9]{11}"
          />

          <Button type="submit" fullWidth disabled={isLoading} className="mt-2">
            {isLoading ? "Kayıt Yapılıyor..." : "Kayıt Ol"}
          </Button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-gray-600">
            Zaten hesabınız var mı?{" "}
            <Link href="/auth/login" className="text-blue-600 hover:underline">
              Giriş Yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
