// src/components/LogoutButton.tsx

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "./ui/use-toast";
import Cookie from "js-cookie";
import { Button } from "./ui/button";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to logout.");
      }

      toast({
        title: "Logged out successfully",
      });
      //   toast.success("Logged out successfully.");
      Cookie.remove("authToken");
      router.push("/login"); // Redirect to the login page after logout
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast({
        title: error.message || "An error occurred during logout.",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      onClick={handleLogout}
      size="sm"
    >
      Logout
    </Button>
  );
};

export default LogoutButton;
