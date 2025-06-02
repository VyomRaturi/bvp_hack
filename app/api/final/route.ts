// src/app/api/leaderboard/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Evaluation, { PopulatedEvaluation } from "@/models/Evaluation";
// import  from "@/models/Team";
import {Hackathon, Question, Team, User} from "@/models/index";
// import User from "@/models/User";  // Make sure the User model is imported
import { getCurrentUser } from "@/lib/actions/getCurrentUser";
import mongoose from "mongoose";



export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Connect to the database
    await connectDB();

    // Find hackathons where the user is a judge
    const hackathons = await Hackathon.find({ judges: user._id }).select("teams").lean();

    // Extract team IDs from these hackathons
    const teamIds: mongoose.Types.ObjectId[] = [];
    hackathons.forEach((hackathon) => {
      if (hackathon.teams && hackathon.teams.length > 0) {
        teamIds.push(...hackathon.teams);
      }
    });

    if (teamIds.length === 0) {
      return NextResponse.json({ leaderboard: [], evaluations: [] }, { status: 200 });
    }

    // Fetch all evaluations and teams, and populate the question from answer
    const evaluations = await Evaluation.find({ team: { $in: teamIds } })
    .populate({
      path: 'answers.question',  // Path to populate the 'question' field in answers
      select: 'parameter',       // Selecting only the 'parameter' field from the Question model
      model: 'Question',         // Explicitly define the model to populate
    })
    .populate({
      path: 'judge',             // Path to populate the 'judge' field
      select: 'name',            // Selecting only the 'name' field from the User model
      model: 'User',             // Explicitly define the model to populate
    })
    .populate({
      path: 'team',              // Populate the 'team' field to get the team details
      select: 'name',            // Select the 'name' field from the Team model
      model: 'Team',
    })
    .lean();
    // console.log("here\n\n",evaluations[0])
  const populatedData: PopulatedEvaluation[] = evaluations.map((evaluation) => {
    return evaluation.answers.map((answer: any) => ({
      judge: {
        name: (evaluation.judge as any).name,  // Cast to 'any' to access 'name'
        id: evaluation.judge._id.toString(),
      },
      team: {
        name: (evaluation.team as any).name,    // Cast to 'any' to access 'name'
        id: evaluation.team._id.toString(),
      },
      parameter: answer.question.parameter,  // Access the populated 'parameter'
      score: answer.selectedOption?.score,  // Access the score from 'selectedOption'              // Score from the answer
    }));
  }).flat();  // Flatten the array as `answers` is an array in each evaluation
  

    return NextResponse.json({populatedData}, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
