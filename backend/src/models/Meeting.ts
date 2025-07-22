import mongoose, { Schema, Document } from 'mongoose';

export interface IMeeting extends Document {
  _id: string;
  internId: mongoose.Types.ObjectId;
  mentorId: mongoose.Types.ObjectId;
  title: string;
  date: Date;
  time: string;
  type: 'WEEKLY_REVIEW' | 'PROJECT_DISCUSSION' | 'FEEDBACK_SESSION';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  agenda?: string;
  notes?: string;
  createdAt: Date;
}

const MeetingSchema = new Schema<IMeeting>({
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
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    enum: ['WEEKLY_REVIEW', 'PROJECT_DISCUSSION', 'FEEDBACK_SESSION'],
    required: true,
  },
  status: {
    type: String,
    enum: ['SCHEDULED', 'COMPLETED', 'CANCELLED'],
    default: 'SCHEDULED',
  },
  agenda: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
}, {
  timestamps: { createdAt: true, updatedAt: false },
});

// Indexes for performance
MeetingSchema.index({ internId: 1 });
MeetingSchema.index({ mentorId: 1 });
MeetingSchema.index({ date: 1 });
MeetingSchema.index({ status: 1 });

export const Meeting = mongoose.model<IMeeting>('Meeting', MeetingSchema);