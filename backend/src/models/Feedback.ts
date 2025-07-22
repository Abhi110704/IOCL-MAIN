import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  rating: number;
  communication: number;
  technical: number;
  teamwork: number;
  initiative: number;
  comments: string;
  createdAt: Date;
}

const FeedbackSchema = new Schema<IFeedback>({
  internId: {
    type: Schema.Types.ObjectId,
    ref: 'Intern',
    required: true,
  },
  mentorId: {
    type: Schema.Types.ObjectId,
    ref: 'Mentor',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  communication: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  technical: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  teamwork: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  initiative: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  comments: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes for performance
FeedbackSchema.index({ internId: 1 });
FeedbackSchema.index({ mentorId: 1 });

export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);