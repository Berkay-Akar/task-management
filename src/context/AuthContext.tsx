"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { User, AuthState } from "../types";
import {
  getCurrentUser,
  saveCurrentUser,
  getUsers,
  saveUsers,
} from "../utils/localStorage";
import { validateTCKimlikNo } from "../utils/tcKimlikValidator";

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (tcKimlikNo: string) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  register: (
    tcKimlikNo: string,
    name: string
  ) => Promise<{ success: boolean; message: string }>;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  users: [],
  login: () => Promise.resolve({ success: false, message: "" }),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve({ success: false, message: "" }),
  isAuthenticated: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = async (tcKimlikNo: string) => {
    if (!validateTCKimlikNo(tcKimlikNo)) {
      return { success: false, message: "Geçersiz TC Kimlik Numarası" };
    }

    const users = getUsers();
    const user = users.find((u) => u.tcKimlikNo === tcKimlikNo);

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı" };
    }

    // Save to localStorage first
    saveCurrentUser(user);

    // Then update state
    setAuthState({
      user,
      isAuthenticated: true,
    });

    return { success: true, message: "Giriş başarılı" };
  };

  const register = async (tcKimlikNo: string, name: string) => {
    if (!validateTCKimlikNo(tcKimlikNo)) {
      return { success: false, message: "Geçersiz TC Kimlik Numarası" };
    }

    const users = getUsers();

    if (users.some((u) => u.tcKimlikNo === tcKimlikNo)) {
      return {
        success: false,
        message: "Bu TC Kimlik Numarası ile kayıtlı bir kullanıcı zaten var",
      };
    }

    const newUser: User = {
      id: uuidv4(),
      tcKimlikNo,
      name,
      isAdmin: false,
      tasks: [],
    };

    const updatedUsers = [...users, newUser];

    // Save to localStorage first
    saveUsers(updatedUsers);
    saveCurrentUser(newUser);

    // Then update state
    setAuthState({
      user: newUser,
      isAuthenticated: true,
    });

    return { success: true, message: "Kayıt ve giriş başarılı" };
  };

  const logout = async () => {
    setAuthState({
      user: null,
      isAuthenticated: false,
    });
    saveCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        users: getUsers(),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
