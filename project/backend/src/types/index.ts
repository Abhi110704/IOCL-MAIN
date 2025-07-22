import { z } from 'zod';
import { Types } from 'mongoose';

// Database Types (matching Prisma schema)
export interface User {
  _id: string;
  username: string;
  password: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'INTERN' | 'MENTOR';
  empId?: string;
  name: string;
  email?: string;
  phone?: string;
  department?: string;
  isFirstLogin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Intern {
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
  status: InternStatus;
  referredBy: string;
  referredByEmpId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Mentor {
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

export interface Assignment {
  _id: string;
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  department: string;
  assignedAt: Date;
  isActive: boolean;
}

export interface Application {
  _id: string;
  internId: Types.ObjectId;
  status: ApplicationStatus;
  reviewedBy?: Types.ObjectId;
  reviewNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feedback {
  _id: string;
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  rating: number;
  communication: number;
  technical: number;
  teamwork: number;
  initiative: number;
  comments: string;
  createdAt: Date;
}

export interface Task {
  _id: string;
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  title: string;
  description: string;
  dueDate: Date;
  status: TaskStatus;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  _id: string;
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  title: string;
  description?: string;
  fileUrl?: string;
  status: ProjectStatus;
  feedback?: string;
  grade?: string;
  submittedAt: Date;
  reviewedAt?: Date;
}

export interface Meeting {
  _id: string;
  internId: Types.ObjectId;
  mentorId: Types.ObjectId;
  title: string;
  date: Date;
  time: string;
  type: MeetingType;
  status: MeetingStatus;
  agenda?: string;
  notes?: string;
  createdAt: Date;
}

// Enums
export type InternStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVE' | 'COMPLETED';
export type ApplicationStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ProjectStatus = 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
export type MeetingType = 'WEEKLY_REVIEW' | 'PROJECT_DISCUSSION' | 'FEEDBACK_SESSION';
export type MeetingStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface AuthResponse {
  token: string;
  user: Omit<User, 'password'>;
}

export interface StatusUpdate {
  type: 'APPLICATION_STATUS' | 'PROJECT_STATUS' | 'TASK_STATUS';
  id: string;
  status: string;
  userId?: string;
}

// Custom Error Types
export class ApiError extends Error {
  public status: number;
  public isOperational: boolean;

  constructor(message: string, status: number = 500, isOperational: boolean = true) {
    super(message);
    this.status = status;
    this.isOperational = isOperational;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation Schemas using Zod
export const CreateInternSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  institute: z.string().min(3, 'Institute name must be at least 3 characters'),
  course: z.string().min(3, 'Course name must be at least 3 characters'),
  semester: z.string().min(1, 'Semester is required'),
  rollNumber: z.string().min(3, 'Roll number must be at least 3 characters'),
  department: z.string().min(1, 'Department is required'),
  startDate: z.string().transform((str) => new Date(str)),
  endDate: z.string().transform((str) => new Date(str)),
  address: z.string().min(10, 'Address must be at least 10 characters'),
  referredBy: z.string().min(1, 'Referred by is required'),
  referredByEmpId: z.string().min(1, 'Referrer employee ID is required'),
  documents: z.record(z.string()).optional(),
});

export const CreateApplicationSchema = z.object({
  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
});

export const UpdateApplicationSchema = z.object({
  status: z.enum(['SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
  reviewNotes: z.string().optional(),
});

export const CreateAssignmentSchema = z.object({
  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
  mentorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentor ID'),
  department: z.string().min(1, 'Department is required'),
});

export const CreateFeedbackSchema = z.object({
  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
  rating: z.number().min(1).max(10),
  communication: z.number().min(1).max(10),
  technical: z.number().min(1).max(10),
  teamwork: z.number().min(1).max(10),
  initiative: z.number().min(1).max(10),
  comments: z.string().min(10, 'Comments must be at least 10 characters'),
});

export const CreateTaskSchema = z.object({
  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  dueDate: z.string().transform((str) => new Date(str)),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export const CreateProjectSchema = z.object({
  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters').optional(),
});

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export const PasswordResetSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters'),
});

// File Upload Types
export interface FileUploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

export interface UploadedFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  buffer: Buffer;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  empId?: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Request Extensions
export interface AuthenticatedRequest extends Request {
  user?: Omit<User, 'password'>;
}

export type CreateInternInput = z.infer<typeof CreateInternSchema>;
export type CreateApplicationInput = z.infer<typeof CreateApplicationSchema>;
export type UpdateApplicationInput = z.infer<typeof UpdateApplicationSchema>;
export type CreateAssignmentInput = z.infer<typeof CreateAssignmentSchema>;
export type CreateFeedbackInput = z.infer<typeof CreateFeedbackSchema>;
export type CreateTaskInput = z.infer<typeof CreateTaskSchema>;
export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type PasswordResetInput = z.infer<typeof PasswordResetSchema>;