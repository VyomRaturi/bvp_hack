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

  // Convert the string hackathonId to ObjectId
  const hackathonObjectId = new mongoose.Types.ObjectId(hackathonId);

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
  const hackathon = await Hackathon.findById(hackathonObjectId);
  if (!hackathon) {
    throw new Error("Hackathon not found.");
  }

  if (hackathon.questions && hackathon.questions.length > 0) {
    console.log(`Deleting ${hackathon.questions.length} existing questions.`);
    await Question.deleteMany({ _id: { $in: hackathon.questions } });
    hackathon.questions = []; // Clear existing questions
  }

  const createdQuestions: CreatedQuestion[] = [];

  // Create each question and associate with hackathon
  for (const q of questions) {
    const newQuestion = await Question.create({
      question: q.question,
      parameter: q.parameter,
      ans: q.ans,
      // hackathon: hackathonObjectId,
    });

    const questionObj = newQuestion.toObject({
      getters: true,
      virtuals: false,
    });
    createdQuestions.push({
      _id: questionObj._id?.toString() ?? "",
      question: questionObj.question,
      parameter: questionObj.parameter,
      ans: questionObj.ans.map((ans: any) => ({
        answer: ans.answer,
        score: ans.score,
      })),
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

  // Save hackathon with new questions
  await hackathon.save();

  return createdQuestions;
};

export const getParameters = async (name: string, desc: string) => {
  try {
    const res = await fetch(
      "https://api-dev1.hyperleap.ai/prompt-runs/run-sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hl-api-key": process.env.NEXT_PUBLIC_HYPERLEAP_API_KEY ?? "",
        },
        body: JSON.stringify({
          promptId: "1794af31-67aa-4f35-949e-a4e37bcd2186",
          replacements: {
            name: name,
            desc: desc,
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const result = await res.json();

    // process this content before parsing it like in qns api
    const content = result.choices[0].message.content;
    const trimmedContent = content.replace(/```json|```/g, "").trim();
    const parsedContent = JSON.parse(trimmedContent) as string[];
    return parsedContent;
  } catch (error) {
    console.error("Error in getParameters:", error);
    // Fallback realistic parameters for hackathon evaluation
    return [
      "Technical Innovation",
      "Problem Solving",
      "User Experience",
      "Implementation Quality",
      "Market Potential",
      "Technical Complexity",
      "Code Quality",
      "Presentation Skills",
      "Team Collaboration",
      "Originality",
    ];
  }
};

export const getQuestionsFromParameters = async (
  parameters: string[],
  remarks?: string
): Promise<QuestionInput[]> => {
  try {
    const res = await fetch(
      "https://api-dev1.hyperleap.ai/prompt-runs/run-sync",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-hl-api-key": process.env.NEXT_PUBLIC_HYPERLEAP_API_KEY ?? "",
        },
        body: JSON.stringify({
          promptId: "5bceb776-c78a-48f1-89b6-3c65725b9e55",
          replacements: {
            parameters: parameters.join(","),
            remarks: remarks ?? "",
          },
        }),
      }
    );

    if (!res.ok) {
      throw new Error(`API request failed with status ${res.status}`);
    }

    const result = await res.json();
    console.log("Questions result", result);
    const content = result.choices[0].message.content;

    // Trim starting and ending ```json tags and parse the content
    const trimmedContent = content.replace(/```json|```/g, "").trim();
    const parsedContent = JSON.parse(trimmedContent) as QuestionInput[];
    return parsedContent;
  } catch (error) {
    console.error("Error in getQuestionsFromParameters:", error);
    // Fallback realistic questions based on common parameters
    return [
      {
        question:
          "How well does the project demonstrate technical innovation in its approach?",
        parameter: "Technical Innovation",
        ans: [
          {
            answer: "Poor - Shows minimal or no technical innovation",
            score: 1,
          },
          {
            answer: "Below Average - Shows limited technical innovation",
            score: 2,
          },
          { answer: "Average - Shows basic technical innovation", score: 3 },
          { answer: "Good - Shows solid technical innovation", score: 4 },
          {
            answer: "Excellent - Shows exceptional technical innovation",
            score: 5,
          },
        ],
      },
      {
        question:
          "How effectively does the project solve the identified problem?",
        parameter: "Problem Solving",
        ans: [
          { answer: "Poor - Fails to solve the problem effectively", score: 1 },
          { answer: "Below Average - Partially solves the problem", score: 2 },
          { answer: "Average - Adequately solves the problem", score: 3 },
          { answer: "Good - Effectively solves the problem", score: 4 },
          {
            answer:
              "Excellent - Provides an exceptional solution to the problem",
            score: 5,
          },
        ],
      },
      {
        question: "How user-friendly and intuitive is the project's interface?",
        parameter: "User Experience",
        ans: [
          { answer: "Poor - Difficult to use and navigate", score: 1 },
          { answer: "Below Average - Somewhat user-friendly", score: 2 },
          { answer: "Average - Reasonably user-friendly", score: 3 },
          { answer: "Good - User-friendly and intuitive", score: 4 },
          {
            answer: "Excellent - Highly user-friendly and intuitive",
            score: 5,
          },
        ],
      },
      {
        question: "How well is the project implemented and executed?",
        parameter: "Implementation Quality",
        ans: [
          { answer: "Poor - Poorly implemented with many issues", score: 1 },
          {
            answer: "Below Average - Partially implemented with some issues",
            score: 2,
          },
          {
            answer: "Average - Adequately implemented with few issues",
            score: 3,
          },
          { answer: "Good - Well-implemented with minimal issues", score: 4 },
          {
            answer: "Excellent - Exceptionally well-implemented with no issues",
            score: 5,
          },
        ],
      },
      {
        question:
          "What is the potential for the project to be successful in the market?",
        parameter: "Market Potential",
        ans: [
          { answer: "Poor - Limited or no market potential", score: 1 },
          { answer: "Below Average - Moderate market potential", score: 2 },
          { answer: "Average - Reasonable market potential", score: 3 },
          { answer: "Good - Strong market potential", score: 4 },
          { answer: "Excellent - Exceptional market potential", score: 5 },
        ],
      },
      {
        question: "How technically complex is the project's implementation?",
        parameter: "Technical Complexity",
        ans: [
          { answer: "Poor - Minimal technical complexity", score: 1 },
          { answer: "Below Average - Limited technical complexity", score: 2 },
          { answer: "Average - Moderate technical complexity", score: 3 },
          { answer: "Good - High technical complexity", score: 4 },
          {
            answer: "Excellent - Exceptionally high technical complexity",
            score: 5,
          },
        ],
      },
      {
        question:
          "How well-structured and maintainable is the project's codebase?",
        parameter: "Code Quality",
        ans: [
          {
            answer: "Poor - Poorly structured and difficult to maintain",
            score: 1,
          },
          {
            answer: "Below Average - Somewhat structured but needs improvement",
            score: 2,
          },
          {
            answer: "Average - Reasonably structured and maintainable",
            score: 3,
          },
          { answer: "Good - Well-structured and maintainable", score: 4 },
          {
            answer:
              "Excellent - Exceptionally well-structured and maintainable",
            score: 5,
          },
        ],
      },
      {
        question:
          "How effectively does the team present and communicate their project?",
        parameter: "Presentation Skills",
        ans: [
          {
            answer: "Poor - Ineffective presentation and communication",
            score: 1,
          },
          {
            answer:
              "Below Average - Somewhat effective presentation and communication",
            score: 2,
          },
          {
            answer:
              "Average - Reasonably effective presentation and communication",
            score: 3,
          },
          {
            answer: "Good - Effective presentation and communication",
            score: 4,
          },
          {
            answer:
              "Excellent - Highly effective and engaging presentation and communication",
            score: 5,
          },
        ],
      },
      {
        question: "How well does the team collaborate and work together?",
        parameter: "Team Collaboration",
        ans: [
          {
            answer: "Poor - Lack of collaboration and poor team dynamics",
            score: 1,
          },
          {
            answer: "Below Average - Limited collaboration and team dynamics",
            score: 2,
          },
          {
            answer: "Average - Reasonable collaboration and team dynamics",
            score: 3,
          },
          { answer: "Good - Strong collaboration and team dynamics", score: 4 },
          {
            answer: "Excellent - Exceptional collaboration and team dynamics",
            score: 5,
          },
        ],
      },
      {
        question: "How unique and innovative is the project's overall concept?",
        parameter: "Originality",
        ans: [
          { answer: "Poor - Lacks originality and innovation", score: 1 },
          {
            answer: "Below Average - Shows limited originality and innovation",
            score: 2,
          },
          {
            answer:
              "Average - Demonstrates reasonable originality and innovation",
            score: 3,
          },
          {
            answer: "Good - Exhibits strong originality and innovation",
            score: 4,
          },
          {
            answer:
              "Excellent - Showcases exceptional originality and innovation",
            score: 5,
          },
        ],
      },
    ];
  }
};
