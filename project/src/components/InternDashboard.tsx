import React, { useState } from 'react';
import { BarChart3, Users, ClipboardList, MessageCircle, Calendar, Star, Plus, Edit } from 'lucide-react';

interface Intern {
  id: string;
  name: string;
  department: string;
  mentor: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Completed' | 'On Hold';
  progress: number;
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
}

interface FeedbackEntry {
  id: string;
  internId: string;
  internName: string;
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
  internName: string;
  mentor: string;
  title: string;
  date: string;
  time: string;
  type: 'Weekly Review' | 'Project Discussion' | 'Feedback Session';
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}

const InternDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedIntern, setSelectedIntern] = useState('');
  const [showTaskForm, setShowTaskForm] = useState(false);
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
  });

  const interns: Intern[] = [
    {
      id: '1',
      name: 'Rahul Sharma',
      department: 'Engineering',
      mentor: 'Dr. Rajesh Kumar',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      status: 'Active',
      progress: 65,
    },
    {
      id: '2',
      name: 'Priya Patel',
      department: 'Information Technology',
      mentor: 'Mr. Amit Patel',
      startDate: '2025-01-10',
      endDate: '2025-03-10',
      status: 'Active',
      progress: 45,
    },
    {
      id: '3',
      name: 'Amit Singh',
      department: 'Human Resources',
      mentor: 'Ms. Priya Sharma',
      startDate: '2024-12-01',
      endDate: '2025-02-01',
      status: 'Completed',
      progress: 100,
    },
  ];

  const tasks: Task[] = [
    {
      id: '1',
      internId: '1',
      internName: 'Rahul Sharma',
      title: 'Pipeline Safety Analysis',
      description: 'Analyze safety protocols for oil pipeline systems',
      dueDate: '2025-01-25',
      status: 'In Progress',
      priority: 'High',
    },
    {
      id: '2',
      internId: '2',
      internName: 'Priya Patel',
      title: 'Database Optimization',
      description: 'Optimize database queries for better performance',
      dueDate: '2025-01-28',
      status: 'Pending',
      priority: 'Medium',
    },
    {
      id: '3',
      internId: '1',
      internName: 'Rahul Sharma',
      title: 'Technical Documentation',
      description: 'Create technical documentation for project',
      dueDate: '2025-02-05',
      status: 'Pending',
      priority: 'Low',
    },
  ];

  const feedbackEntries: FeedbackEntry[] = [
    {
      id: '1',
      internId: '1',
      internName: 'Rahul Sharma',
      mentor: 'Dr. Rajesh Kumar',
      rating: 8,
      communication: 8,
      technical: 7,
      teamwork: 9,
      initiative: 8,
      comments: 'Shows excellent potential and good learning attitude.',
      date: '2025-01-18',
    },
    {
      id: '2',
      internId: '2',
      internName: 'Priya Patel',
      mentor: 'Mr. Amit Patel',
      rating: 7,
      communication: 7,
      technical: 8,
      teamwork: 6,
      initiative: 7,
      comments: 'Good technical skills, needs improvement in communication.',
      date: '2025-01-17',
    },
  ];

  const meetings: Meeting[] = [
    {
      id: '1',
      internId: '1',
      internName: 'Rahul Sharma',
      mentor: 'Dr. Rajesh Kumar',
      title: 'Weekly Progress Review',
      date: '2025-01-22',
      time: '10:00',
      type: 'Weekly Review',
      status: 'Scheduled',
    },
    {
      id: '2',
      internId: '2',
      internName: 'Priya Patel',
      mentor: 'Mr. Amit Patel',
      title: 'Project Discussion',
      date: '2025-01-23',
      time: '14:00',
      type: 'Project Discussion',
      status: 'Scheduled',
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Intern Overview', icon: Users },
    { id: 'tasks', label: 'Assigned Tasks', icon: ClipboardList },
    { id: 'feedback', label: 'Feedback', icon: MessageCircle },
    { id: 'meetings', label: 'Upcoming Meetings', icon: Calendar },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
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
      });
    }
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskForm.internId && taskForm.title && taskForm.description && taskForm.dueDate) {
      alert('Task assigned successfully!');
      setTaskForm({
        internId: '',
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
      });
      setShowTaskForm(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Intern Dashboard</h2>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
          <p className="text-orange-700">
            <strong>Access Restriction:</strong> This tab is accessible only to Mentors and L&D team members.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Current Interns Overview</h3>
            <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {interns.map(intern => (
                <div key={intern.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold text-gray-800">{intern.name}</h4>
                      <p className="text-sm text-gray-600">{intern.department}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(intern.status)}`}>
                      {intern.status}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <p><strong>Mentor:</strong> {intern.mentor}</p>
                    <p><strong>Duration:</strong> {intern.startDate} to {intern.endDate}</p>
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
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-700">Assigned Tasks</h3>
              <button 
                onClick={() => setShowTaskForm(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                <Plus className="h-4 w-4" />
                <span>Add Task</span>
              </button>
            </div>
            
            {/* Add Task Form */}
            {showTaskForm && (
              <form onSubmit={handleTaskSubmit} className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Add New Task</h4>
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
                      {interns.filter(intern => intern.status === 'Active').map(intern => (
                        <option key={intern.id} value={intern.id}>{intern.name}</option>
                      ))}
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
                </div>

                <div className="mt-4">
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

                <div className="flex justify-end space-x-3 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                    <span>Add Task</span>
                  </button>
                </div>
              </form>
            )}
            
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-semibold text-gray-800">{task.title}</h4>
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
                    <div className="flex items-center space-x-2">
                      <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200">
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Feedback Management</h3>
            
            {/* Feedback Form */}
            <form onSubmit={handleFeedbackSubmit} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Provide Feedback</h4>
              <div className="grid md:grid-cols-2 gap-4">
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
                    {interns.filter(intern => intern.status === 'Active').map(intern => (
                      <option key={intern.id} value={intern.id}>{intern.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
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

              <div className="mt-4">
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

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Star className="h-4 w-4" />
                  <span>Submit Feedback</span>
                </button>
              </div>
            </form>

            {/* Previous Feedback */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Previous Feedback</h4>
              <div className="space-y-4">
                {feedbackEntries.map(feedback => (
                  <div key={feedback.id} className="bg-white border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h5 className="font-semibold text-gray-800">{feedback.internName}</h5>
                        <p className="text-sm text-gray-600">By {feedback.mentor} • {feedback.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium text-gray-700">{feedback.rating}/10</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                      <div>
                        <span className="text-gray-600">Communication:</span>
                        <span className="ml-2 font-medium">{feedback.communication}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Technical:</span>
                        <span className="ml-2 font-medium">{feedback.technical}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teamwork:</span>
                        <span className="ml-2 font-medium">{feedback.teamwork}/10</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Initiative:</span>
                        <span className="ml-2 font-medium">{feedback.initiative}/10</span>
                      </div>
                    </div>
                    <p className="text-gray-700 bg-gray-50 p-3 rounded-md">{feedback.comments}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Meeting Management</h3>
            
            {/* Schedule Meeting Form */}
            <form onSubmit={handleMeetingSubmit} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Schedule Meeting</h4>
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
                    {interns.filter(intern => intern.status === 'Active').map(intern => (
                      <option key={intern.id} value={intern.id}>{intern.name}</option>
                    ))}
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
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Schedule Meeting</span>
                </button>
              </div>
            </form>

            {/* Upcoming Meetings */}
            <div>
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Upcoming Meetings</h4>
              <div className="space-y-4">
                {meetings.map(meeting => (
                  <div key={meeting.id} className="bg-white border rounded-lg p-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h5 className="font-semibold text-gray-800">{meeting.title}</h5>
                          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(meeting.status)}`}>
                            {meeting.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p><strong>Intern:</strong> {meeting.internName}</p>
                          <p><strong>Mentor:</strong> {meeting.mentor}</p>
                          <p><strong>Date & Time:</strong> {meeting.date} at {meeting.time}</p>
                          <p><strong>Type:</strong> {meeting.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-1 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200">
                          <Edit className="h-4 w-4" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternDashboard;