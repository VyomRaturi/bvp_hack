import { Schema, model, Document, Types } from 'mongoose';
import { ITeam } from './Team';
import { IParameter } from './Parameter';

export interface IFeedbackParameter {
    parameter: Types.ObjectId | IParameter;
    averageScore: number;
}

export interface IFeedback extends Document {
    team: Types.ObjectId | ITeam;
    parameters: IFeedbackParameter[];
    createdAt: Date;
    updatedAt: Date;
}

const feedbackParameterSchema = new Schema<IFeedbackParameter>({
    parameter: { 
        type: Schema.Types.ObjectId, 
        ref: 'Parameter' 
    },
    averageScore: { 
        type: Number, 
        required: true 
    }
}, { _id: false });

const feedbackSchema = new Schema<IFeedback>({
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team', 
        required: true 
    },
    parameters: { 
        type: [feedbackParameterSchema],
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
feedbackSchema.pre<IFeedback>('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Feedback = model<IFeedback>('Feedback', feedbackSchema);

export default Feedback;
