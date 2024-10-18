// src/app/api/evaluation/submit/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Evaluation from "@/models/Evaluation";
import Team from "@/models/Team";
// import User from "@/models/User";
// import Question from "@/models/Question";
import { getCurrentUser } from "@/lib/actions/getCurrentUser";
import { Hackathon } from "@/models";

interface SelectedOption {
  answer: string;
  score: number;
}

interface EvaluationInput {
  teamId: string;
  answers: {
    questionIndex: number;
    selectedOption: SelectedOption;
  }[];
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const input: EvaluationInput = await request.json();
    const { teamId, answers } = input;

    // Input Validation (Skipped as per instructions)

    await connectDB();

    // Check if team exists
    const team = await Team.findById(teamId).lean();
    if (!team) {
      return NextResponse.json({ message: "Team not found." }, { status: 404 });
    }

    // Prevent duplicate evaluation
    const existingEvaluation = await Evaluation.findOne({ team: teamId, judge: user._id });
    if (existingEvaluation) {
      return NextResponse.json({ message: "You have already evaluated this team." }, { status: 400 });
    }

    // Fetch hackathon to get questions
    const hackathon = await Hackathon.findById(team.hackathon).populate("questions").lean();
    if (!hackathon || !hackathon.questions) {
      return NextResponse.json({ message: "Hackathon or questions not found." }, { status: 404 });
    }

    const questions = hackathon.questions;

    // Map question index to question ID
    const questionMap: { [key: number]: string } = {};
    questions.forEach((q: any, idx: number) => {
      questionMap[idx + 1] = q._id.toString();
    });

    // Prepare answers with question IDs
    const preparedAnswers = answers.map((ans) => {
      const questionId = questionMap[ans.questionIndex];
      return {
        question: questionId,
        selectedOption: ans.selectedOption,
      };
    });

    // Create Evaluation
    await Evaluation.create({
      team: teamId,
      judge: user._id,
      answers: preparedAnswers,
    });

    return NextResponse.json(
      { message: "Evaluation submitted successfully." },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error submitting evaluation:", error);
    return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
  }
}
