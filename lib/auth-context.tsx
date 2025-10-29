"use client";

import type React from "react";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  type ReactNode,
} from "react";
import type { User } from "./types";
import { useRouter } from "next/navigation";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_USER"; user: User | null }
  | { type: "LOGOUT" };

const AuthContext = createContext<{
  state: AuthState;
  dispatch: React.Dispatch<AuthAction>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<boolean>;
  logout: () => void;
} | null>(null);

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.loading };
    case "SET_USER":
      return {
        ...state,
        user: action.user,
        isAuthenticated: !!action.user,
        isLoading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };
    default:
      return state;
  }
}

// Mock users for development
const mockUsers: User[] = [
  {
    id: 1,
    email: "admin@example.com",
    first_name: "Admin",
    last_name: "User",
    role: "admin",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "user@example.com",
    first_name: "John",
    last_name: "Doe",
    role: "customer",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: "SET_USER", user });
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    dispatch({ type: "SET_LOADING", loading: false });
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", loading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock authentication - in production, this would be a real API call
    const user = mockUsers.find((u) => u.email === email);
    if (user && password === "password") {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", user });
      return true;
    }

    dispatch({ type: "SET_LOADING", loading: false });
    return false;
  };

  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", loading: true });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock registration - in production, this would be a real API call
    const existingUser = mockUsers.find((u) => u.email === email);
    if (existingUser) {
      dispatch({ type: "SET_LOADING", loading: false });
      return false;
    }

    const newUser: User = {
      id: mockUsers.length + 1,
      email,
      first_name: firstName,
      last_name: lastName,
      role: "customer",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    mockUsers.push(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    dispatch({ type: "SET_USER", user: newUser });
    return true;
  };

  const logout = () => {
    localStorage.removeItem("user");
    dispatch({ type: "LOGOUT" });
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
