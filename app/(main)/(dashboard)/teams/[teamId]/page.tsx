// src/app/teams/[teamId]/page.tsx

"use client";

import React, { useEffect, useState } from "react";
import TeamsSidebar from "@/components/TeamsSidebar";
import QuestionsPreview from "@/components/hack/QuestionPreview";
import { useRouter, usePathname } from "next/navigation";


interface TeamPageProps {
  params: {
    teamId: string;
  };
}

const TeamPage: React.FC<TeamPageProps> = ({ params }) => {
  const { teamId } = params;
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null); // Define a proper User interface
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user");
        if (!res.ok) throw new Error("Failed to fetch user.");
        const data = await res.json();
        setUser(data.user);
      } catch (error: any) {
        console.error("Error fetching user:", error);
        // toast.error(error.message || "An error occurred while fetching user.");
        // router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [router]);

  const handleEvaluationSubmit = () => {
    // Toggle the refresh trigger to refetch teams in the sidebar
    setRefreshTrigger((prev) => !prev);
  };

  if (loading) {
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="flex  w-full max-h-[87vh] overflow-y-scroll app-scrollbar">
      {/* Sidebar */}
      <div className="w-1/3 bg-gray-800 text-white p-4 app-scrollbar overflow-y-scroll">
        <TeamsSidebar refreshTrigger={refreshTrigger} />
      </div>
      {/* Main Content */}
      <div className="w-2/3 bg-gray-100 p-6 overflow-y-scroll app-scrollbar">
        <QuestionsPreview teamId={teamId} onEvaluationSubmit={handleEvaluationSubmit} />
      </div>
    </div>
  );
};

export default TeamPage;
