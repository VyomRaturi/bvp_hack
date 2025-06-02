// src/models/Team.ts

import { Schema, model, Document, Types, Model } from "mongoose";
import { IHackathon } from "./Hackathon";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

export interface ITeam extends Document {
  hackathon: Types.ObjectId | IHackathon;
  name: string;
  email: string;
  password: string;
  members: string; // List of member names or emails
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const teamSchema = new Schema<ITeam>({
  hackathon: {
    type: Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  members: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update updatedAt and hash password
teamSchema.pre<ITeam>("save", async function (next) {
  this.updatedAt = new Date();

  if (this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

// Method to compare password
teamSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Prevent OverwriteModelError during hot-reloading
const Team: Model<ITeam> =
  mongoose.models.Team || model<ITeam>("Team", teamSchema);

export default Team;
