import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { User, InsertUser } from "@shared/schema";
import { queryClient } from "@/lib/queryClient";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  loginMutation: any;
  registerMutation: any;
  logoutMutation: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/user"],
    queryFn: () => api.get<User>("/api/user"),
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: (credentials: { username: string; password: string }) =>
      api.post("/api/login", credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: (userData: InsertUser) => api.post("/api/register", userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => api.post("/api/logout"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        loginMutation,
        registerMutation,
        logoutMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}