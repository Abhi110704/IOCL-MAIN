import mongoose, { Schema, Document } from 'mongoose';

export interface IIntern extends Document {
  _id: string;
  internId: string;
  name: string;
  email: string;
  phone: string;
  institute: string;
  course: string;
  semester: string;
  rollNumber: string;
  department: string;
  startDate: Date;
  endDate: Date;
  address: string;
  documents: Record<string, string>;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
  referredBy: string;
  referredByEmpId: string;
  createdAt: Date;
  updatedAt: Date;
}

const InternSchema = new Schema<IIntern>({
  internId: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },
  institute: {
    type: String,
    required: true,
    trim: true,
  },
  course: {
    type: String,
    required: true,
    trim: true,
  },
  semester: {
    type: String,
    required: true,
    trim: true,
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true,
  },
  department: {
    type: String,
    required: true,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  address: {
    type: String,
    required: true,
    trim: true,
  },
  documents: {
    type: Schema.Types.Mixed,
    default: {},
  },
  status: {
    type: String,
    enum: ['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ACTIVE', 'COMPLETED'],
    default: 'SUBMITTED',
  },
  referredBy: {
    type: String,
    required: true,
    trim: true,
  },
  referredByEmpId: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
});



export const Intern = mongoose.model<IIntern>('Intern', InternSchema);