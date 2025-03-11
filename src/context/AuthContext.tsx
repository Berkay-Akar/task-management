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

interface AuthContextType extends AuthState {
  login: (tcKimlikNo: string) => { success: boolean; message: string };
  register: (
    tcKimlikNo: string,
    name: string
  ) => { success: boolean; message: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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
    // Load user from localStorage on initial render
    const user = getCurrentUser();
    if (user) {
      setAuthState({
        user,
        isAuthenticated: true,
      });
    }
  }, []);

  const login = (tcKimlikNo: string) => {
    // Validate TC Kimlik No
    if (!validateTCKimlikNo(tcKimlikNo)) {
      return { success: false, message: "Geçersiz TC Kimlik Numarası" };
    }

    const users = getUsers();
    const user = users.find((u) => u.tcKimlikNo === tcKimlikNo);

    if (!user) {
      return { success: false, message: "Kullanıcı bulunamadı" };
    }

    setAuthState({
      user,
      isAuthenticated: true,
    });

    saveCurrentUser(user);
    return { success: true, message: "Giriş başarılı" };
  };

  const register = (tcKimlikNo: string, name: string) => {
    // Validate TC Kimlik No
    if (!validateTCKimlikNo(tcKimlikNo)) {
      return { success: false, message: "Geçersiz TC Kimlik Numarası" };
    }

    const users = getUsers();

    // Check if user already exists
    if (users.some((u) => u.tcKimlikNo === tcKimlikNo)) {
      return {
        success: false,
        message: "Bu TC Kimlik Numarası ile kayıtlı bir kullanıcı zaten var",
      };
    }

    // Create new user
    const newUser: User = {
      id: uuidv4(),
      tcKimlikNo,
      name,
      isAdmin: false, // New users are not admins by default
    };

    // Save user
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    // Log in the new user
    setAuthState({
      user: newUser,
      isAuthenticated: true,
    });

    saveCurrentUser(newUser);
    return { success: true, message: "Kayıt ve giriş başarılı" };
  };

  const logout = () => {
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
