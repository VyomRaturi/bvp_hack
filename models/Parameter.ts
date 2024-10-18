// src/models/Parameter.ts

import { Schema, model, Document, Types } from "mongoose";
import { IHackathon } from "./Hackathon";

export interface IParameter extends Document {
  hackathon: Types.ObjectId | IHackathon;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const parameterSchema = new Schema<IParameter>({
  hackathon: {
    type: Schema.Types.ObjectId,
    ref: "Hackathon",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
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

// Pre-save hook to update updatedAt
parameterSchema.pre<IParameter>("save", function (next) {
  this.updatedAt = new Date();
  next();
});

const Parameter = model<IParameter>("Parameter", parameterSchema);

export default Parameter;
