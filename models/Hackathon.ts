// src/models/Hackathon.ts

import { Schema, model, Document, Types } from 'mongoose';
import { IUser } from './User';
import { IParameter } from './Parameter';
import { ITeam } from './Team';

export interface IHackathon extends Document {
    name: string;
    description?: string;
    startDate: Date;
    endDate: Date;
    organizers: Types.ObjectId[] | IUser[];
    judges: Types.ObjectId[] | IUser[];
    teams: Types.ObjectId[] | ITeam[];
    parameters: Types.ObjectId[] | IParameter[];
    isJudgingDone: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const hackathonSchema = new Schema<IHackathon>({
    name: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String 
    },
    startDate: { 
        type: Date, 
        required: true 
    },
    endDate: { 
        type: Date, 
        required: true 
    },
    organizers: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }],
    judges: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    }],
    teams: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Team'
    }],
    parameters: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Parameter'
    }],
    isJudgingDone: { 
        type: Boolean, 
        default: false 
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
hackathonSchema.pre<IHackathon>('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Hackathon = model<IHackathon>('Hackathon', hackathonSchema);

export default Hackathon;
