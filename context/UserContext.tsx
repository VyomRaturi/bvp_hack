// src/context/UserContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getUserFromServer } from "@/lib/actions/getUser"; // Server action to fetch user
import { useRouter } from "next/navigation";

interface User {
  email: string;
  role: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const refreshUser = async () => {
    setLoading(true);
    try {
      const fetchedUser = await getUserFromServer();
      setUser(fetchedUser);
    } catch (error) {
      console.error("Error refreshing user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only attempt to fetch user if token exists in cookies
    const fetchUser = async () => {
      // Since 'getUserFromServer' handles token presence,
      // we can directly call it
      await refreshUser();
    };

    fetchUser();
  }, [router]);

  return (
    <UserContext.Provider value={{ user, loading, refreshUser }}>
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
