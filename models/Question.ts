// src/models/Question.ts

import mongoose, { Schema, Document, Model } from "mongoose";

interface Answer {
  answer: string;
  score: number;
}

export interface IQuestion extends Document {
  question: string;
  ans: Answer[];
  parameter: string;
  hackathon: mongoose.Types.ObjectId; // Reference to Hackathon
}

const AnswerSchema: Schema = new Schema({
  answer: { type: String, required: true },
  score: { type: Number, required: true },
});

const QuestionSchema: Schema<IQuestion> = new Schema(
  {
    question: { type: String, required: true },
    ans: [AnswerSchema],
    parameter: { type: String, required: true },
    hackathon: { type: Schema.Types.ObjectId, ref: "Hackathon", required: true },
  },
  { timestamps: true }
);

const Question: Model<IQuestion> =
  mongoose.models.Question || mongoose.model<IQuestion>("Question", QuestionSchema);

export default Question;
