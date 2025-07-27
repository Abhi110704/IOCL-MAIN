// Application Constants
export const APP_CONFIG = {
  name: 'IOCL Intern Onboarding Portal',
  version: '1.0.0',
  company: 'Indian Oil Corporation Limited',
  supportEmail: 'support@iocl.in',
  helplineNumbers: {
    tollFree: '1800-2333-555',
    lpgCommercial: '1860-5991-111',
    lpgEmergency: '1906',
  },
} as const;

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  LD_TEAM: 'ld_team',
  INTERN: 'intern',
  MENTOR: 'mentor',
} as const;

export const APPLICATION_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PENDING_REVIEW: 'Pending Review',
} as const;

export const TASK_STATUS = {
  PENDING: 'Pending',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
} as const;

export const PROJECT_STATUS = {
  SUBMITTED: 'Submitted',
  UNDER_REVIEW: 'Under Review',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
} as const;

export const PRIORITY_LEVELS = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
} as const;

export const DEPARTMENTS = [
  'Human Resources',
  'Information Technology',
  'Marketing',
  'Finance',
  'Operations',
  'Engineering',
  'Research & Development',
  'Quality Assurance',
  'Pipelines Division',
  'Refineries',
] as const;

export const MEETING_TYPES = {
  WEEKLY_REVIEW: 'Weekly Review',
  PROJECT_DISCUSSION: 'Project Discussion',
  FEEDBACK_SESSION: 'Feedback Session',
} as const;

export const AVAILABILITY_STATUS = {
  AVAILABLE: 'Available',
  BUSY: 'Busy',
  UNAVAILABLE: 'Unavailable',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/jpg', 'image/png'],
    DOCUMENTS: ['application/pdf'],
    ALL: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
  },
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY: '/auth/verify',
  },
  APPLICATIONS: {
    CREATE: '/applications',
    GET_ALL: '/applications',
    GET_BY_ID: '/applications/:id',
    UPDATE_STATUS: '/applications/:id/status',
    UPLOAD_DOCUMENT: '/applications/:id/documents',
  },
  MENTORS: {
    GET_ALL: '/mentors',
    CREATE: '/mentors',
    UPDATE: '/mentors/:id',
    DELETE: '/mentors/:id',
    ASSIGN: '/mentors/assign',
  },
  TASKS: {
    GET_ALL: '/tasks',
    CREATE: '/tasks',
    UPDATE: '/tasks/:id',
    DELETE: '/tasks/:id',
  },
  PROJECTS: {
    GET_ALL: '/projects',
    CREATE: '/projects',
    UPDATE_STATUS: '/projects/:id/status',
    UPLOAD: '/projects/:id/upload',
  },
  DOCUMENTS: {
    APPROVAL_LETTER: '/documents/approval-letter/:id',
    COMPLETION_CERTIFICATE: '/documents/completion-certificate/:id',
  },
} as const;

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'iocl_auth_token',
  USER_DATA: 'iocl_user_data',
  THEME: 'iocl_theme',
  LANGUAGE: 'iocl_language',
} as const;

export const DEMO_CREDENTIALS = {
  EMPLOYEES: [
    { empId: 'EMP001', password: 'password123', name: 'Rajesh Kumar' },
    { empId: 'EMP002', password: 'password123', name: 'Priya Sharma' },
    { empId: 'EMP003', password: 'password123', name: 'Amit Patel' },
  ],
  ADMINS: [
    { empId: 'IOCLAdmin', password: 'Adm1n@IOCL2025', name: 'Dr. Suresh Gupta' },
    { empId: 'L&DAdmin', password: 'admin123', name: 'Ms. Kavita Singh' },
    { empId: 'AdminLD', password: 'admin123', name: 'Mr. Vikram Mehta' },
  ],
  MENTORS: [
    { empId: 'MENTOR001', password: 'mentor123', name: 'Dr. Rajesh Kumar' },
    { empId: 'MENTOR002', password: 'mentor123', name: 'Ms. Priya Sharma' },
    { empId: 'MENTOR003', password: 'mentor123', name: 'Mr. Amit Patel' },
  ],
  INTERNS: [
    { empId: 'IOCL-123456', password: 'intern123', name: 'Rahul Sharma' },
    { empId: 'IOCL-123457', password: 'intern123', name: 'Priya Patel' },
    { empId: 'IOCL-123458', password: 'intern123', name: 'Amit Singh' },
  ],
} as const;