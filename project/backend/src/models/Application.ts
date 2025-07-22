import mongoose, { Schema, Document } from 'mongoose';

export interface IApplication extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  internId: {
    type: Schema.Types.ObjectId,
    ref: 'Intern',
    required: true,
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED',
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviewNotes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

// Indexes for performance
ApplicationSchema.index({ internId: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ reviewedBy: 1 });

export const Application = mongoose.model<IApplication>('Application', ApplicationSchema);