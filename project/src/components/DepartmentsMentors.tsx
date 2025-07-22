import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Edit3, Search, Plus, Trash2, Clock, User } from 'lucide-react';

interface Mentor {
  id: string;
  name: string;
  department: string;
  email: string;
  phone: string;
  availability: 'Available' | 'Busy' | 'Unavailable';
  experience: string;
  currentInterns: number;
  maxCapacity: number;
  internDurations: Array<{
    internName: string;
    startDate: string;
    endDate: string;
  }>;
}

interface InternApplication {
  id: string;
  internId: string;
  name: string;
  department: string;
  status: 'Approved';
}

const DepartmentsMentors: React.FC = () => {
  const [activeTab, setActiveTab] = useState('assign');
  const [mentors, setMentors] = useState<Mentor[]>([
    {
      id: '1',
      name: 'Dr. Rajesh Kumar',
      department: 'Engineering',
      email: 'rajesh.kumar@iocl.in',
      phone: '9876543210',
      availability: 'Available',
      experience: '15 years',
      currentInterns: 2,
      maxCapacity: 4,
      internDurations: [
        { internName: 'Rahul Sharma', startDate: '2025-01-15', endDate: '2025-03-15' },
        { internName: 'Neha Gupta', startDate: '2025-01-10', endDate: '2025-03-10' }
      ]
    },
    {
      id: '2',
      name: 'Ms. Priya Sharma',
      department: 'Human Resources',
      email: 'priya.sharma@iocl.in',
      phone: '9876543211',
      availability: 'Busy',
      experience: '12 years',
      currentInterns: 3,
      maxCapacity: 3,
      internDurations: [
        { internName: 'Amit Singh', startDate: '2025-01-05', endDate: '2025-03-05' },
        { internName: 'Kavya Patel', startDate: '2025-01-12', endDate: '2025-03-12' },
        { internName: 'Ravi Kumar', startDate: '2025-01-20', endDate: '2025-03-20' }
      ]
    },
    {
      id: '3',
      name: 'Mr. Amit Patel',
      department: 'Information Technology',
      email: 'amit.patel@iocl.in',
      phone: '9876543212',
      availability: 'Available',
      experience: '10 years',
      currentInterns: 1,
      maxCapacity: 5,
      internDurations: [
        { internName: 'Priya Patel', startDate: '2025-01-08', endDate: '2025-03-08' }
      ]
    },
    {
      id: '4',
      name: 'Dr. Sunita Verma',
      department: 'Engineering',
      email: 'sunita.verma@iocl.in',
      phone: '9876543213',
      availability: 'Available',
      experience: '18 years',
      currentInterns: 0,
      maxCapacity: 3,
      internDurations: []
    },
    {
      id: '5',
      name: 'Mr. Vikram Singh',
      department: 'Information Technology',
      email: 'vikram.singh@iocl.in',
      phone: '9876543214',
      availability: 'Available',
      experience: '8 years',
      currentInterns: 2,
      maxCapacity: 4,
      internDurations: [
        { internName: 'Ankit Sharma', startDate: '2025-01-01', endDate: '2025-03-01' },
        { internName: 'Pooja Gupta', startDate: '2025-01-15', endDate: '2025-03-15' }
      ]
    }
  ]);

  const [approvedInterns, setApprovedInterns] = useState<InternApplication[]>([
    {
      id: '1',
      internId: 'IOCL-123456',
      name: 'Rahul Sharma',
      department: 'Engineering',
      status: 'Approved'
    },
    {
      id: '2',
      internId: 'IOCL-123457',
      name: 'Priya Patel',
      department: 'Information Technology',
      status: 'Approved'
    },
    {
      id: '3',
      internId: 'IOCL-123458',
      name: 'Amit Singh',
      department: 'Human Resources',
      status: 'Approved'
    },
    {
      id: '4',
      internId: 'IOCL-123459',
      name: 'Neha Gupta',
      department: 'Engineering',
      status: 'Approved'
    }
  ]);

  const departments = [
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
  ];

  const [assignForm, setAssignForm] = useState({
    internId: '',
    department: '',
    mentor: '',
  });

  const [updateForm, setUpdateForm] = useState({
    name: '',
    department: '',
    email: '',
    phone: '',
    availability: 'Available' as const,
    experience: '',
    maxCapacity: 3,
  });

  const [searchTerm, setSearchTerm] = useState('');

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assignForm.internId && assignForm.department && assignForm.mentor) {
      // Update mentor's current intern count
      setMentors(prev => prev.map(mentor => {
        if (mentor.name === assignForm.mentor) {
          const selectedIntern = approvedInterns.find(intern => intern.internId === assignForm.internId);
          return {
            ...mentor,
            currentInterns: mentor.currentInterns + 1,
            internDurations: [
              ...mentor.internDurations,
              {
                internName: selectedIntern?.name || 'Unknown',
                startDate: '2025-01-20',
                endDate: '2025-03-20'
              }
            ]
          };
        }
        return mentor;
      }));

      alert(`Mentor assigned successfully!\nIntern: ${approvedInterns.find(i => i.internId === assignForm.internId)?.name}\nMentor: ${assignForm.mentor}`);
      setAssignForm({ internId: '', department: '', mentor: '' });
    }
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (updateForm.name && updateForm.department && updateForm.email) {
      const newMentor: Mentor = {
        id: Date.now().toString(),
        name: updateForm.name,
        department: updateForm.department,
        email: updateForm.email,
        phone: updateForm.phone,
        availability: updateForm.availability,
        experience: updateForm.experience,
        currentInterns: 0,
        maxCapacity: updateForm.maxCapacity,
        internDurations: [],
      };
      setMentors(prev => [...prev, newMentor]);
      setUpdateForm({
        name: '',
        department: '',
        email: '',
        phone: '',
        availability: 'Available',
        experience: '',
        maxCapacity: 3,
      });
      alert('Mentor added successfully!');
    }
  };

  const handleDeleteMentor = (id: string) => {
    if (window.confirm('Are you sure you want to delete this mentor?')) {
      setMentors(prev => prev.filter(mentor => mentor.id !== id));
    }
  };

  const getDepartmentMentors = (department: string) => {
    return mentors.filter(mentor => mentor.department === department);
  };

  const getAvailableInterns = (department: string) => {
    return approvedInterns.filter(intern => intern.department === department);
  };

  const filteredMentors = mentors.filter(mentor =>
    mentor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mentor.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-800';
      case 'Unavailable':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Departments & Mentors</h2>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('assign')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'assign'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <UserPlus className="h-4 w-4" />
            <span>Assign Mentors</span>
          </button>
          <button
            onClick={() => setActiveTab('update')}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
              activeTab === 'update'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            <span>Update Mentors</span>
          </button>
        </div>

        {/* Assign Mentors Tab */}
        {activeTab === 'assign' && (
          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Assign Mentors</h3>
              <p className="text-blue-700">
                Select an approved intern and assign them to an available mentor based on their department and workload.
              </p>
            </div>

            <form onSubmit={handleAssignSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Approved Intern <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={assignForm.internId}
                    onChange={(e) => {
                      const selectedIntern = approvedInterns.find(intern => intern.internId === e.target.value);
                      setAssignForm(prev => ({ 
                        ...prev, 
                        internId: e.target.value,
                        department: selectedIntern?.department || '',
                        mentor: ''
                      }));
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Intern</option>
                    {approvedInterns.map(intern => (
                      <option key={intern.id} value={intern.internId}>
                        {intern.name} ({intern.internId}) - {intern.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={assignForm.department}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
                    placeholder="Auto-filled based on intern selection"
                    disabled
                  />
                </div>
              </div>

              {assignForm.department && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-700 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Available Mentors in {assignForm.department} Department
                  </h4>
                  <div className="space-y-4">
                    {getDepartmentMentors(assignForm.department).map(mentor => (
                      <div 
                        key={mentor.id} 
                        className={`bg-white p-6 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          assignForm.mentor === mentor.name 
                            ? 'border-blue-500 bg-blue-50 shadow-md' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setAssignForm(prev => ({ ...prev, mentor: mentor.name }))}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h5 className="text-lg font-semibold text-gray-800 mb-1">{mentor.name}</h5>
                            <p className="text-sm text-gray-600 mb-2">{mentor.email}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span><strong>Experience:</strong> {mentor.experience}</span>
                              <span><strong>Phone:</strong> {mentor.phone}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end space-y-2">
                            <span className={`px-3 py-1 text-xs rounded-full ${getAvailabilityColor(mentor.availability)}`}>
                              {mentor.availability}
                            </span>
                            <span className={`px-3 py-1 text-xs rounded-full ${
                              mentor.currentInterns < mentor.maxCapacity 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {mentor.currentInterns}/{mentor.maxCapacity} Interns
                            </span>
                          </div>
                        </div>

                        {mentor.internDurations.length > 0 && (
                          <div className="border-t pt-4">
                            <h6 className="font-medium text-gray-700 mb-3 flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              Current Intern Assignments
                            </h6>
                            <div className="grid md:grid-cols-2 gap-3">
                              {mentor.internDurations.map((duration, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded-md">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <User className="h-4 w-4 text-gray-500" />
                                    <span className="font-medium text-gray-800">{duration.internName}</span>
                                  </div>
                                  <p className="text-xs text-gray-600">
                                    {duration.startDate} to {duration.endDate}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {mentor.currentInterns >= mentor.maxCapacity && (
                          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p className="text-sm text-red-700 font-medium">
                              ⚠️ This mentor has reached maximum capacity
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {getDepartmentMentors(assignForm.department).length === 0 && (
                    <div className="text-center py-8">
                      <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No mentors available in this department.</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!assignForm.mentor || mentors.find(m => m.name === assignForm.mentor)?.currentInterns >= mentors.find(m => m.name === assignForm.mentor)?.maxCapacity}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200 ${
                    assignForm.mentor && mentors.find(m => m.name === assignForm.mentor)?.currentInterns < mentors.find(m => m.name === assignForm.mentor)?.maxCapacity
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  }`}
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Assign Mentor</span>
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Update Mentors Tab */}
        {activeTab === 'update' && (
          <div className="space-y-6">
            <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Update Mentors</h3>
              <p className="text-orange-700">
                Add new mentors or update existing mentor information. To be filled by Department HOD.
              </p>
            </div>

            {/* Add New Mentor Form */}
            <form onSubmit={handleUpdateSubmit} className="bg-gray-50 rounded-lg p-6">
              <h4 className="text-lg font-semibold text-gray-700 mb-4">Add New Mentor</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={updateForm.name}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter mentor name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Department <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={updateForm.department}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={updateForm.email}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={updateForm.phone}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={updateForm.availability}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, availability: e.target.value as 'Available' | 'Busy' | 'Unavailable' }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Available">Available</option>
                    <option value="Busy">Busy</option>
                    <option value="Unavailable">Unavailable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience
                  </label>
                  <input
                    type="text"
                    value={updateForm.experience}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, experience: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 10 years"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Intern Capacity
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={updateForm.maxCapacity}
                    onChange={(e) => setUpdateForm(prev => ({ ...prev, maxCapacity: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., 3"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="submit"
                  className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Mentor</span>
                </button>
              </div>
            </form>

            {/* Existing Mentors List */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-gray-700">Current Mentors</h4>
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Search mentors..."
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-800 mb-1">{mentor.name}</h5>
                        <p className="text-sm text-gray-600 mb-2">{mentor.department}</p>
                        <p className="text-sm text-gray-600 mb-1">{mentor.email}</p>
                        <p className="text-sm text-gray-600">{mentor.phone}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteMentor(mentor.id)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Experience:</span>
                        <span className="text-sm font-medium">{mentor.experience}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Capacity:</span>
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          mentor.currentInterns < mentor.maxCapacity 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {mentor.currentInterns}/{mentor.maxCapacity}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Status:</span>
                        <span className={`text-sm px-2 py-1 rounded-full ${getAvailabilityColor(mentor.availability)}`}>
                          {mentor.availability}
                        </span>
                      </div>
                    </div>

                    {mentor.internDurations.length > 0 && (
                      <div className="border-t pt-4">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">Current Interns:</h6>
                        <div className="space-y-2">
                          {mentor.internDurations.map((duration, index) => (
                            <div key={index} className="bg-gray-50 p-2 rounded text-xs">
                              <p className="font-medium text-gray-800">{duration.internName}</p>
                              <p className="text-gray-600">{duration.startDate} to {duration.endDate}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {filteredMentors.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No mentors found matching your criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentsMentors;