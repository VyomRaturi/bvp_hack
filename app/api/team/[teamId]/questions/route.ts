// src/app/api/teams/[teamId]/questions/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import {Team, Hackathon, Question} from "@/models/index";
import { getCurrentUser } from "@/lib/actions/getCurrentUser";

export async function GET(request: NextRequest, { params }: { params: { teamId: string } }) {
  try {
    const { teamId } = params;
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const team = await Team.findById(teamId).lean();
    if (!team) {
      return NextResponse.json({ message: "Team not found" }, { status: 404 });
    }

    const hackathon = await Hackathon.findById(team.hackathon).populate("questions").lean();
    if (!hackathon) {
      return NextResponse.json({ message: "Hackathon not found" }, { status: 404 });
    }

    const questions = hackathon.questions?.map((q: any, index: number) => ({
      index: index + 1,
      question: q.question,
      parameter: q.parameter,
      answers: q.ans,
    }));

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
