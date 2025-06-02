// src/models/Hackathon.ts

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IHackathon extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  judges: Types.ObjectId[];
  teams: Types.ObjectId[];
  questions: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema: Schema<IHackathon> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    judges: [{ type: Schema.Types.ObjectId, ref: "User", default: [] }],
    teams: [{ type: Schema.Types.ObjectId, ref: "Team", default: [] }],
    questions: [{ type: Schema.Types.ObjectId, ref: "Question", default: [] }],
  },
  { timestamps: true }
);

// Helper middleware to ensure arrays are initialized
HackathonSchema.pre("save", function (next) {
  if (!this.judges) this.judges = [];
  if (!this.teams) this.teams = [];
  if (!this.questions) this.questions = [];
  next();
});

// Prevent OverwriteModelError during hot-reloading
const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon ||
  mongoose.model<IHackathon>("Hackathon", HackathonSchema);

export default Hackathon;
