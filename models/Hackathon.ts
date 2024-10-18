// src/models/Hackathon.ts

import mongoose, { Schema, Document, Model } from "mongoose";

export interface IHackathon extends Document {
  name: string;
  description: string;
  startDate: Date;
  endDate: Date;
  judges?: mongoose.Types.ObjectId[]; // Optional
  teams?: mongoose.Types.ObjectId[];  // Optional
  questions?: mongoose.Types.ObjectId[]; // Optional
  createdAt: Date;
  updatedAt: Date;
}

const HackathonSchema: Schema<IHackathon> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    judges: [{ type: Schema.Types.ObjectId, ref: "User" }], // Optional by default
    teams: [{ type: Schema.Types.ObjectId, ref: "Team" }],  // Optional by default
    questions: [{ type: Schema.Types.ObjectId, ref: "Question" }], // Optional by default
  },
  { timestamps: true }
);

const Hackathon: Model<IHackathon> =
  mongoose.models.Hackathon || mongoose.model<IHackathon>("Hackathon", HackathonSchema);

export default Hackathon;
