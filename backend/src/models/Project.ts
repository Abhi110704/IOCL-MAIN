import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  fileUrl?: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  feedback?: string;
  grade?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

const ProjectSchema = new Schema<IProject>({
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
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  fileUrl: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED',
  },
  feedback: {
    type: String,
    trim: true,
  },
  grade: {
    type: String,
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  reviewedAt: {
    type: Date,
  },
});

// Indexes for performance
ProjectSchema.index({ internId: 1 });
ProjectSchema.index({ mentorId: 1 });
ProjectSchema.index({ status: 1 });

export const Project = mongoose.model<IProject>('Project', ProjectSchema);