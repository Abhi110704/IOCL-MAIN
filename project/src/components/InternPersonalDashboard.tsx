import React, { useState } from 'react';
import { User, Calendar, CheckCircle, Clock, AlertCircle, Star, MessageCircle, FileText } from 'lucide-react';

interface Task {
  id: string;
  internId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High';
  assignedBy: string;
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

interface User {
  empId: string;
  role: 'employee' | 'ld_team' | 'intern' | 'mentor';
  name: string;
}

interface InternPersonalDashboardProps {
  user: User;
}

const InternPersonalDashboard: React.FC<InternPersonalDashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('tasks');

  // Mock data - filtered for the logged-in intern
  const tasks: Task[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      title: 'Pipeline Safety Analysis',
      description: 'Analyze safety protocols for oil pipeline systems and prepare initial report',
      dueDate: '2025-01-25',
      status: 'In Progress',
      priority: 'High',
      assignedBy: 'Dr. Rajesh Kumar'
    },
    {
      id: '2',
      internId: 'IOCL-123456',
      title: 'Technical Documentation',
      description: 'Create technical documentation for project methodology',
      dueDate: '2025-02-05',
      status: 'Pending',
      priority: 'Medium',
      assignedBy: 'Dr. Rajesh Kumar'
    },
    {
      id: '3',
      internId: 'IOCL-123456',
      title: 'Literature Review',
      description: 'Complete literature review on pipeline safety standards',
      dueDate: '2025-01-30',
      status: 'Completed',
      priority: 'Low',
      assignedBy: 'Dr. Rajesh Kumar'
    }
  ].filter(task => task.internId === user.empId);

  const reviews: Review[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      mentor: 'Dr. Rajesh Kumar',
      rating: 8,
      communication: 8,
      technical: 7,
      teamwork: 9,
      initiative: 8,
      comments: 'Shows excellent potential and good learning attitude. Keep up the good work on the pipeline safety analysis. Your approach to problem-solving is commendable.',
      date: '2025-01-18'
    }
  ].filter(review => review.internId === user.empId);

  const meetings: Meeting[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      mentor: 'Dr. Rajesh Kumar',
      title: 'Weekly Progress Review',
      date: '2025-01-22',
      time: '10:00',
      type: 'Weekly Review',
      status: 'Scheduled',
      agenda: 'Discuss progress on pipeline safety analysis and address any challenges'
    },
    {
      id: '2',
      internId: 'IOCL-123456',
      mentor: 'Dr. Rajesh Kumar',
      title: 'Project Methodology Discussion',
      date: '2025-01-15',
      time: '14:00',
      type: 'Project Discussion',
      status: 'Completed',
      agenda: 'Review project approach and finalize methodology'
    }
  ].filter(meeting => meeting.internId === user.empId);

  const tabs = [
    { id: 'tasks', label: 'My Tasks', icon: CheckCircle },
    { id: 'reviews', label: 'Mentor Reviews', icon: Star },
    { id: 'meetings', label: 'Meetings', icon: Calendar },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      case 'Pending':
        return 'bg-gray-100 text-gray-800';
      case 'Scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'Pending':
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
      case 'Scheduled':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <User className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">My Internship Dashboard</h2>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            Track your assigned tasks, view mentor feedback, and manage your meeting schedule. Stay organized and make the most of your internship experience.
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

        {/* Tasks Tab */}
        {activeTab === 'tasks' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Assigned Tasks</h3>
            <div className="space-y-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{task.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                          {getStatusIcon(task.status)}
                          <span>{task.status}</span>
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-3">{task.description}</p>
                      <div className="text-sm text-gray-500">
                        <p><strong>Assigned by:</strong> {task.assignedBy}</p>
                        <p><strong>Due Date:</strong> {task.dueDate}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Mentor Reviews & Feedback</h3>
            <div className="space-y-4">
              {reviews.map(review => (
                <div key={review.id} className="bg-white border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">Review from {review.mentor}</h4>
                      <p className="text-sm text-gray-600">{review.date}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-bold text-gray-700">{review.rating}/10</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{review.communication}</div>
                      <div className="text-sm text-gray-600">Communication</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{review.technical}</div>
                      <div className="text-sm text-gray-600">Technical Skills</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{review.teamwork}</div>
                      <div className="text-sm text-gray-600">Teamwork</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{review.initiative}</div>
                      <div className="text-sm text-gray-600">Initiative</div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-blue-800 mb-1">Mentor's Comments</h5>
                        <p className="text-blue-700">{review.comments}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meetings Tab */}
        {activeTab === 'meetings' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Meeting Schedule</h3>
            <div className="space-y-4">
              {meetings.map(meeting => (
                <div key={meeting.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="text-lg font-semibold text-gray-800">{meeting.title}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(meeting.status)}`}>
                          {getStatusIcon(meeting.status)}
                          <span>{meeting.status}</span>
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Mentor:</strong> {meeting.mentor}</p>
                        <p><strong>Date & Time:</strong> {meeting.date} at {meeting.time}</p>
                        <p><strong>Type:</strong> {meeting.type}</p>
                        {meeting.agenda && (
                          <p><strong>Agenda:</strong> {meeting.agenda}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InternPersonalDashboard;