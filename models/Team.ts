// src/models/Team.ts

import { Schema, model, Document, Types, Model } from 'mongoose';
import { IHackathon } from './Hackathon';
import mongoose from 'mongoose';

export interface ITeam extends Document {
    hackathon: Types.ObjectId | IHackathon;
    name: string;
    email : string;
    members: string; // List of member names or emails
    password : string
    createdAt: Date;
    updatedAt: Date;
}

const teamSchema = new Schema<ITeam>({
    hackathon: { 
        type: Schema.Types.ObjectId, 
        ref: 'Hackathon', 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    members:{ 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Pre-save hook to update updatedAt
teamSchema.pre<ITeam>('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Team: Model<ITeam> = 
  mongoose.models.Team || mongoose.model<ITeam>("Team", teamSchema);

export default Team;
