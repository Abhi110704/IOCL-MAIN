// API Configuration and Utilities
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface User {
  id: string;
  empId?: string;
  role: 'ADMIN' | 'EMPLOYEE' | 'INTERN' | 'MENTOR';
  name: string;
  email?: string;
  department?: string;
  username: string;
  isFirstLogin: boolean;
}

export interface InternApplication {
  id: string;
  intern: {
    id: string;
    internId: string;
    name: string;
    email: string;
    phone: string;
    institute: string;
    course: string;
    semester: string;
    rollNumber: string;
    department: string;
    startDate: string;
    endDate: string;
    address: string;
    referredBy: string;
    referredByEmpId: string;
    documents: Record<string, string>;
  };
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  reviewer?: {
    name: string;
    empId: string;
  };
}

export interface Mentor {
  id: string;
  empId: string;
  name: string;
  department: string;
  email: string;
  phone?: string;
  availability: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  experience?: string;
  maxCapacity: number;
  currentInterns: number;
  internDurations: Array<{
    internName: string;
    internId: string;
    startDate: string;
    endDate: string;
  }>;
}

export interface Task {
  id: string;
  internId: string;
  internName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  assignedBy: string;
  createdAt: string;
}

export interface ProjectSubmission {
  id: string;
  internId: string;
  internName: string;
  department: string;
  projectTitle: string;
  description?: string;
  submissionDate: string;
  status: 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  fileUrl?: string;
  feedback?: string;
  grade?: string;
  mentorId?: string;
}

export interface Review {
  id: string;
  internId: string;
  mentor: string;
  rating: number;
  communication: number;
  technical: number;
  teamwork: number;
  initiative: number;
  comments: string;
  date: string;
}

export interface Meeting {
  id: string;
  internId: string;
  mentor: string;
  title: string;
  date: string;
  time: string;
  type: 'WEEKLY_REVIEW' | 'PROJECT_DISCUSSION' | 'FEEDBACK_SESSION';
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  agenda?: string;
}

// Get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Set auth token in localStorage
const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken');
};

// Remove auth token from localStorage
const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

// Generic API call function with authentication
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = getAuthToken();
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Authentication APIs
export const authAPI = {
  login: async (credentials: { username: string; password: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
    const response = await apiCall<{ token: string; user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    
    if (response.success && response.data) {
      setAuthToken(response.data.token);
    }
    
    return response;
  },

  logout: async (): Promise<ApiResponse<void>> => {
    const response = await apiCall<void>('/auth/logout', {
      method: 'POST',
    });
    
    removeAuthToken();
    return response;
  },

  verifyToken: async (): Promise<ApiResponse<User>> => {
    return await apiCall<User>('/auth/verify-token', {
      method: 'POST',
    });
  },

  resetPassword: async (data: { currentPassword: string; newPassword: string }): Promise<ApiResponse<void>> => {
    return await apiCall<void>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// Intern Management APIs
export const internAPI = {
  createApplication: async (applicationData: {
    name: string;
    email: string;
    phone: string;
    institute: string;
    course: string;
    semester: string;
    rollNumber: string;
    department: string;
    startDate: string;
    endDate: string;
    address: string;
    referredBy: string;
    referredByEmpId: string;
    documents?: Record<string, string>;
  }): Promise<ApiResponse<InternApplication>> => {
    return await apiCall<InternApplication>('/interns', {
      method: 'POST',
      body: JSON.stringify(applicationData),
    });
  },

  getApplications: async (filters?: { status?: string; department?: string }): Promise<ApiResponse<InternApplication[]>> => {
    const queryParams = new URLSearchParams();
    if (filters?.status && filters.status !== 'All') {
      queryParams.append('status', filters.status);
    }
    if (filters?.department) {
      queryParams.append('department', filters.department);
    }

    const endpoint = `/applications${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiCall<InternApplication[]>(endpoint);
  },

  getPendingApplications: async (): Promise<ApiResponse<InternApplication[]>> => {
    return await apiCall<InternApplication[]>('/applications/status/pending');
  },

  getApplicationById: async (id: string): Promise<ApiResponse<InternApplication>> => {
    return await apiCall<InternApplication>(`/applications/${id}`);
  },

  getApplicationByInternId: async (internId: string): Promise<ApiResponse<InternApplication>> => {
    return await apiCall<InternApplication>(`/applications/intern/${internId}`);
  },

  updateApplicationStatus: async (id: string, status: string, reviewNotes?: string): Promise<ApiResponse<InternApplication>> => {
    return await apiCall<InternApplication>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes }),
    });
  },

  uploadDocument: async (applicationId: string, documentType: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', documentType);
    formData.append('applicationId', applicationId);

    return await apiCall<{ url: string }>('/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type to let browser set it for FormData
    });
  },
};

// Mentor Management APIs
export const mentorAPI = {
  getMentors: async (department?: string): Promise<ApiResponse<Mentor[]>> => {
    const endpoint = department ? `/mentors?department=${department}` : '/mentors';
    return await apiCall<Mentor[]>(endpoint);
  },

  getAvailableMentors: async (department: string): Promise<ApiResponse<Mentor[]>> => {
    return await apiCall<Mentor[]>(`/mentors/available/${department}`);
  },

  createMentor: async (mentorData: {
    empId: string;
    name: string;
    department: string;
    email: string;
    phone?: string;
    experience?: string;
    maxCapacity?: number;
  }): Promise<ApiResponse<Mentor>> => {
    return await apiCall<Mentor>('/mentors', {
      method: 'POST',
      body: JSON.stringify(mentorData),
    });
  },

  updateMentor: async (id: string, mentorData: Partial<Mentor>): Promise<ApiResponse<Mentor>> => {
    return await apiCall<Mentor>(`/mentors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(mentorData),
    });
  },

  deleteMentor: async (id: string): Promise<ApiResponse<void>> => {
    return await apiCall<void>(`/mentors/${id}`, {
      method: 'DELETE',
    });
  },

  assignMentor: async (internId: string, mentorId: string, department: string): Promise<ApiResponse<void>> => {
    return await apiCall<void>('/mentors/assign', {
      method: 'POST',
      body: JSON.stringify({ internId, mentorId, department }),
    });
  },

  getMentorInterns: async (mentorId: string): Promise<ApiResponse<any[]>> => {
    return await apiCall<any[]>(`/mentors/${mentorId}/interns`);
  },
};

// Task Management APIs
export const taskAPI = {
  getTasks: async (internId?: string): Promise<ApiResponse<Task[]>> => {
    const endpoint = internId ? `/tasks?internId=${internId}` : '/tasks';
    return await apiCall<Task[]>(endpoint);
  },

  getTasksByMentor: async (mentorId: string): Promise<ApiResponse<Task[]>> => {
    return await apiCall<Task[]>(`/tasks?mentorId=${mentorId}`);
  },

  createTask: async (taskData: {
    internId: string;
    title: string;
    description: string;
    dueDate: string;
    priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  }): Promise<ApiResponse<Task>> => {
    return await apiCall<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  updateTaskStatus: async (id: string, status: string): Promise<ApiResponse<Task>> => {
    return await apiCall<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  },

  deleteTask: async (id: string): Promise<ApiResponse<void>> => {
    return await apiCall<void>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Project Submission APIs
export const projectAPI = {
  getSubmissions: async (internId?: string): Promise<ApiResponse<ProjectSubmission[]>> => {
    const endpoint = internId ? `/projects?internId=${internId}` : '/projects';
    return await apiCall<ProjectSubmission[]>(endpoint);
  },

  getSubmissionsByMentor: async (mentorId: string): Promise<ApiResponse<ProjectSubmission[]>> => {
    return await apiCall<ProjectSubmission[]>(`/projects?mentorId=${mentorId}`);
  },

  createSubmission: async (submissionData: {
    internId: string;
    title: string;
    description?: string;
  }): Promise<ApiResponse<ProjectSubmission>> => {
    return await apiCall<ProjectSubmission>('/projects', {
      method: 'POST',
      body: JSON.stringify(submissionData),
    });
  },

  uploadProjectFile: async (submissionId: string, file: File): Promise<ApiResponse<{ url: string }>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('submissionId', submissionId);

    return await apiCall<{ url: string }>('/projects/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // Remove Content-Type for FormData
    });
  },

  updateSubmissionStatus: async (id: string, status: string, feedback?: string, grade?: string): Promise<ApiResponse<ProjectSubmission>> => {
    return await apiCall<ProjectSubmission>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, feedback, grade }),
    });
  },
};

// Feedback APIs
export const feedbackAPI = {
  createFeedback: async (feedbackData: {
    internId: string;
    rating: number;
    communication: number;
    technical: number;
    teamwork: number;
    initiative: number;
    comments: string;
  }): Promise<ApiResponse<Review>> => {
    return await apiCall<Review>('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData),
    });
  },

  getFeedback: async (internId?: string): Promise<ApiResponse<Review[]>> => {
    const endpoint = internId ? `/feedback?internId=${internId}` : '/feedback';
    return await apiCall<Review[]>(endpoint);
  },
};

// Meeting APIs
export const meetingAPI = {
  createMeeting: async (meetingData: {
    internId: string;
    title: string;
    date: string;
    time: string;
    type: 'WEEKLY_REVIEW' | 'PROJECT_DISCUSSION' | 'FEEDBACK_SESSION';
    agenda?: string;
  }): Promise<ApiResponse<Meeting>> => {
    return await apiCall<Meeting>('/meetings', {
      method: 'POST',
      body: JSON.stringify(meetingData),
    });
  },

  getMeetings: async (internId?: string): Promise<ApiResponse<Meeting[]>> => {
    const endpoint = internId ? `/meetings?internId=${internId}` : '/meetings';
    return await apiCall<Meeting[]>(endpoint);
  },

  updateMeetingStatus: async (id: string, status: string, notes?: string): Promise<ApiResponse<Meeting>> => {
    return await apiCall<Meeting>(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ status, notes }),
    });
  },
};

// Document Generation APIs
export const documentAPI = {
  generateApprovalLetter: async (applicationId: string): Promise<ApiResponse<{ documentUrl: string }>> => {
    return await apiCall<{ documentUrl: string }>(`/certificates/approval-letter/${applicationId}`);
  },

  generateCompletionCertificate: async (submissionId: string): Promise<ApiResponse<{ documentUrl: string }>> => {
    return await apiCall<{ documentUrl: string }>(`/certificates/completion-certificate/${submissionId}`);
  },
};

// Utility functions
export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-IN');
};

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-IN');
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'SUBMITTED': 'bg-blue-100 text-blue-800',
    'UNDER_REVIEW': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'PENDING': 'bg-gray-100 text-gray-800',
    'IN_PROGRESS': 'bg-orange-100 text-orange-800',
    'COMPLETED': 'bg-green-100 text-green-800',
    'AVAILABLE': 'bg-green-100 text-green-800',
    'BUSY': 'bg-yellow-100 text-yellow-800',
    'UNAVAILABLE': 'bg-red-100 text-red-800',
    'SCHEDULED': 'bg-blue-100 text-blue-800',
    'CANCELLED': 'bg-red-100 text-red-800',
  };
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};

export const getPriorityColor = (priority: string): string => {
  const priorityColors: Record<string, string> = {
    'HIGH': 'bg-red-100 text-red-800',
    'MEDIUM': 'bg-yellow-100 text-yellow-800',
    'LOW': 'bg-green-100 text-green-800',
  };
  return priorityColors[priority] || 'bg-gray-100 text-gray-800';
};

// WebSocket connection for real-time updates
let socket: any = null;

export const initializeWebSocket = () => {
  if (typeof window !== 'undefined' && !socket) {
    const socketUrl = API_BASE_URL.replace('/api', '');
    // Dynamic import for socket.io-client
    import('socket.io-client').then(({ io }) => {
      socket = io(socketUrl, {
        auth: {
          token: getAuthToken(),
        },
      });

      socket.on('connect', () => {
        console.log('Connected to WebSocket');
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from WebSocket');
      });

      socket.on('APPLICATION_STATUS', (data: any) => {
        // Emit custom event for components to listen
        window.dispatchEvent(new CustomEvent('applicationStatusUpdate', { detail: data }));
      });

      socket.on('PROJECT_STATUS', (data: any) => {
        window.dispatchEvent(new CustomEvent('projectStatusUpdate', { detail: data }));
      });

      socket.on('TASK_STATUS', (data: any) => {
        window.dispatchEvent(new CustomEvent('taskStatusUpdate', { detail: data }));
      });
    });
  }
};

export const disconnectWebSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};