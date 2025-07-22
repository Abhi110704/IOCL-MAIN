import mongoose, { Schema, Document } from 'mongoose';

export interface IAssignment extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  department: string;
  assignedAt: Date;
  isActive: boolean;
}

const AssignmentSchema = new Schema<IAssignment>({
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
  department: {
    type: String,
    required: true,
    trim: true,
  },
  assignedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Compound index to ensure unique active assignments
AssignmentSchema.index({ internId: 1, mentorId: 1 }, { unique: true });
AssignmentSchema.index({ internId: 1, isActive: 1 });
AssignmentSchema.index({ mentorId: 1, isActive: 1 });

export const Assignment = mongoose.model<IAssignment>('Assignment', AssignmentSchema);