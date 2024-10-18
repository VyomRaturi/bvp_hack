// src/app/teams/layout.tsx

"use client";

import React from "react";
import TeamsSidebar from "@/components/TeamsSidebar";

interface TeamsLayoutProps {
  children: React.ReactNode;
}

const TeamsLayout: React.FC<TeamsLayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen">

        {children}

    </div>
  );
};

export default TeamsLayout;
