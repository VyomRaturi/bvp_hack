// src/app/api/teams/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Evaluation from "@/models/Evaluation";
import { getCurrentUser } from "@/lib/actions/getCurrentUser";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const teams = await Team.find().select("name email members").lean();

    // If user is a judge, fetch evaluations made by them
    let evaluatedTeamIds: string[] = [];
    if (user.role === "judge") {
      const evaluations = await Evaluation.find({ judge: user._id }).select("team").lean();
      evaluatedTeamIds = evaluations.map((evalDoc) => evalDoc.team.toString());
    }

    // Map teams with status
    const teamsWithStatus = teams.map((team) => ({
      id: team._id.toString(),
      name: team.name,
      email: team.email,
      members: team.members.split(",").map((member: string) => member.trim()),
      isScored: user.role === "judge" ? evaluatedTeamIds.includes(team._id.toString()) : false,
    }));

    return NextResponse.json({ teams: teamsWithStatus }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
