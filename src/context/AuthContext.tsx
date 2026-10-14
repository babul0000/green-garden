"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import type { AuthUser } from "@/lib/auth";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  register: (data: { name: string; email: string; password: string; role?: string }) => Promise<{ success: boolean; error?: string; user?: AuthUser }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Check current session from /api/auth/me
  const refreshUser = useCallback(async () => {
    try {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("gg_auth_token") : null;
      const headers: Record<string, string> = {};
      if (storedToken) {
        headers["Authorization"] = `Bearer ${storedToken}`;
      }

      const res = await fetch("/api/auth/me", {
        headers,
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { success: false, error: data.error || "Login failed. Please try again." };
      }

      // Store in localStorage for mobile data & cross-origin resilience
      if (data.token && typeof window !== "undefined") {
        localStorage.setItem("gg_auth_token", data.token);
      }

      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected network error occurred." };
    }
  };

  const register = async (data: { name: string; email: string; password: string; role?: string }) => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (!res.ok) {
        return { success: false, error: result.error || "Registration failed. Please try again." };
      }

      // Store in localStorage for mobile data & cross-origin resilience
      if (result.token && typeof window !== "undefined") {
        localStorage.setItem("gg_auth_token", result.token);
      }

      setUser(result.user);
      return { success: true, user: result.user };
    } catch (err: any) {
      return { success: false, error: err.message || "An unexpected network error occurred." };
    }
  };

  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        localStorage.removeItem("gg_auth_token");
      }
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } finally {
      setUser(null);
      window.location.href = "/login";
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
