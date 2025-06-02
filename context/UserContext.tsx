// src/context/UserContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

interface User {
  email: string;
  role: string;
  name?: string;
  id?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await fetch(`/api/user?t=${Date.now()}`, {
        credentials: "include",
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setUser(null);
          sessionStorage.removeItem("user");
          return;
        }
        throw new Error(`Failed to fetch user: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.user) {
        setUser(data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
      } else {
        setUser(null);
        sessionStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
      sessionStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to logout");
      }

      // Clear user state
      setUser(null);
      sessionStorage.removeItem("user");

      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });

      // Force a hard navigation to login
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to logout. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        // Check sessionStorage first
        const storedUser = sessionStorage.getItem("user");
        if (storedUser && mounted) {
          try {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
          } catch (error) {
            console.error("Error parsing stored user:", error);
            sessionStorage.removeItem("user");
          }
        }

        // Then refresh from server
        await refreshUser();
      } catch (error) {
        console.error("Error initializing auth:", error);
        if (mounted) {
          setUser(null);
          sessionStorage.removeItem("user");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
