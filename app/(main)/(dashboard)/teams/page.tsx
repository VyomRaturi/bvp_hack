// src/app/teams/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import TeamsSidebar from "@/components/TeamsSidebar";
import { useRouter } from "next/navigation";

const TeamsPage: React.FC = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // Define a proper User interface
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user"); // Create an API route to get current user
        if (!res.ok) throw new Error("Failed to fetch user.");
        const data = await res.json();
        setUser(data.user);
      } catch (error: any) {
        console.error("Error fetching user:", error);
        // toast.error(error.message || "An error occurred while fetching user.");
        // router.push("/login"); // Redirect to login if not authenticated
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  return (
    <div className="flex w-full">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-800 text-white p-4">
        <TeamsSidebar refreshTrigger={false} />
      </div>
      {/* Main Content */}
      <div className="w-2/3 bg-gray-100 p-6 flex items-center justify-center">
        <p className="text-gray-700">Select a team to view and evaluate.</p>
      </div>
    </div>
  );
};

export default TeamsPage;
