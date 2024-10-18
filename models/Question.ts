import { Schema, model, Document, Types } from 'mongoose';
import { IHackathon } from './Hackathon';
import { IParameter } from './Parameter';

export interface IQuestionOption {
    text: string;
    score: number; // 1 to 4
}

export interface IQuestion extends Document {
    hackathon: Types.ObjectId | IHackathon;
    parameter: Types.ObjectId | IParameter;
    text: string;
    options: IQuestionOption[]; // MCQs with scores
    createdAt: Date;
    updatedAt: Date;
}

const questionOptionSchema = new Schema<IQuestionOption>({
    text: { 
        type: String, 
        required: true 
    },
    score: { 
        type: Number, 
        required: true,
        enum: [1, 2, 3, 4]
    }
}, { _id: false });

const questionSchema = new Schema<IQuestion>({
    hackathon: { 
        type: Schema.Types.ObjectId, 
        ref: 'Hackathon', 
        required: true 
    },
    parameter: { 
        type: Schema.Types.ObjectId, 
        ref: 'Parameter', 
        required: true 
    },
    text: { 
        type: String, 
        required: true 
    },
    options: { 
        type: [questionOptionSchema], 
        validate: {
            validator: function(v: IQuestionOption[]) {
                return v.length === 4; // Ensure exactly 4 options
            },
            message: 'Each question must have exactly 4 options.'
        },
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
questionSchema.pre<IQuestion>('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Question = model<IQuestion>('Question', questionSchema);

export default Question;
