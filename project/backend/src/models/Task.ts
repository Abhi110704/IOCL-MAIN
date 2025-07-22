import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
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
    required: true,
    trim: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['PENDING', 'IN_PROGRESS', 'COMPLETED'],
    default: 'PENDING',
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH'],
    default: 'MEDIUM',
  },
}, {
  timestamps: true,
});

// Indexes for performance
TaskSchema.index({ internId: 1 });
TaskSchema.index({ mentorId: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ dueDate: 1 });

export const Task = mongoose.model<ITask>('Task', TaskSchema);