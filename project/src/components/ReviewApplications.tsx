import React, { useState } from 'react';
import { ClipboardList, Search, Eye, CheckCircle, XCircle, User, Mail, Phone, Calendar, MapPin, GraduationCap, Building } from 'lucide-react';

interface Application {
  id: string;
  internId: string;
  name: string;
  email: string;
  phone: string;
  collegeName: string;
  course: string;
  semester: string;
  rollNumber: string;
  department: string;
  startDate: string;
  endDate: string;
  address: string;
  referredBy: string;
  referredByEmpId: string;
  submittedDate: string;
  documents: {
    photo?: string;
    resume?: string;
    collegeId?: string;
    lastSemesterResult?: string;
    noc?: string;
    idProof?: string;
    otherDocument?: string;
  };
}

const ReviewApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      internId: 'IOCL-123456',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@college.edu',
      phone: '9876543210',
      collegeName: 'IIT Delhi',
      course: 'B.Tech Computer Science',
      semester: '6th',
      rollNumber: 'CS2021001',
      department: 'Engineering',
      startDate: '2025-01-15',
      endDate: '2025-03-15',
      address: 'New Delhi',
      referredBy: 'Rajesh Kumar',
      referredByEmpId: 'EMP001',
      submittedDate: '2025-01-15',
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        noc: 'noc.pdf',
        idProof: 'aadhar.pdf'
      }
    },
    {
      id: '2',
      internId: 'IOCL-123457',
      name: 'Priya Patel',
      email: 'priya.patel@college.edu',
      phone: '9876543211',
      collegeName: 'NIT Surat',
      course: 'B.Tech Information Technology',
      semester: '7th',
      rollNumber: 'IT2020045',
      department: 'Information Technology',
      startDate: '2025-01-20',
      endDate: '2025-03-20',
      address: 'Surat, Gujarat',
      referredBy: 'Priya Sharma',
      referredByEmpId: 'EMP002',
      submittedDate: '2025-01-16',
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        idProof: 'pan.pdf'
      }
    },
    {
      id: '3',
      internId: 'IOCL-123458',
      name: 'Amit Singh',
      email: 'amit.singh@college.edu',
      phone: '9876543212',
      collegeName: 'Delhi University',
      course: 'MBA Human Resources',
      semester: '3rd',
      rollNumber: 'MBA2023012',
      department: 'Human Resources',
      startDate: '2025-02-01',
      endDate: '2025-04-01',
      address: 'Delhi',
      referredBy: 'Amit Patel',
      referredByEmpId: 'EMP003',
      submittedDate: '2025-01-14',
      documents: {
        photo: 'photo.jpg',
        resume: 'resume.pdf',
        collegeId: 'college_id.pdf',
        lastSemesterResult: 'result.pdf',
        noc: 'noc.pdf',
        idProof: 'aadhar.pdf',
        otherDocument: 'recommendation.pdf'
      }
    }
  ]);

  const handleStatusUpdate = (applicationId: string, newStatus: 'Approved' | 'Rejected') => {
    // Remove the application from the review list after decision
    setApplications(prev => prev.filter(app => app.id !== applicationId));
    setShowModal(false);
    setSelectedApplication(null);
    alert(`Application ${newStatus.toLowerCase()} successfully! Status will be visible in Track Application section.`);
  };

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.internId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.referredBy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <ClipboardList className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Review Applications</h2>
        </div>

        <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-lg mb-6">
          <p className="text-orange-700">
            Review and verify intern applications submitted by employees. Carefully examine all details and documents before approving or rejecting applications. Once reviewed, the status will be reflected in the Track Application section.
          </p>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, intern ID, department, or referrer..."
            />
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{application.name}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Intern ID:</strong> {application.internId}</p>
                      <p><strong>Department:</strong> {application.department}</p>
                      <p><strong>College:</strong> {application.collegeName}</p>
                    </div>
                    <div>
                      <p><strong>Course:</strong> {application.course}</p>
                      <p><strong>Semester:</strong> {application.semester}</p>
                      <p><strong>Duration:</strong> {application.startDate} to {application.endDate}</p>
                    </div>
                    <div>
                      <p><strong>Referred by:</strong> {application.referredBy} ({application.referredByEmpId})</p>
                      <p><strong>Submitted:</strong> {application.submittedDate}</p>
                      <p><strong>Documents:</strong> {Object.values(application.documents).filter(Boolean).length} uploaded</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => {
                      setSelectedApplication(application);
                      setShowModal(true);
                    }}
                    className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
                  >
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'Approved')}
                    className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(application.id, 'Rejected')}
                    className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications found for review.</p>
          </div>
        )}

        {/* Review Modal */}
        {showModal && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-800">Application Review</h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="bg-blue-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Personal Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Name:</strong> {selectedApplication.name}</p>
                        <p><strong>Email:</strong> {selectedApplication.email}</p>
                        <p><strong>Phone:</strong> {selectedApplication.phone}</p>
                      </div>
                      <div>
                        <p><strong>Address:</strong> {selectedApplication.address}</p>
                        <p><strong>Intern ID:</strong> {selectedApplication.internId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="bg-green-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                      <GraduationCap className="h-5 w-5 mr-2" />
                      Academic Information
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>College:</strong> {selectedApplication.collegeName}</p>
                        <p><strong>Course:</strong> {selectedApplication.course}</p>
                        <p><strong>Semester:</strong> {selectedApplication.semester}</p>
                      </div>
                      <div>
                        <p><strong>Roll Number:</strong> {selectedApplication.rollNumber}</p>
                        <p><strong>Department:</strong> {selectedApplication.department}</p>
                      </div>
                    </div>
                  </div>

                  {/* Internship Details */}
                  <div className="bg-orange-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
                      <Building className="h-5 w-5 mr-2" />
                      Internship Details
                    </h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p><strong>Start Date:</strong> {selectedApplication.startDate}</p>
                        <p><strong>End Date:</strong> {selectedApplication.endDate}</p>
                      </div>
                      <div>
                        <p><strong>Referred by:</strong> {selectedApplication.referredBy}</p>
                        <p><strong>Employee ID:</strong> {selectedApplication.referredByEmpId}</p>
                      </div>
                    </div>
                  </div>

                  {/* Documents */}
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Uploaded Documents</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      {Object.entries(selectedApplication.documents).map(([key, value]) => (
                        value && (
                          <div key={key} className="flex items-center justify-between bg-white p-3 rounded-md">
                            <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                            <span className="text-green-600 font-medium">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-4 pt-4 border-t">
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'Rejected')}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Reject Application</span>
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(selectedApplication.id, 'Approved')}
                      className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span>Accept Application</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewApplications;