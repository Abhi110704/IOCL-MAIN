import React, { useState } from 'react';
import { Search, Eye, Download, CheckCircle, Clock, AlertCircle, FileText } from 'lucide-react';

interface Application {
  id: string;
  internId: string;
  name: string;
  department: string;
  status: 'Submitted' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string;
  lastUpdated: string;
  mentor?: string;
  documents: string[];
}

interface TrackApplicationProps {
  user?: {
    empId: string;
    role: 'employee' | 'ld_team' | 'intern' | 'mentor';
    name: string;
  };
}

const TrackApplication: React.FC<TrackApplicationProps> = ({ user }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

  const applications: Application[] = [
    {
      id: '1',
      internId: 'IOCL-123456',
      name: 'Rahul Sharma',
      department: 'Engineering',
      status: 'Approved',
      submittedDate: '2025-01-15',
      lastUpdated: '2025-01-18',
      mentor: 'Dr. Rajesh Kumar',
      documents: ['Resume', 'College ID', 'NOC', 'Medical Certificate']
    },
    {
      id: '2',
      internId: 'IOCL-123457',
      name: 'Priya Patel',
      department: 'Information Technology',
      status: 'Under Review',
      submittedDate: '2025-01-16',
      lastUpdated: '2025-01-17',
      documents: ['Resume', 'College ID', 'NOC']
    },
    {
      id: '3',
      internId: 'IOCL-123458',
      name: 'Amit Singh',
      department: 'Human Resources',
      status: 'Submitted',
      submittedDate: '2025-01-17',
      lastUpdated: '2025-01-17',
      documents: ['Resume', 'College ID']
    },
    {
      id: '4',
      internId: 'IOCL-123459',
      name: 'Neha Gupta',
      department: 'Marketing',
      status: 'Rejected',
      submittedDate: '2025-01-14',
      lastUpdated: '2025-01-16',
      documents: ['Resume', 'College ID', 'NOC']
    },
  ];

  const statusOptions = ['All', 'Submitted', 'Under Review', 'Approved', 'Rejected'];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Submitted':
        return <Clock className="h-4 w-4 text-blue-500" />;
      case 'Under Review':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'Approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'Rejected':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

  const filteredApplications = applications.filter(app => {
    // If user is an intern, only show their own application
    if (user?.role === 'intern') {
      if (app.internId !== user.empId) {
        return false;
      }
    }
    
    const matchesSearch = app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.internId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.department.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const generateApprovalLetter = (application: Application) => {
    // Send email notification (simulated)
    alert(`Approval letter has been sent to ${application.name}'s email address.`);
    
    // Create a new window for the approval letter
    const letterWindow = window.open('', '_blank', 'width=800,height=1000');
    if (letterWindow) {
      letterWindow.document.open();
      letterWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Approval Letter - ${application.internId}</title>
          <style>
            body {
              font-family: 'Times New Roman', serif;
              line-height: 1.6;
              margin: 0;
              padding: 40px;
              background: white;
              color: #000;
              font-size: 14px;
            }
            .certificate-border {
              border: 8px solid #1E40AF;
              border-radius: 15px;
              padding: 40px;
              background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
              box-shadow: 0 10px 25px rgba(0,0,0,0.1);
              min-height: 800px;
            }
            .letterhead {
              text-align: center;
              border-bottom: 4px solid #F97316;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .company-name {
              font-size: 28px;
              font-weight: bold;
              color: #1E40AF;
              margin-bottom: 5px;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .company-subtitle {
              font-size: 18px;
              color: #F97316;
              margin-bottom: 10px;
              font-weight: 600;
            }
            .logo-placeholder {
              width: 80px;
              height: 80px;
              background: linear-gradient(135deg, #1E40AF, #3B82F6);
              border-radius: 50%;
              margin: 0 auto 20px;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: 24px;
            }
            .ref-date {
              display: flex;
              justify-content: space-between;
              margin-bottom: 30px;
              font-weight: bold;
              font-size: 16px;
            }
            .subject {
              text-align: center;
              font-weight: bold;
              text-decoration: underline;
              text-decoration-color: #F97316;
              margin: 20px 0;
              font-size: 18px;
              color: #1E40AF;
            }
            .content {
              text-align: justify;
              margin: 20px 0;
              font-size: 16px;
            }
            .conditions {
              margin: 20px 0;
              padding-left: 20px;
            }
            .conditions li {
              margin-bottom: 10px;
              text-align: justify;
              font-size: 15px;
            }
            .signature {
              margin-top: 50px;
              display: flex;
              justify-content: space-between;
              align-items: end;
            }
            .signature-line {
              border-bottom: 2px solid #1E40AF;
              width: 200px;
              height: 60px;
              margin-bottom: 10px;
            }
            .seal-area {
              width: 100px;
              height: 100px;
              border: 2px dashed #F97316;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 12px;
              color: #F97316;
              text-align: center;
            }
            @media print {
              body { padding: 20px; font-size: 12px; }
              .certificate-border { border-width: 4px; padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="certificate-border">
            <div class="letterhead">
              <div class="logo-placeholder">IOCL</div>
              <div class="company-name">INDIAN OIL CORPORATION LIMITED</div>
              <div class="company-subtitle">Pipelines Division, Noida</div>
            </div>
            
            <div class="ref-date">
              <span>Ref. No: PL/TRG/15</span>
              <span>Date: ${new Date().toLocaleDateString('en-IN')}</span>
            </div>
            
            <div style="margin-bottom: 20px; font-size: 16px;">
              <strong>To</strong><br>
              ${application.name}'s Institute
            </div>
            
            <div class="subject">
              Sub: Approval for Industrial Internship
            </div>
            
            <div style="margin-bottom: 20px; font-size: 16px;">
              Sir/Ma'am,
            </div>
            
            <div class="content">
              We are pleased to inform you that IndianOil Management has accorded the approval for 
              <strong>Mr./Ms. ${application.name}</strong>, to undertake industrial internship from 
              <strong>[Start Date]</strong> to <strong>[End Date]</strong> at Indian Oil Corporation Ltd., 
              Pipelines Division, Noida. During the internship, the student will be assigned a Project 
              under the <strong>${application.department}</strong> Department, subject to the following conditions:
            </div>
            
            <ul class="conditions">
              <li>That this arrangement shall be purely temporary in nature and the student will not be allowed to continue beyond the specified end date.</li>
              <li>The student will arrange on their own, requisite facility for virtual meeting.</li>
              <li>That the student concerned should not have any claim for employment in Corporation during / after completion of training.</li>
              <li>That the student concerned shall not be entitled to any benefit, whatsoever from the Corporation.</li>
              <li>That the training of the student concerned shall be governed by the rules prescribed in this regard by the management for timings, accessibility of records, discipline etc.</li>
              <li>That the Corporation shall not be responsible for delay in completion of aforesaid training.</li>
              <li>That the student shall submit a copy of his/her project with the respective officer, under whose supervision he/she shall undergo his/her training.</li>
              <li>That the student shall not be allowed to include / write anything in study report, which is detrimental to the interest of the Corporation.</li>
              <li>That the student concerned should bear all type of expenses related to his/her project.</li>
              <li>If, at any stage, it is found that student is indulging in activities, which are detrimental to the interest of the Corporation, the student shall not be allowed to continue with his/her training.</li>
              <li>Copyright in any document whether in form of project report, research document or otherwise, developed by the Intern during period of his/her internship and connected to his/her internship with IOCL shall be owned exclusively by IOCL and IOCL shall be free to use the same in any manner whatsoever. However, Intern shall have a right to use the same for non-commercial academic purposes.</li>
            </ul>
            
            <div class="content">
              Thanking you.
            </div>
            
            <div class="signature">
              <div style="text-align: left;">
                <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}
              </div>
              <div class="seal-area">
                OFFICIAL<br>SEAL
              </div>
              <div style="text-align: center;">
                <div class="signature-line"></div>
                <div style="font-size: 14px; font-weight: bold;">
                  (Digitally/uploaded signature of<br>L&D section head with designation)
                </div>
              </div>
            </div>
          </div>
          
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
        </html>
      `);
      letterWindow.document.close();
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center space-x-3 mb-6">
          <FileText className="h-8 w-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Track Application</h2>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg mb-6">
          <p className="text-blue-700">
            This tab ensures transparency in application processing. The stage at which the application 
            is currently at is updated automatically, providing information to both applicants and the L&D team.
          </p>
        </div>

        {/* Search and Filter */}
        {user?.role !== 'intern' && (
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search by name, intern ID, or department..."
            />
          </div>
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          </div>
        )}

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map(application => (
            <div key={application.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{application.name}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full flex items-center space-x-1 ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span>{application.status}</span>
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div>
                      <p><strong>Intern ID:</strong> {application.internId}</p>
                      <p><strong>Department:</strong> {application.department}</p>
                    </div>
                    <div>
                      <p><strong>Submitted:</strong> {application.submittedDate}</p>
                      <p><strong>Last Updated:</strong> {application.lastUpdated}</p>
                    </div>
                    <div>
                      {application.mentor && (
                        <p><strong>Assigned Mentor:</strong> {application.mentor}</p>
                      )}
                      <p><strong>Documents:</strong> {application.documents.length} uploaded</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200">
                    <Eye className="h-4 w-4" />
                    <span>View</span>
                  </button>
                  {application.status === 'Approved' && user?.role === 'ld_team' && (
                    <button
                      onClick={() => generateApprovalLetter(application)}
                      className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-colors duration-200"
                    >
                      <Download className="h-4 w-4" />
                      <span>Send Confirmation Letter</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Status Timeline */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Application Timeline</h4>
                <div className="flex items-center space-x-4 text-sm">
                  <div className={`flex items-center space-x-2 ${
                    ['Submitted', 'Under Review', 'Approved', 'Rejected'].includes(application.status) 
                      ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      ['Submitted', 'Under Review', 'Approved', 'Rejected'].includes(application.status) 
                        ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span>Submitted</span>
                  </div>
                  <div className={`w-8 h-0.5 ${
                    ['Under Review', 'Approved', 'Rejected'].includes(application.status) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className={`flex items-center space-x-2 ${
                    ['Under Review', 'Approved', 'Rejected'].includes(application.status) 
                      ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      ['Under Review', 'Approved', 'Rejected'].includes(application.status) 
                        ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                    <span>Under Review</span>
                  </div>
                  <div className={`w-8 h-0.5 ${
                    ['Approved', 'Rejected'].includes(application.status) 
                      ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <div className={`flex items-center space-x-2 ${
                    application.status === 'Approved' ? 'text-green-600' : 
                    application.status === 'Rejected' ? 'text-red-600' : 'text-gray-400'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      application.status === 'Approved' ? 'bg-green-500' : 
                      application.status === 'Rejected' ? 'bg-red-500' : 'bg-gray-300'
                    }`} />
                    <span>{application.status === 'Rejected' ? 'Rejected' : 'Approved'}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No applications found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackApplication;