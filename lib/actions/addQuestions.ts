// src/actions/addQuestions.ts

"use server";

import connectDB from "@/lib/mongodb";
import Hackathon from "@/models/Hackathon";
import Question from "@/models/Question";
import mongoose from "mongoose";

export interface Answer {
  answer: string;
  score: number;
}

export interface QuestionInput {
  question: string;
  parameter: string;
  ans: Answer[];
}

interface AddQuestionsPayload {
  hackathonId: string;
  questions: QuestionInput[];
}

interface CreatedQuestion {
  _id: string;
  question: string;
  parameter: string;
  ans: Answer[];
}

export const addQuestionsToHackathon = async (
  payload: AddQuestionsPayload
): Promise<CreatedQuestion[]> => {
  const { hackathonId, questions } = payload;

  // Input validation
  console.log(payload);
  if (!hackathonId || typeof hackathonId !== "string") {
    throw new Error("Invalid hackathonId provided.");
  }

  if (!questions || !Array.isArray(questions) || questions.length === 0) {
    throw new Error("Questions array is required and cannot be empty.");
  }

  // Validate each question object
  questions.forEach((q, index) => {
    if (!q.question || typeof q.question !== "string") {
      throw new Error(`Invalid or missing 'question' at index ${index}.`);
    }

    if (!q.parameter || typeof q.parameter !== "string") {
      throw new Error(`Invalid or missing 'parameter' at index ${index}.`);
    }

    if (!q.ans || !Array.isArray(q.ans) || q.ans.length === 0) {
      throw new Error(`Invalid or missing 'ans' array at index ${index}.`);
    }

    q.ans.forEach((a, ansIndex) => {
      if (!a.answer || typeof a.answer !== "string") {
        throw new Error(
          `Invalid or missing 'answer' at question index ${index}, answer index ${ansIndex}.`
        );
      }

      if (typeof a.score !== "number") {
        throw new Error(
          `Invalid or missing 'score' at question index ${index}, answer index ${ansIndex}.`
        );
      }
    });
  });

  await connectDB();

  // Find the hackathon
  const hackathon = await Hackathon.findById(hackathonId);
  if (!hackathon) {
    throw new Error("Hackathon not found.");
  }

  const createdQuestions: CreatedQuestion[] = [];

  // Create each question and associate with hackathon
  for (const q of questions) {
    const newQuestion = await Question.create({
      question: q.question,
      parameter: q.parameter,
      ans: q.ans,
      hackathon: hackathonId,
    });

    createdQuestions.push({
      _id: newQuestion._id?.toString() ?? "",
      question: newQuestion.question,
      parameter: newQuestion.parameter,
      ans: newQuestion.ans,
    });
    if (!hackathon.questions) {
      hackathon.questions = [];
    }

    if (newQuestion._id) {
      hackathon.questions.push(newQuestion._id as mongoose.Types.ObjectId);
    } else {
      throw new Error("New question ID is missing.");
    }
  }
  console.log(hackathon);
  // Save hackathon with new questions
  await hackathon.save();

  return createdQuestions;
};

export const getParameters = async (name: string, desc: string) => {
  const res = await fetch("https://api.hyperleap.ai/prompts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hl-api-key": "Mjc3OTJkNjNlYWUzNGM3Y2IwMmExNWIwOTkxNjQ1Nzc=",
    },
    body: JSON.stringify({
      promptId: "a20c7115-d361-4b0b-ab72-603f2510f46c",
      replacements: {
        name: name,
        desc: desc,
      },
    }),
  });

  const result = await res.json();
  const content = JSON.parse(result.choices[0].message.content);
  return content;
};

export const getQuestionsFromParameters = async (
  parameters: string[],
  remarks?: string
): Promise<QuestionInput[]> => {
  const res = await fetch("https://api.hyperleap.ai/prompts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-hl-api-key": "Mjc3OTJkNjNlYWUzNGM3Y2IwMmExNWIwOTkxNjQ1Nzc=",
    },
    body: JSON.stringify({
      promptId: "e2352e6f-5e63-477e-a89d-bd172ba26344",
      replacements: {
        parameters: parameters.join(","),
        remarks: remarks ?? "",
      },
    }),
  });
  console.log("here \n\n\n\n", res);
  const result = await res.json();
  console.log(result, "\n\n\n\n");
  const content = result.choices[0].message.content as QuestionInput[];
  return content;
};
