// src/app/client-layout.tsx
"use client";

import { ReactNode, useEffect, useState, useRef } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";
import { Providers } from "./providers";
import Header from "@/components/Header";
import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";

// Modern background component with theme support
const ThemedBackground = ({ children }: { children: ReactNode }) => {
  const { theme } = useTheme();

  return (
    <div className="bg-theme-gradient bg-theme-pattern min-h-screen h-screen flex flex-col overflow-hidden">
      <div className="relative z-10 flex flex-col flex-grow h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
};

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

  return (
    <ThemeProvider>
      <ThemedBackground>
        <Header className="sticky top-0 z-30" />
        <div className="flex justify-center w-full h-full overflow-auto">
          <main className="w-full max-w-7xl px-4 py-6 flex-grow">
            <Providers>{children}</Providers>
          </main>
        </div>
      </ThemedBackground>
    </ThemeProvider>
  );
}
