import mongoose, { Schema, Model } from 'mongoose';

export interface IFeedback {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    sentiment: 'Proud' | 'Emotional' | 'Neutral' | 'Confused' | 'Frustrated';
    message?: string;
    createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    sentiment: { 
        type: String, 
        enum: ['Proud', 'Emotional', 'Neutral', 'Confused', 'Frustrated'], 
        required: true 
    },
    message: { type: String },
    createdAt: { type: Date, default: Date.now }
});

// Prevent Mongoose OverwriteModelError in development
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Feedback;
}

const Feedback: Model<IFeedback> = mongoose.models.Feedback || mongoose.model<IFeedback>('Feedback', FeedbackSchema);

export default Feedback;
