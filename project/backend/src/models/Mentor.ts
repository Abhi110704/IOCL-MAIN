import mongoose, { Schema, Document } from 'mongoose';

export interface IMentor extends Document {
  _id: string;
  empId: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  experience?: string;
  maxCapacity: number;
  currentInterns: number;
  createdAt: Date;
  updatedAt: Date;
}

const MentorSchema = new Schema<IMentor>({
  empId: {
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
  department: {
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
    trim: true,
  },
  availability: {
    type: String,
    enum: ['AVAILABLE', 'BUSY', 'UNAVAILABLE'],
    default: 'AVAILABLE',
  },
  experience: {
    type: String,
    trim: true,
  },
  maxCapacity: {
    type: Number,
    default: 3,
    min: 1,
    max: 10,
  },
  currentInterns: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});


export const Mentor = mongoose.model<IMentor>('Mentor', MentorSchema);