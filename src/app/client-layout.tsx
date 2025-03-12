// src/app/client-layout.tsx
"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

export function ClientLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const authStateRef = useRef(isAuthenticated);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    authStateRef.current = isAuthenticated;
  }, [isAuthenticated, pathname]);

  useEffect(() => {
    if (!mounted) return;

    if (isRedirecting) return;

    const isAuthPath =
      pathname === "/auth/login" || pathname === "/auth/register";

    if (isAuthenticated && isAuthPath) {
      console.log("Authenticated user on auth page - redirecting to dashboard");
      setIsRedirecting(true);

      router.push("/dashboard");

      setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
    } else if (!isAuthenticated && pathname !== "/" && !isAuthPath) {
      setIsRedirecting(true);

      router.push("/auth/login");

      setTimeout(() => {
        setIsRedirecting(false);
      }, 1000);
    }
  }, [isAuthenticated, pathname, router, mounted, isRedirecting]);

  return (
    <ThemeProvider>
      <div className="bg-theme min-h-screen flex flex-col">
        <Header />
        <main className="container mx-auto px-4 py-8 flex-grow">
          <Providers>{children}</Providers>
        </main>
      </div>
    </ThemeProvider>
  );
}
