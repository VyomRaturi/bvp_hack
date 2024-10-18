// src/models/Team.ts

import { Schema, model, Document, Types } from 'mongoose';
import { IHackathon } from './Hackathon';

export interface ITeam extends Document {
    hackathon: Types.ObjectId | IHackathon;
    name: string;
    members: string[]; // List of member names or emails
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
    members: [{ 
        type: String, 
        required: true 
    }],
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

const Team = model<ITeam>('Team', teamSchema);

export default Team;
