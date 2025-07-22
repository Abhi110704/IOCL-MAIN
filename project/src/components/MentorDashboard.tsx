import React, { useState } from 'react';
import { Users, FileText, Plus, Edit, Star, Calendar, CheckCircle, Clock, AlertCircle, Search, MessageCircle, Eye, Download } from 'lucide-react';

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

interface MentorDashboardProps {
  user: User;
  activeTab: 'dashboard' | 'projects';
}

interface Intern {
  id: string;
  internId: string;
  name: string;
  department: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed';
  progress: number;
  email: string;
  phone: string;
}

interface Task {
  id: string;
  internId: string;
  internName: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignedBy: string;
}

interface ProjectSubmission {
  id: string;
  internId: string;
  internName: string;
  department: string;
  projectTitle: string;
  description?: string;
  submissionDate: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  fileUrl?: string;
  feedback?: string;
  grade?: string;
}

interface Review {
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

interface Meeting {
  id: string;
  internId: string;
  mentor: string;
  title: string;
  date: string;
  time: string;
  type: 'Weekly Review' | 'Project Discussion' | 'Feedback Session';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
  agenda?: string;
}

const MentorDashboard: React.FC<MentorDashboardProps> = ({ user, activeTab }) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectSubmission | null>(null);
  const [selectedIntern, setSelectedIntern] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - interns assigned to this mentor
  const myInterns: Intern[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      name: 'Rahul Sharma',
      department: 'Engineering',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      status: 'Active',
      progress: 65,
      email: 'rahul.sharma@college.edu',
      phone: '9876543210'
    },
    {
      id: '2',
      internId: 'IOCL-123459',
      name: 'Neha Gupta',
      department: 'Engineering',
      startDate: '2025-01-10',
      endDate: '2025-03-10',
      status: 'Active',
      progress: 45,
      email: 'neha.gupta@college.edu',
      phone: '9876543213'
    }
  ];

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      internId: 'IOCL-123456',
      internName: 'Rahul Sharma',
      title: 'Pipeline Safety Analysis',
      description: 'Analyze safety protocols for oil pipeline systems',
      dueDate: '2025-01-25',
      status: 'In Progress',
      priority: 'High',
      assignedBy: user.name
    }
  ]);

  const [projectSubmissions, setProjectSubmissions] = useState<ProjectSubmission[]>([
    {
      id: '1',
      internId: 'IOCL-123456',
      internName: 'Rahul Sharma',
      department: 'Engineering',
      projectTitle: 'Pipeline Safety Analysis System',
      description: 'Comprehensive analysis of pipeline safety protocols with recommendations for improvement',
      submissionDate: '2025-01-18',
      status: 'Submitted',
      fileUrl: '/reports/pipeline-safety-analysis.pdf'
    },
    {
      id: '2',
      internId: 'IOCL-123459',
      internName: 'Neha Gupta',
      department: 'Engineering',
      projectTitle: 'Environmental Impact Assessment',
      description: 'Assessment of environmental impact of refinery operations',
      submissionDate: '2025-01-19',
      status: 'Submitted',
      fileUrl: '/reports/environmental-impact.pdf'
    }
  ]);

  const [taskForm, setTaskForm] = useState({
    internId: '',
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium' as const,
  });

  const [feedbackForm, setFeedbackForm] = useState({
    internId: '',
    communication: 5,
    technical: 5,
    teamwork: 5,
    initiative: 5,
    comments: '',
  });

  const [meetingForm, setMeetingForm] = useState({
    internId: '',
    title: '',
    date: '',
    time: '',
    type: 'Weekly Review' as const,
    agenda: '',
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskForm.internId && taskForm.title && taskForm.description && taskForm.dueDate) {
      const internName = myInterns.find(intern => intern.internId === taskForm.internId)?.name || '';
      const newTask: Task = {
        id: Date.now().toString(),
        internId: taskForm.internId,
        internName,
        title: taskForm.title,
        description: taskForm.description,
        dueDate: taskForm.dueDate,
        status: 'Pending',
        priority: taskForm.priority,
        assignedBy: user.name
      };
      setTasks(prev => [...prev, newTask]);
      setTaskForm({
        internId: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      });
      setShowTaskForm(false);
      alert('Task assigned successfully!');
    }
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (feedbackForm.internId && feedbackForm.comments) {
      alert('Feedback submitted successfully!');
      setFeedbackForm({
        internId: '',
        communication: 5,
        technical: 5,
        teamwork: 5,
        initiative: 5,
        comments: '',
      });
      setShowFeedbackForm(false);
    }
  };

  const handleMeetingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (meetingForm.internId && meetingForm.title && meetingForm.date && meetingForm.time) {
      alert('Meeting scheduled successfully!');
      setMeetingForm({
        internId: '',
        title: '',
        date: '',
        time: '',
        type: 'Weekly Review',
        agenda: '',
      });
      setShowMeetingForm(false);
    }
  };

  const handleProjectStatusUpdate = (projectId: string, status: 'Approved' | 'Rejected', feedback?: string, grade?: string) => {
    setProjectSubmissions(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, status, feedback, grade }
        : project
    ));
    setShowProjectModal(false);
    setSelectedProject(null);
    alert(`Project ${status.toLowerCase()} successfully!`);
  };

  const handleViewProject = (project: ProjectSubmission) => {
    setSelectedProject(project);
    setShowProjectModal(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Submitted':
        return 'bg-blue-100 text-blue-800';
      case 'Under Review':
        return 'bg-yellow-100 text-yellow-800';
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSubmissions = projectSubmissions.filter(submission =>
    submission.internName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    submission.projectTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Mentor Dashboard</h2>
        </div>

        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg mb-6">
          <p className="text-green-700">
            Welcome, {user.name}! Manage your assigned interns, track their progress, and review their project submissions.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentTab === 'dashboard'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Users className="h-4 w-4" />
            <span>Intern Dashboard</span>
          </button>
          <button
            onClick={() => setCurrentTab('projects')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              currentTab === 'projects'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <FileText className="h-4 w-4" />
            <span>Submitted Projects</span>
          </button>
        </div>

        {/* Intern Dashboard Tab */}
        {currentTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">My Interns</h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowTaskForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Assign Task</span>
                </button>
                <button 
                  onClick={() => setShowFeedbackForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                >
                  <Star className="h-4 w-4" />
                  <span>Give Feedback</span>
                </button>
                <button 
                  onClick={() => setShowMeetingForm(true)}
                  className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </button>
              </div>
            </div>

            {/* Interns List */}
            <div className="grid lg:grid-cols-2 gap-6">
              {myInterns.map(intern => (
                <div key={intern.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{intern.name}</h4>
                      <p className="text-sm text-gray-600">{intern.internId}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(intern.status)}`}>
                      {intern.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Department:</strong> {intern.department}</p>
                    <p><strong>Duration:</strong> {intern.startDate} to {intern.endDate}</p>
                    <p><strong>Email:</strong> {intern.email}</p>
                    <p><strong>Phone:</strong> {intern.phone}</p>
                    <div>
                      <p><strong>Progress:</strong> {intern.progress}%</p>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${intern.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Assigned Tasks */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Assigned Tasks</h4>
              <div className="space-y-4">
                {tasks.map(task => (
                  <div key={task.id} className="bg-white border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-semibold text-gray-800">{task.title}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                            {task.status}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-2">{task.description}</p>
                        <div className="text-sm text-gray-500">
                          <p><strong>Assigned to:</strong> {task.internName}</p>
                          <p><strong>Due Date:</strong> {task.dueDate}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Task Assignment Form Modal */}
            {showTaskForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Assign New Task</h3>
                    <form onSubmit={handleTaskSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Intern <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={taskForm.internId}
                            onChange={(e) => setTaskForm(prev => ({ ...prev, internId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Intern</option>
                            {myInterns.filter(intern => intern.status === 'Active').map(intern => (
                              <option key={intern.id} value={intern.internId}>{intern.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Priority
                          </label>
                          <select
                            value={taskForm.priority}
                            onChange={(e) => setTaskForm(prev => ({ ...prev, priority: e.target.value as 'Low' | 'Medium' | 'High' }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Task Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={taskForm.title}
                            onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter task title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Due Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={taskForm.dueDate}
                            onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Task Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={taskForm.description}
                          onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter task description"
                          required
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                        >
                          Assign Task
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Form Modal */}
            {showFeedbackForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Provide Feedback</h3>
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Intern <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={feedbackForm.internId}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, internId: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select Intern</option>
                          {myInterns.filter(intern => intern.status === 'Active').map(intern => (
                            <option key={intern.id} value={intern.internId}>{intern.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-4">Rating Scale (1-10)</h5>
                        <div className="grid md:grid-cols-2 gap-4">
                          {['communication', 'technical', 'teamwork', 'initiative'].map(skill => (
                            <div key={skill}>
                              <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                                {skill}
                              </label>
                              <div className="flex items-center space-x-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="10"
                                  value={feedbackForm[skill as keyof typeof feedbackForm] as number}
                                  onChange={(e) => setFeedbackForm(prev => ({ 
                                    ...prev, 
                                    [skill]: parseInt(e.target.value) 
                                  }))}
                                  className="flex-1"
                                />
                                <span className="w-8 text-center text-sm font-medium text-gray-600">
                                  {feedbackForm[skill as keyof typeof feedbackForm]}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Comments <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={feedbackForm.comments}
                          onChange={(e) => setFeedbackForm(prev => ({ ...prev, comments: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Provide detailed feedback..."
                          required
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowFeedbackForm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                        >
                          Submit Feedback
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {/* Meeting Form Modal */}
            {showMeetingForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg max-w-2xl w-full">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Schedule Meeting</h3>
                    <form onSubmit={handleMeetingSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Intern <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={meetingForm.internId}
                            onChange={(e) => setMeetingForm(prev => ({ ...prev, internId: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          >
                            <option value="">Select Intern</option>
                            {myInterns.filter(intern => intern.status === 'Active').map(intern => (
                              <option key={intern.id} value={intern.internId}>{intern.name}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Type
                          </label>
                          <select
                            value={meetingForm.type}
                            onChange={(e) => setMeetingForm(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="Weekly Review">Weekly Review</option>
                            <option value="Project Discussion">Project Discussion</option>
                            <option value="Feedback Session">Feedback Session</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Meeting Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={meetingForm.title}
                            onChange={(e) => setMeetingForm(prev => ({ ...prev, title: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Meeting title"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={meetingForm.date}
                            onChange={(e) => setMeetingForm(prev => ({ ...prev, date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Time <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="time"
                            value={meetingForm.time}
                            onChange={(e) => setMeetingForm(prev => ({ ...prev, time: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Agenda
                        </label>
                        <textarea
                          value={meetingForm.agenda}
                          onChange={(e) => setMeetingForm(prev => ({ ...prev, agenda: e.target.value }))}
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Meeting agenda (optional)"
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => setShowMeetingForm(false)}
                          className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors duration-200"
                        >
                          Schedule Meeting
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Project Submissions Tab */}
        {currentTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Project Submissions</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search submissions..."
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredSubmissions.map(submission => (
                <div key={submission.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{submission.projectTitle}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(submission.status)}`}>
                          {submission.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <p><strong>Intern:</strong> {submission.internName}</p>
                          <p><strong>ID:</strong> {submission.internId}</p>
                          <p><strong>Department:</strong> {submission.department}</p>
                        </div>
                        <div>
                          <p><strong>Submitted:</strong> {submission.submissionDate}</p>
                          {submission.grade && (
                            <p><strong>Grade:</strong> {submission.grade}</p>
                          )}
                        </div>
                      </div>
                      {submission.description && (
                        <p className="text-gray-600 mt-2">{submission.description}</p>
                      )}
                      {submission.feedback && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-md">
                          <p className="text-sm text-blue-800">
                            <strong>Feedback:</strong> {submission.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleViewProject(submission)}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Project</span>
                      </button>
                      {submission.status === 'Submitted' && (
                        <>
                          <button
                            onClick={() => handleProjectStatusUpdate(submission.id, 'Rejected', 'Project needs improvement. Please revise and resubmit.')}
                            className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                          >
                            <AlertCircle className="h-4 w-4" />
                            <span>Reject</span>
                          </button>
                          <button
                            onClick={() => handleProjectStatusUpdate(submission.id, 'Approved', 'Excellent work! Well-structured and comprehensive analysis.', 'A+')}
                            className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>Approve</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredSubmissions.length === 0 && (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No project submissions found.</p>
              </div>
            )}
          </div>
        )}

        {/* Project View Modal */}
        {showProjectModal && selectedProject && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Project Details</h3>
                  <button
                    onClick={() => setShowProjectModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <AlertCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4">Project Information</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Title:</strong> {selectedProject.projectTitle}</p>
                        <p><strong>Intern:</strong> {selectedProject.internName}</p>
                        <p><strong>ID:</strong> {selectedProject.internId}</p>
                      </div>
                      <div>
                        <p><strong>Department:</strong> {selectedProject.department}</p>
                        <p><strong>Submitted:</strong> {selectedProject.submissionDate}</p>
                        <p><strong>Status:</strong> {selectedProject.status}</p>
                      </div>
                    </div>
                    {selectedProject.description && (
                      <div className="mt-4">
                        <p><strong>Description:</strong></p>
                        <p className="text-gray-700 mt-1">{selectedProject.description}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Project File</h4>
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-800">Project Report</p>
                        <p className="text-sm text-gray-600">{selectedProject.fileUrl}</p>
                      </div>
                      <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </button>
                    </div>
                  </div>

                  {selectedProject.status === 'Submitted' && (
                    <div className="flex justify-end space-x-4 pt-4 border-t">
                      <button
                        onClick={() => handleProjectStatusUpdate(selectedProject.id, 'Rejected', 'Project needs improvement. Please revise and resubmit.')}
                        className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>Reject Project</span>
                      </button>
                      <button
                        onClick={() => handleProjectStatusUpdate(selectedProject.id, 'Approved', 'Excellent work! Well-structured and comprehensive analysis.', 'A+')}
                        className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve Project</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MentorDashboard;