// src/components/TeamsSidebar.tsx

"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "./ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton from ShadCN

interface Team {
  id: string;
  name: string;
  email: string;
  members: string[];
  isScored: boolean;
}

interface TeamsSidebarProps {
  refreshTrigger: boolean;
}

const TeamsSidebar: React.FC<TeamsSidebarProps> = ({ refreshTrigger }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState<boolean>(true);
  const curTeamId = pathname.split("/")[2];

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const res = await fetch("/api/team");
        if (!res.ok) throw new Error("Failed to fetch teams.");
        const data = await res.json();
        setTeams(data.teams);
      } catch (error: any) {
        console.error("Error fetching teams:", error);
        toast({
          title: error.message || "An error occurred while fetching teams.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
    if (curTeamId) {
      const curTeamIndex = teams.findIndex((team) => team.id === curTeamId);
      if (curTeamIndex != -1 && curTeamIndex < teams.length - 1)
        router.push(`/teams/${teams[curTeamIndex + 1].id}`);
    }
  }, [refreshTrigger]);

  const handleTeamClick = (teamId: string) => {
    router.push(`/teams/${teamId}`);
  };

  if (loading) {
    return (
      <div className="h-full p-4">
        <h2 className="text-2xl font-semibold mb-4">Teams</h2>
        <ul className="space-y-2">
          {Array(10)
            .fill(0)
            .map((_, index) => (
              <li key={index} className="p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-4 w-32 mb-2" />{" "}
                    {/* Skeleton for team name */}
                    <Skeleton className="h-3 w-20" />{" "}
                    {/* Skeleton for team members */}
                  </div>
                  <Skeleton className="h-6 w-12 rounded-full" />{" "}
                  {/* Skeleton for status */}
                </div>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  if (teams.length === 0) {
    return <p className="text-center">No teams available.</p>;
  }

  return (
    <div className="h-full p-4">
      <h2 className="text-2xl font-semibold mb-4">Teams</h2>
      <ul className="space-y-2">
        {teams.map((team) => (
          <li
            key={team.id}
            className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
              pathname === `/teams/${team.id}`
                ? "bg-gray-700"
                : "hover:bg-gray-700 hover:bg-opacity-50"
            }`}
            onClick={() => handleTeamClick(team.id)}
          >
            <div>
              <p className="font-medium">{team.name}</p>
              <p className="text-sm text-gray-300">{team.members.join(", ")}</p>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-1 rounded-full ${
                team.isScored ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {team.isScored ? "Scored" : "Not Scored"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsSidebar;
