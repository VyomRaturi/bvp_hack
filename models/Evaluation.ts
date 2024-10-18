import { Schema, model, Document, Types } from 'mongoose';
import { IHackathon } from './Hackathon';
import { IUser } from './User';
import { ITeam } from './Team';
import { IQuestion } from './Question';

export interface IEvaluationResponse {
    question: Types.ObjectId | IQuestion;
    selectedScore: number; // 1 to 4
}

export interface IEvaluation extends Document {
    hackathon: Types.ObjectId | IHackathon;
    judge: Types.ObjectId | IUser;
    team: Types.ObjectId | ITeam;
    responses: IEvaluationResponse[];
    submittedAt: Date;
}

const evaluationResponseSchema = new Schema<IEvaluationResponse>({
    question: { 
        type: Schema.Types.ObjectId, 
        ref: 'Question', 
        required: true 
    },
    selectedScore: { 
        type: Number, 
        required: true,
        enum: [1, 2, 3, 4]
    }
}, { _id: false });

const evaluationSchema = new Schema<IEvaluation>({
    hackathon: { 
        type: Schema.Types.ObjectId, 
        ref: 'Hackathon', 
        required: true 
    },
    judge: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    team: { 
        type: Schema.Types.ObjectId, 
        ref: 'Team', 
        required: true 
    },
    responses: { 
        type: [evaluationResponseSchema],
        required: true,
        validate: {
            validator: function(v: IEvaluationResponse[]) {
                // Assuming all questions for the hackathon are answered
                // You may add more validation as needed
                return v.length > 0;
            },
            message: 'Each evaluation must have at least one response.'
        }
    },
    submittedAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Pre-save hook to update submittedAt
evaluationSchema.pre<IEvaluation>('save', function(next) {
    this.submittedAt = new Date();
    next();
});

const Evaluation = model<IEvaluation>('Evaluation', evaluationSchema);

export default Evaluation;
