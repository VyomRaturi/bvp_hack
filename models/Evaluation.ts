// src/models/Evaluation.ts

import mongoose, { Schema, Document, Model } from "mongoose";

interface SelectedOption {
  answer: string;
  score: number;
}

interface Answer {
  question: mongoose.Types.ObjectId;
  selectedOption: SelectedOption;
}

export interface IEvaluation extends Document {
  team: mongoose.Types.ObjectId;
  judge: mongoose.Types.ObjectId;
  answers: Answer[];
  createdAt: Date;
  updatedAt: Date;
}
export type PopulatedEvaluation = {
  judge: { name: string; id: string };
  team: { name: string; id: string };
  parameter: string;
  score: number;
};

const AnswerSchema: Schema = new Schema({
  question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  selectedOption: {
    answer: { type: String, required: true },
    score: { type: Number, required: true },
  },
});

const EvaluationSchema: Schema<IEvaluation> = new Schema(
  {
    team: { type: Schema.Types.ObjectId, ref: "Team", required: true },
    judge: { type: Schema.Types.ObjectId, ref: "User", required: true },
    answers: { type: [AnswerSchema], required: true },
  },
  { timestamps: true }
);

// Prevent model recompilation
const Evaluation: Model<IEvaluation> =
  mongoose.models.Evaluation || mongoose.model<IEvaluation>("Evaluation", EvaluationSchema);

export default Evaluation;
