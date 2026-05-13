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

// ─── State & actions ──────────────────────────────────────────────────────────

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: "SET_LOADING"; loading: boolean }
  | { type: "SET_USER"; user: User | null }
  | { type: "LOGOUT" };

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
      return { ...state, user: null, isAuthenticated: false, isLoading: false };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

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
  logout: () => Promise<void>;
} | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });
  const router = useRouter();

  /**
   * On mount, hit GET /api/auth/me to restore the session from the httpOnly
   * cookie. This replaces the old localStorage.getItem("user") pattern so
   * the token is never accessible from JavaScript.
   */
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then(({ user }) => dispatch({ type: "SET_USER", user: user ?? null }))
      .catch(() => dispatch({ type: "SET_USER", user: null }));
  }, []);

  /**
   * Login: delegates credential validation to POST /api/auth/login.
   * The server sets the session cookie — the client never sees the token.
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", loading: true });

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch({ type: "SET_LOADING", loading: false });
        return false;
      }

      dispatch({ type: "SET_USER", user: data.user });
      return true;
    } catch {
      dispatch({ type: "SET_LOADING", loading: false });
      return false;
    }
  };

  /**
   * Register: creates a WooCommerce customer via POST /api/auth/register.
   * On success, the server auto-logs the user in (sets the session cookie)
   * and returns the new user object.
   */
  const register = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<boolean> => {
    dispatch({ type: "SET_LOADING", loading: true });

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, firstName, lastName }),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch({ type: "SET_LOADING", loading: false });
        return false;
      }

      dispatch({ type: "SET_USER", user: data.user });
      return true;
    } catch {
      dispatch({ type: "SET_LOADING", loading: false });
      return false;
    }
  };

  /**
   * Logout: calls DELETE /api/auth/me to clear the httpOnly cookie server-side,
   * then resets local state and navigates to home.
   */
  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/me", { method: "DELETE" });
    } catch {
      // Non-blocking — even if the server is unreachable, clear local state
    } finally {
      dispatch({ type: "LOGOUT" });
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ state, dispatch, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
