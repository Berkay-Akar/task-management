"use client";

import React from "react";
import { AuthProvider } from "../context/AuthContext";
import { TaskProvider } from "../context/TaskContext";

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <AuthProvider>
      <TaskProvider>{children}</TaskProvider>
    </AuthProvider>
  );
};

export default Providers;
