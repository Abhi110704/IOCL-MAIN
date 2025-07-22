@@ .. @@
 import { z } from 'zod';
+import { Types } from 'mongoose';

 // Database Types (matching Mongoose schema)
 export interface User {
-  id: string;
+  _id: string;
   username: string;
   password: string;
   role: 'ADMIN' | 'EMPLOYEE' | 'INTERN' | 'MENTOR';
@@ .. @@
 }

 export interface Intern {
-  id: string;
+  _id: string;
   internId: string;
   name: string;
@@ .. @@
 }

 export interface Mentor {
-  id: string;
+  _id: string;
   empId: string;
   name: string;
@@ .. @@
 }

 export interface Assignment {
-  id: string;
-  internId: string;
-  mentorId: string;
+  _id: string;
+  internId: Types.ObjectId;
+  mentorId: Types.ObjectId;
   department: string;
@@ .. @@
 }

 export interface Application {
-  id: string;
-  internId: string;
+  _id: string;
+  internId: Types.ObjectId;
   status: ApplicationStatus;
-  reviewedBy?: string;
+  reviewedBy?: Types.ObjectId;
@@ .. @@
 }

 export interface Feedback {
-  id: string;
-  internId: string;
-  mentorId: string;
+  _id: string;
+  internId: Types.ObjectId;
+  mentorId: Types.ObjectId;
   rating: number;
@@ .. @@
 }

 export interface Task {
-  id: string;
-  internId: string;
-  mentorId: string;
+  _id: string;
+  internId: Types.ObjectId;
+  mentorId: Types.ObjectId;
   title: string;
@@ .. @@
 }

 export interface Project {
-  id: string;
-  internId: string;
-  mentorId: string;
+  _id: string;
+  internId: Types.ObjectId;
+  mentorId: Types.ObjectId;
   title: string;
@@ .. @@
 }

 export interface Meeting {
-  id: string;
-  internId: string;
-  mentorId: string;
+  _id: string;
+  internId: Types.ObjectId;
+  mentorId: Types.ObjectId;
   title: string;
@@ .. @@
 // Validation Schemas using Zod
 export const CreateInternSchema = z.object({
   name: z.string().min(2, 'Name must be at least 2 characters'),
@@ .. @@
 });

 export const CreateApplicationSchema = z.object({
-  internId: z.string().cuid('Invalid intern ID'),
+  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
 });

 export const UpdateApplicationSchema = z.object({
@@ .. @@
 });

 export const CreateAssignmentSchema = z.object({
-  internId: z.string().cuid('Invalid intern ID'),
-  mentorId: z.string().cuid('Invalid mentor ID'),
+  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
+  mentorId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid mentor ID'),
   department: z.string().min(1, 'Department is required'),
 });

 export const CreateFeedbackSchema = z.object({
-  internId: z.string().cuid('Invalid intern ID'),
+  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
   rating: z.number().min(1).max(10),
@@ .. @@
 });

 export const CreateTaskSchema = z.object({
-  internId: z.string().cuid('Invalid intern ID'),
+  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
   title: z.string().min(3, 'Title must be at least 3 characters'),
@@ .. @@
 });

 export const CreateProjectSchema = z.object({
-  internId: z.string().cuid('Invalid intern ID'),
+  internId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid intern ID'),
   title: z.string().min(5, 'Title must be at least 5 characters'),