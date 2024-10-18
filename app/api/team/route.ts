// src/app/api/teams/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Team from "@/models/Team";
import Hackathon from "@/models/Hackathon"; // Import Hackathon model
import Evaluation from "@/models/Evaluation";
import { getCurrentUser } from "@/lib/actions/getCurrentUser";
import mongoose from "mongoose";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    let teamIds: mongoose.Types.ObjectId[] = [];
    let evaluatedTeamIds: string[] = [];

    if (user.role === "judge") {
      // **Step 1: Find hackathons where the user is a judge**
      const hackathons = await Hackathon.find({ judges: user._id }).select("teams").lean();

      // **Step 2: Extract team IDs from hackathons**
      hackathons.forEach((hackathon) => {
        if (hackathon.teams && hackathon.teams.length > 0) {
          teamIds.push(...hackathon.teams);
        }
      });

      if (teamIds.length === 0) {
        // No teams associated with the hackathons the user judges
        return NextResponse.json({ teams: [] }, { status: 200 });
      }

      // **Step 3: Fetch teams with the extracted team IDs**
      const teams = await Team.find({ _id: { $in: teamIds } })
        .select("name email members")
        .lean();

      // **Step 4: Fetch evaluations made by the judge for these teams**
      const evaluations = await Evaluation.find({ judge: user._id, team: { $in: teamIds } })
        .select("team")
        .lean();

      evaluatedTeamIds = evaluations.map((evalDoc) => evalDoc.team.toString());

      // **Step 5: Map teams with status**
      const teamsWithStatus = teams.map((team) => ({
        id: team._id.toString(),
        name: team.name,
        email: team.email,
        members: team.members.split(",").map((member: string) => member.trim()),
        isScored: evaluatedTeamIds.includes(team._id.toString()),
      }));

      return NextResponse.json({ teams: teamsWithStatus }, { status: 200 });
    } else if (user.role === "organizer") {
      // **Optional: Handle Organizer Role**
      // Assuming organizers have hackathons they manage, similar to judges

      // Replace 'organizers' with the actual field name if different
      const hackathons = await Hackathon.find({ organizers: user._id }).select("teams").lean();

      hackathons.forEach((hackathon) => {
        if (hackathon.teams && hackathon.teams.length > 0) {
          teamIds.push(...hackathon.teams);
        }
      });

      if (teamIds.length === 0) {
        return NextResponse.json({ teams: [] }, { status: 200 });
      }

      const teams = await Team.find({ _id: { $in: teamIds } })
        .select("name email members")
        .lean();

      // Organizers might not have evaluations, so 'isScored' could be false or based on other logic
      const teamsWithStatus = teams.map((team) => ({
        id: team._id.toString(),
        name: team.name,
        email: team.email,
        members: team.members.split(",").map((member: string) => member.trim()),
        isScored: false, // Adjust based on your logic
      }));

      return NextResponse.json({ teams: teamsWithStatus }, { status: 200 });
    } else {
      // **Handle Other Roles or Unauthorized Access**
      return NextResponse.json({ message: "Unauthorized role" }, { status: 403 });
    }
  } catch (error: any) {
    console.error("Error fetching teams:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
